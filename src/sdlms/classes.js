'use strict';

const db = require('../database');
const user = require('../user');
const meta = require('../meta');
const utils = require('../controllers/utils');

const Classes = module.exports;

Classes.getClassRoom = async function (tid) {
	const collectionName = db.collections.DEFAULT;
	if (!tid) {
		return  ('INVALID_tid');
	}
	const classRoom = db.findField(collectionName, {
		tid: tid,
		type: "session"
	});
	return classRoom;
};

Classes.startClass = async function (tid, callerUid) {

    const collectionName = db.collections.DEFAULT;
	if (!tid) return  ('INVALID_tid');

	const classRoom = await Classes.getClassRoom(tid);

	if (!classRoom) return ('CLASS_NOT_FOUND');
	if (classRoom.isLive) return ('CLASS_ALREADY_RUNNING');
	if (classRoom.state == 'stop') return ('CLASS_IS_STOPPED');
	if (parseInt(classRoom.teacher_uid, 10) !== parseInt(callerUid, 10)) return ('NOT_AUTHORIZED');


	const payload = {
		isLive: true,
		schedule: Date.now(),
		ended_on: Date.now() + (1000 * 60 * 60),
	};

	const keys = {
		tid: tid,
		type: "session"
	}

	await db.updateFieldWithMultipleKeys(collectionName, keys, payload);

	return {
		status: 'OK',
		data: classRoom,
	};
};

Classes.joinClass = async function (tid, uid) {

	if (!tid) return  ('INVALID_tid');
	if (!uid) return  ('INVALID_UID');

	const classRoom = await Classes.getClassRoom(tid);
	const collectionName = db.collections.DEFAULT;

	if (!classRoom) return ('CLASS_NOT_FOUND');
	if (classRoom.state == 'stop') return ('CLASS_IS_STOPPED');
	if (parseInt(classRoom.teacher_uid, 10) === parseInt(uid, 10)) return ('TEACHER_CANNOT_JOIN');

	const userFields = ['username', 'picture', 'fullname', 'uid'];

	const keys = {
		_key: `attendance:${tid}:${uid}`,
		uid: uid
	}

	const userData = await user.getUserFields(uid, userFields);
	const payload = {
		...keys,
		...userData,
		joinedAt: Date.now(),
		type: 'attendance',
	};

	const state = await db.updateField(collectionName, keys, payload, {
		upsert: true,
	});

	if (state && state.result.upserted) {
		await db.incrementCount(collectionName, {
			_key: `user:${uid}`,
		}, 'classes_attended');
	}
	return {
        status:"OK",
        data:userData
    }
}

Classes.createThought = async function (req) {
	const uid = parseInt(req.uid);
	const group = req.group;

	const tid = parseInt(req.tid);
	const pid = await db.incrObjectField('global', 'nextPid');
	const collectionName = db.collections.SDLMS.POLL;

	let content = req.content;
	let data  = utils.isParsableJSON(req.data  || '') ? JSON.parse(req.data)  : req.data;
	const userFields = ['username', 'displayname', 'picture', 'fullname', 'uid'];
	const userData = await user.getUserFields([uid], userFields);

	let payload = {
		_key: `polls:thought:${group}:${tid}`,
		pid,
		uid,
		content,
		group,
		data,
		votes: [],
		creator:userData,
		createdAt: Date.now(),
		status: 'new',
	}

	return await db.setField(collectionName, payload);
}

Classes.announcePoll = async function (req) {
	const group = req.group;

	const tid = parseInt(req.tid);
	const collectionName = db.collections.SDLMS.POLL;

	const keys = {
		_key: `polls:thought:${group}:${tid}`,
		status: 'new'
	}

	 await db.updateField(collectionName, keys, { $set: {status: 'published'} });
	 return  await db.findFields(collectionName, keys)
}

Classes.getThoughts = async function (req) {
	const group = req.group;

	const tid = parseInt(req.tid);
	const uids = Array.isArray(req.uids) ? req.uids : [];
	const createdAfter = parseInt(req.createdAfter);
	const collectionName = db.collections.SDLMS.POLL;

	const keys = {
		_key: `polls:thought:${group}:${tid}`,
		status: 'new',
	}
	if (uids.length) {
		keys.uid = { $in: uids }
	}
	if (createdAfter) {
		keys.createdAt = { $gt: createdAfter }
	}

	return await db.findFields(collectionName, keys);
}

Classes.voteForThought = async function (req) {
	const uid = parseInt(req.uid);
	const pid = parseInt(req.pid);
	const tid = parseInt(req.tid);

	const group = req.group;
	const userFields = ['username', 'displayname', 'picture', 'fullname', 'uid'];

	const collectionName = db.collections.SDLMS.POLL;
	const userData = await user.getUserFields([uid], userFields);
	userData.createdAt = Date.now();

	const keys = {
		_key: `polls:thought:${group}:${tid}`,
		pid
	}
	await db.updateField(collectionName, { ...keys, 'votes.$.uid': {$ne: uid}}, { $push: { 'votes': userData } });
	return await db.findField(collectionName, keys);
}
