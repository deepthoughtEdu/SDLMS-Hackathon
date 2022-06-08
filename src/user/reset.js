'use strict';

const nconf = require('nconf');
const winston = require('winston');

const user = require('./index');
const groups = require('../groups');
const utils = require('../utils');
const batch = require('../batch');
const events = require('../events');

const db = require('../database');
const meta = require('../meta');
const emailer = require('../emailer');
const Password = require('../password');
const plugins = require('../plugins');

const UserReset = module.exports;

const twoHours = 7200000;

UserReset.validate = async function (code) {
	const uid = await db.getObjectField('reset:uid', code);
	if (!uid) {
		return false;
	}
	const issueDate = await db.sortedSetScore('reset:issueDate', code);
	return parseInt(issueDate, 10) > Date.now() - twoHours;
};

UserReset.generate = async function (uid) {
	const code = utils.generateUUID();
	await Promise.all([
		db.setObjectField('reset:uid', code, uid),
		db.sortedSetAdd('reset:issueDate', Date.now(), code),
	]);
	return code;
};

async function canGenerate(uid) {
	const score = await db.sortedSetScore('reset:issueDate:uid', uid);
	if (score > Date.now() - (1000 * 60)) {
		throw new Error('[[error:reset-rate-limited]]');
	}
}

UserReset.send = async function (email) {
	const uid = await user.getUidByEmail(email);
	const collectionName = db.collections.DEFAULT;

	if (!uid) {
		throw new Error('[[error:invalid-email]]');
	}
	await canGenerate(uid);
	await db.sortedSetAdd('reset:issueDate:uid', Date.now(), uid);
	const code = await UserReset.generate(uid);

	/**
	 * @author imshawan
	 * @date 21-02-2022
	 * @description Generates an otp, binds it with the generated token and is stored to db
	 */
	const OTP = generateOTP(6); // 6 digit OTP
	const state = await db.updateFieldWithMultipleKeys(collectionName,
		{ _key: `reset:password:${uid}` }, { code: code, otp: OTP });
	if (!state) {
		await db.setField(collectionName, {
			_key: `reset:password:${uid}`,
			code: code,
			otp: OTP,
			uid: uid,
		});
	}

	await emailer.send('otp', uid, {
		// reset_link: nconf.get('url') + '/reset/' + code,
		otp: OTP, // Sending the OTP instead of reset token
		subject: '[[email:password-reset-requested]]',
		// template: 'reset',
		template: 'otp',
		uid: uid,
	}).catch(err => winston.error('[emailer.send] ' + err.stack));
};

UserReset.resetAndCommit = async function (caller, data) {
	/**
	 * @author imshawan
	 * @date 25-02-2022
	 * @description Handler for password reset using OTP method (Similar socket.io code, user.js)
	 */
	if (!data || !data.code || !data.password) {
		throw new Error('[[error:invalid-data]]');
	}
	const [uid] = await Promise.all([
		db.getObjectField('reset:uid', data.code),
		UserReset.commit(data.code, data.password),
		plugins.hooks.fire('action:password.reset', { uid: caller.uid }),
	]);

	await events.log({
		type: 'password-reset',
		uid: uid,
		ip: caller.ip,
	});

	const username = await user.getUserField(uid, 'username');
	const now = new Date();
	const parsedDate = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
	await emailer.send('reset_notify', uid, {
		username: username,
		date: parsedDate,
		subject: '[[email:reset.notify.subject]]',
	}).catch(err => winston.error('[emailer.send] ' + err.stack));
};

UserReset.commit = async function (code, password) {
	user.isPasswordValid(password);
	const validated = await UserReset.validate(code);
	if (!validated) {
		throw new Error('[[error:reset-code-not-valid]]');
	}
	const uid = await db.getObjectField('reset:uid', code);
	if (!uid) {
		throw new Error('[[error:reset-code-not-valid]]');
	}
	const userData = await db.getObjectFields(
		'user:' + uid,
		['password', 'passwordExpiry', 'password:shaWrapped']
	);
	const ok = await Password.compare(password, userData.password, !!parseInt(userData['password:shaWrapped'], 10));
	if (ok) {
		throw new Error('[[error:reset-same-password]]');
	}
	const hash = await user.hashPassword(password);
	const data = {
		password: hash,
		'password:shaWrapped': 1,
	};

	// don't verify email if password reset is due to expiry
	const isPasswordExpired = userData.passwordExpiry && userData.passwordExpiry < Date.now();
	if (!isPasswordExpired) {
		data['email:confirmed']	= 1;
		await groups.join('verified-users', uid);
		await groups.leave('unverified-users', uid);
	}
	await user.setUserFields(uid, data);
	await db.deleteObjectField('reset:uid', code);
	await db.sortedSetRemoveBulk([
		['reset:issueDate', code],
		['reset:issueDate:uid', uid],
	]);
	await user.reset.updateExpiry(uid);
	await user.auth.resetLockout(uid);
	await db.delete('uid:' + uid + ':confirm:email:sent');
	await UserReset.cleanByUid(uid);
};

UserReset.updateExpiry = async function (uid) {
	const expireDays = meta.config.passwordExpiryDays;
	if (expireDays > 0) {
		const oneDay = 1000 * 60 * 60 * 24;
		const expiry = Date.now() + (oneDay * expireDays);
		await user.setUserField(uid, 'passwordExpiry', expiry);
	} else {
		await db.deleteObjectField('user:' + uid, 'passwordExpiry');
	}
};

UserReset.clean = async function () {
	const [tokens, uids] = await Promise.all([
		db.getSortedSetRangeByScore('reset:issueDate', 0, -1, '-inf', Date.now() - twoHours),
		db.getSortedSetRangeByScore('reset:issueDate:uid', 0, -1, '-inf', Date.now() - twoHours),
	]);
	if (!tokens.length && !uids.length) {
		return;
	}

	winston.verbose('[UserReset.clean] Removing ' + tokens.length + ' reset tokens from database');
	await cleanTokensAndUids(tokens, uids);
};

UserReset.cleanByUid = async function (uid) {
	const tokensToClean = [];
	uid = parseInt(uid, 10);

	await batch.processSortedSet('reset:issueDate', async function (tokens) {
		const results = await db.getObjectFields('reset:uid', tokens);
		for (var code in results) {
			if (results.hasOwnProperty(code) && parseInt(results[code], 10) === uid) {
				tokensToClean.push(code);
			}
		}
	}, { batch: 500 });

	if (!tokensToClean.length) {
		winston.verbose('[UserReset.cleanByUid] No tokens found for uid (' + uid + ').');
		return;
	}

	winston.verbose('[UserReset.cleanByUid] Found ' + tokensToClean.length + ' token(s), removing...');
	await cleanTokensAndUids(tokensToClean, uid);
};

function generateOTP(length) {
	// Declare a digits variable
	// which stores all digits
	var digits = '0123456789';
	let OTP = '';
	for (let i = 0; i < length; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
}

async function cleanTokensAndUids(tokens, uids) {
	await Promise.all([
		db.deleteObjectFields('reset:uid', tokens),
		db.sortedSetRemove('reset:issueDate', tokens),
		db.sortedSetRemove('reset:issueDate:uid', uids),
	]);
}
