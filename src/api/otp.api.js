/**
 * @author imshawan
 * @date 23-02-2022
 * @description This file contains all the customized OTP sending methods required for the SDLMS
 * @note caller(req), data
 */

'use strict';

const winston = require('winston');
const db = require('../database');
const User = require('../user');

const otpAPI = module.exports;

otpAPI.sendOtp = async function (data) {
	const email = data.body.email;
	if (!email) { throw new Error('No email Id found in request body'); }

	try {
		await User.reset.send(email);
		return { sent: true };
	} catch (err) { throw new Error(err.message); }
};

otpAPI.verifyOtp = async function (data) {
	const collectionName = db.collections.DEFAULT;
	const otp = data.body.otp;
	if (!otp) { throw new Error('No otp Id found in request body'); }
	const OtpData = await db.findField(collectionName, { otp: otp });

	if (!OtpData) { throw new Error('Invalid OTP'); }

	return { code: OtpData.code };
};

otpAPI.resetPassword = async function (data) {
	const collectionName = db.collections.DEFAULT;
	const code = data.body.code;
	if (!code) { throw new Error('No code found in request body'); }

	const password = data.body.password;
	if (!password) { throw new Error('Password was not provided'); }
	const payload = {
		password: password,
		code: code,
	};

	try {
		// Reset the password and clean OTP cache from DB
		await Promise.all([
			User.reset.resetAndCommit(data, payload),
			db.update(collectionName, { code: code }, { $set: { code: null, otp: null } }),
		]);
		return { reset: true };
	} catch (err) { throw new Error(err.message); }
};

