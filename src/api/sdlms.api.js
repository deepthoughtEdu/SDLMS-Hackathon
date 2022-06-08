/**
 * @author imshawan
 * @description This file contains all the customised API tools for the SDLMS
 * @note caller(req), data
 */

'use strict';

const winston = require('winston');
const groups = require('../groups');
const events = require('../events');
const db = require('../database');
const privileges = require('../privileges');
const User = require('../user');
const ObjectId = require('mongodb').ObjectId;
const categories = require('../categories');
const utils = require('../controllers/utils');
const posts = require('../posts');

const sdlmsAPI = module.exports;

sdlmsAPI.deleteGroupBySlug = async function (caller, data) {
	const groupName = await groups.getGroupNameByGroupSlug(data.slug);
	// await isOwner(caller, groupName);
	if (
		groups.systemGroups.includes(groupName) ||
		groups.ephemeralGroups.includes(groupName)
	) {
		throw new Error('[[error:not-allowed]]');
	}

	await groups.destroy(groupName);
	logGroupEvent(caller, 'group-delete', {
		groupName: groupName,
	});
};

sdlmsAPI.getEagleBuilder = async function (data) {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	const tid = parseInt(data.params.tid);
	const keys = {
		$and: [{ $or: [{ topicId: tid }, { tid: tid }] }],
		type: 'eaglebuilder',
	};

	// const query = data.query.id ? ({ ...keys, _id: ObjectId(data.query.id) }) : data.uid;
	const query = {};

	if (data.query.id && isNaN(data.query.id)) {
		query._id = ObjectId(data.query.id);
	} else if (data.query.id) {
		query.pid = parseInt(data.query.id);
	}

	var eagleBuilder;
	if (parseInt(data.query.uid)) {
		const uid = parseInt(data.query.uid);
		keys.$and.push({ $or: [{ userId: uid }, { uid: uid }] });
		// console.log(JSON.stringify(keys))
		// let raw = await db.findFields(collectionName, {...keys, userId: parseInt(data.query.uid)})
		// raw = raw.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).reverse()
		eagleBuilder = await db.findLatestField(collectionName, keys);
	} else eagleBuilder = await db.findField(collectionName, query);

	if (!eagleBuilder) {
		return null;
	}

	if (eagleBuilder.sessionTracker) return null;

	return {
		id: eagleBuilder._id,
		pid: eagleBuilder.pid || null,
		// userId: eagleBuilder.userId,
		meta: eagleBuilder.meta,
		/**
		 * @author Deepansu
		 * @date 12-02-2022
		 * @description This is a temporary fix for the issue of the eaglebuilder not having the tracks
		 * as we have remove public and priveate tracks from the eaglebuilder.
		 * * */
		tracks: eagleBuilder.tracks,
		topicId: eagleBuilder.topicId,
		classCategoryId: eagleBuilder.classCategoryId,
		conclusion: eagleBuilder.conclusion,
		createdAt: eagleBuilder.createdAt,
		stats: eagleBuilder.stats || {},
	};
};

sdlmsAPI.updateEagleBuilder = async function (data) {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	const tid = parseInt(data.params.tid);
	const keys = {
		// "topicId": parseInt(data.params.tid),
		// "userId": luid,
		$and: [{ $or: [{ topicId: tid }, { tid: tid }] }, { $or: [{ userId: luid }, { uid: luid }] }],
		type: 'eaglebuilder',
		// "_id": ObjectId(data.params.id)
	};
	if (data.params.id && isNaN(data.params.id)) {
		keys._id = ObjectId(data.params.id);
	} else if (data.params.id) {
		keys.pid = parseInt(data.params.id);
	}

	const parsedData = {
		meta: data.body.meta,
		tracks: data.body.tracks,
		conclusion: data.body.conclusion,
	};
	if (data.body.stats) parsedData.stats = data.body.stats;
	parsedData.updatedAt = Date.now();

	const state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error('Unauthorized write access!');
	}
	return {
		...state,
		_id: data.params.id,
	};
};

sdlmsAPI.createEagleBuilder = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}

	const collectionName = db.collections.DEFAULT;

	const username = await User.getUserField(uid, 'username');
	const topicId = parseInt(data.params.tid);
	const pid = await db.incrObjectField('global', 'nextPid');
	const currentTime = Date.now();

	const parsedData = {
		// userId: uid,
		pid: pid,
		uid: uid,
		meta: data.body.meta,
		tracks: data.body.tracks,
		classCategoryId: parseInt(data.body.cid) || 1,
		// topicId: topicId,
		tid: topicId,
		createdAt: Date.now(),
		conclusion: data.body.conclusion,
		stats: data.body.stats || {},
		createdAt: currentTime,
		updatedAt: currentTime,
		type: 'eaglebuilder',
	};
	if (data.body.sessionTracker) {
		parsedData.sessionTracker = JSON.parse(data.body.sessionTracker.toLowerCase());
	}
	const resp = await db.setField(collectionName, parsedData);
	await db.updateAssetCount({
		tid: topicId,
		type: 'session',
	}, 'eaglebuilder', 1, {
		userId: uid,
		username: username,
	});
	await db.incrementCount(collectionName, {
		_key: `user:${uid}`,
	});

	return resp;
};

/**
 *
 * @function getsessionTracker
 * @param {*} data => request parameter
 * @returns main eaglebuilder of the session (Session tracker)
 */

sdlmsAPI.getSessionTracker = async function (data) {
	const luid = data.uid;
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	const tid = parseInt(data.params.tid)
	const keys = {
		$or: [{topicId: tid }, {tid: tid}],
		"type": "eaglebuilder",
		"sessionTracker": true
	};

	const eagleBuilder = await db.findField(collectionName, keys);

	if (!eagleBuilder) {
		return null;
	}

	return eagleBuilder;
};

/**
 * @author imshawan
 * @date 10-02-2022
 * @function updateSessionState
 * @description Modifies state of a particular session by its Id
 * @param {Object} data Request body
 * @returns Object, {updated: true} of the state modification is successful
 */
sdlmsAPI.updateSessionState = async function (data) {
	const luid = data.uid;
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	const isTeacher = await privileges.users.isTeacher(luid);
	if (!isTeacher) {
		throw new Error('Not a teacher. Only a teacher can modify session state');
	}

	const state = await db.updateFieldWithMultipleKeys(collectionName, {
		_id: ObjectId(data.body.id),
	}, {
		state: data.body.state,
	});
	if (!state) {
		throw new Error('Unauthorized write access!');
	}
	return state;
};

/**
 * @description Threadbuilder operations (GET, CREATE, UPDATE)
 */
sdlmsAPI.getThreadBuilder = async function (data) {
	const luid = data.uid;
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	const tid = parseInt(data.params.tid);
	var keys = {
		type: 'threadbuilder',
		$or: [{ topicId: tid }, { tid: tid }],
	};
	if (data.params.id && isNaN(data.params.id)) {
		keys._id = ObjectId(data.params.id);
	} else if (data.params.id) {
		keys.pid = parseInt(data.params.id);
	}
	const [threadbuilders] = await Promise.all([
		db.findFields(collectionName, data.params.id ? ({
			_id: ObjectId(data.params.id),
		}) : keys),
	]);

	if (!threadbuilders) {
		return null;
	}

	var threadbuilder = threadbuilders.map(elem => ({
		id: elem._id,
		pid: elem.pid || null,
		userId: elem.userId,
		threads: elem.threads,
		// data: elem[luid == elem.userId ? 'data' : 'public'],
		topicId: elem.topicId,
		classCategoryId: elem.classCategoryId,
		stats: elem.stats || {},
	}));

	return threadbuilder;
};

sdlmsAPI.getThreadBuilderByUid = async function (data) {
	const luid = data.uid;
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	if (!data.query.uid) throw new Error('Missing query parameters');
	const tid = parseInt(data.params.tid);
	const uid = parseInt(data.query.uid);

	var keys = {
		type: 'threadbuilder',
		$and: [{ $or: [{ topicId: tid }, { tid: tid }] }, { $or: [{ userId: uid }, { uid: uid }] }],
	};

	const threadbuilder = await db.findField(collectionName, keys);

	if (!threadbuilder) {
		return null;
	}

	return threadbuilder;
};

sdlmsAPI.createThreadBuilder = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}

	const collectionName = db.collections.DEFAULT;
	const username = await User.getUserField(uid, 'username');
	const topicId = parseInt(data.params.tid);
	const pid = await db.incrObjectField('global', 'nextPid');
	const currentTime = Date.now();

	const parsedData = {
		// userId: uid,
		uid: uid,
		pid: pid,
		threads: data.body.threads,
		classCategoryId: parseInt(data.body.cid) || 1,
		// topicId: topicId,
		tid: topicId,
		stats: data.body.stats || {},
		createdAt: currentTime,
		updatedAt: currentTime,
		type: 'threadbuilder',
	};

	const resp = await db.setField(collectionName, parsedData);

	await db.updateAssetCount({
		tid: topicId,
		type: 'session',
	}, 'threadbuilder', 1, {
		userId: uid,
		username: username,
	});
	console.log(collectionName);
	await db.incrementCount(collectionName, {
		_key: `user:${uid}`,
	});

	return resp;
};

sdlmsAPI.updateThreadBuilder = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	const tid = parseInt(data.params.tid);
	const keys = {
		type: 'threadbuilder',
		/**
		 * @date 23-04-2022
		 * @author imshawan
		 * @description For giving the support for the old TBs that were created before the introduction of the uid and tid
		 * Will be deprecated in the future
		 */
		$and: [{ $or: [{ topicId: tid }, { tid: tid }] }, { $or: [{ userId: uid }, { uid: uid }] }],
	};
	if (isNaN(data.params.id)) {
		keys._id = ObjectId(data.params.id);
	} else {
		keys.pid = parseInt(data.params.id);
	}
	const parsedData = {
		threads: data.body.threads,
	};
	if (data.body.stats) parsedData.stats = data.body.stats;
	parsedData.updatedAt = Date.now();

	const state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error('Unauthorized write access!');
	}
	delete keys.$and;
	return {
		...state,
		_id: data.params.id,
		...keys,
	};
};

/**
 *
 * @description SpreadSheet Controller
 */

sdlmsAPI.getSpreadSheets = async function (data) {
	const luid = data.uid;
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	var keys = {
		type: 'spreadsheet',
	};

	if (data.query.uid) {
		keys = { ...keys, uid: parseInt(data.query.uid) };
	} else {
		keys = { ...keys, uid: luid };
	}

	if (data.query.pid) {
		keys = { ...keys, pid: parseInt(data.query.pid) };
	}

	if (data.query.tid) {
		return await db.findLatestField(collectionName, { ...keys, tid: parseInt(data.query.tid) });
	}
	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limit) || 5;

	const [spreadsheets, count] = await Promise.all([
		db.getFieldsWithPagination(collectionName, keys, limit, page),
		db.countDocuments(collectionName, keys),
	]);

	return utils.paginate(`/sdlms${data.url}`, spreadsheets, count, limit, page);
};

sdlmsAPI.createSpreadSheet = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	let isGlobal = false;
	const username = await User.getUserField(uid, 'username');
	let creator = 'student';

	let topicId = parseInt(data.body.tid);
	if (!topicId) {
		isGlobal = true;
		topicId = await db.findField(collectionName, { _key: 'global:assets:spreadsheet' });
		topicId = topicId.tid;
	} else if (topicId) {
		const session = await db.findField(collectionName, { tid: topicId });
		if (session && session.teacher_uid) {
			if (session.teacher_uid == uid) {
				creator = 'teacher';
			}
		}
	}
	const pid = await db.incrObjectField('global', 'nextPid');
	const currentTime = Date.now();

	const parsedData = {
		pid: pid,
		uid: uid,
		data: data.body.data,
		classCategoryId: parseInt(data.body.cid) || 1,
		title: data.body.title,
		tid: topicId,
		stats: data.body.stats || {},
		created_by: creator,
		createdAt: currentTime,
		updatedAt: currentTime,
		type: 'spreadsheet',
	};
	if (isGlobal) {
		parsedData.isGlobal = isGlobal;
	}
	const resp = await db.setField(collectionName, parsedData);
	if (isGlobal) {
		await db.updateAssetCount({
			tid: topicId,
			type: 'session' }, 'spreadsheet', 1, {
			uid: uid,
			username: username,
		});
	}
	await db.incrementCount(collectionName, {
		_key: `user:${uid}`,
	});
	return resp;
};

sdlmsAPI.updateSpreadSheet = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	const keys = {
		pid: parseInt(data.params.pid),
		uid: uid,
		type: 'spreadsheet',
	};
	if (data.body.tid) keys.tid = parseInt(data.body.tid);

	const parsedData = {};
	if (data.body.data) {
		parsedData.data = data.body.data;
	}
	if (data.body.title) parsedData.title = data.body.title;
	if (data.body.stats) parsedData.stats = data.body.stats;
	parsedData.updatedAt = Date.now();

	const state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error('Unauthorized write access!');
	}
	return {
		...state,
		pid: data.params.pid,
	};
};

sdlmsAPI.deleteSpreadSheet = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const keys = {
		pid: parseInt(data.params.pid),
		uid: uid,
		type: 'spreadsheet',
	};
	const collectionName = db.collections.DEFAULT;
	const state = await db.removeField(collectionName, keys);
	if (state.result.n === 1) {
		return {
			deleted: true,
		};
	}
	return {
		deleted: false,
	};
};

/**
 * @description Threadbuilder operations (GET, CREATE, UPDATE)
 */
sdlmsAPI.getQuiz = async function (data) {
	var keys = {
		tid: parseInt(data.params.tid),
		type: 'quiz',
	};
	const collectionName = db.collections.DEFAULT;
	const luid = data.uid;
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}

	const [quizzes] = await Promise.all([
		db.findFields(collectionName, data.params.id ? ({
			_id: ObjectId(data.params.id),
		}) : keys),
	]);

	if (!quizzes) {
		return null;
	}

	var quiz = quizzes.map(elem => ({
		id: elem._id,
		cid: elem.cid || null,
		pid: elem.pid || null,
		uid: elem.uid,
		data: elem.data,
		tid: elem.tid,
		classCategoryId: elem.classCategoryId,
	}));

	return quiz;
};

sdlmsAPI.createQuiz = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}

	const collectionName = db.collections.DEFAULT;
	const username = await User.getUserField(uid, 'username');
	const topicId = parseInt(data.params.tid);
	const pid = await db.incrObjectField('global', 'nextPid');
	const categoryInfo = await getCustomCategory('quizzes');
	const currentTime = Date.now();

	const parsedData = {
		uid: uid,
		cid: categoryInfo.cid || 0,
		pid: pid,
		data: data.body.data,
		classCategoryId: parseInt(data.body.cid) || 1,
		tid: topicId,
		createdAt: currentTime,
		updatedAt: currentTime,
		type: 'quiz',
	};
	const resp = await db.setField(collectionName, parsedData);
	await db.updateAssetCount({
		tid: topicId,
		type: 'session',
	}, 'quiz', 1, {
		userId: uid,
		username: username,
	});

	await db.incrementCount(collectionName, {
		_key: `user:${uid}`,
	});

	return {
		_id: resp._id,
	};
};

sdlmsAPI.updateQuiz = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	const keys = {
		tid: parseInt(data.params.tid),
		uid: uid,
		type: 'quiz',
		_id: ObjectId(data.params.id),
	};
	const parsedData = {
		data: data.body.data,
	};
	parsedData.updatedAt = Date.now();

	const state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error('Unauthorized write access!');
	}
	return state;
};

sdlmsAPI.getAllAssetsBasedOnUser = async function (data) {
	const collectionName = db.collections.DEFAULT;
	const uid = parseInt(data.params.uid);
	const tid = parseInt(data.params.tid);
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}

	const keys = {
		userId: uid,
		topicId: tid,
	};
	const [eb, tb, quiz] = await Promise.all([
		db.findFields(collectionName, {
			...keys,
			type: 'eaglebuilder',
		}),
		db.findFields(collectionName, {
			...keys,
			type: 'threadbuilder',
		}),
		db.findFields(collectionName, {
			...keys,
			type: 'quiz',
		}),
	]);

	const eaglebuilders = eb.filter(e => ((e.userId == luid) || (e.userId != luid && e.public))).map(elem => ({
		id: elem._id,
		title: elem.meta.title,
	}));
	const threadbuilders = tb.filter(e => ((e.userId == luid) || (e.userId != luid && e.public))).map(elem => ({
		id: elem._id,
		title: elem.data.threads ? elem.data.threads[0].title : undefined,
	}));
	const quizzes = quiz.filter(e => ((e.userId == luid) || (e.userId != luid && e.public))).map(elem => ({
		id: elem._id,
	}));

	return {
		uid: uid,
		widgets: {
			eaglebuilders: eaglebuilders,
			threadbuilders: threadbuilders,
			quizzes: quizzes,
		},
	};
};
sdlmsAPI.markPublicBasedOnUser = async function (data) {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	const [asset] = await Promise.all([
		db.findField(collectionName, data.params.id ? ({
			_id: ObjectId(data.params.id),
		}) : keys),
	]);
	const types = {
		threadbuilder: 'data',
		quiz: 'data',
		eaglebuilder: 'tracks',
	};
	if (asset.userId != luid) {
		throw new Error('Unauthorized');
	}
	const keys = {
		_id: ObjectId(data.params.id),
	};
	const parsedData = {
		public: asset[types[asset.type]] || [],
	};
	const state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error('Unauthorized write access!');
	}
	return state;
};


sdlmsAPI.joinClass = async function (caller) {
	const uid = parseInt(caller.uid);
	if (!caller.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	const tid = parseInt(caller.params.tid);
	const key = {
		tid: tid,
		type: 'session',
	};
	var Session = await db.findFields(collectionName, key);
	Session = Session[0];
	if (!Session.members.includes(uid)) {
		throw new Error('Not a part of this session');
	}

	await sdlmsAPI.recordAttendance({ tid, uid });
};

/**
 * @date 31-03-2022
 * @author imshawan
 * @function recordAttendance
 * @description This function is used to record attendance of a user in a session
 * @param {Object} data tid and uid
 * @returns {Object} joined as true, if user joined the class
 */
sdlmsAPI.recordAttendance = async function (data) {
	const uid = parseInt(data.uid);
	const topicId = parseInt(data.tid);
	const collectionName = db.collections.DEFAULT;

	const userFields = ['username', 'picture', 'fullname', 'uid'];
	const keys = { _key: `attendance:${topicId}:${uid}`, uid: uid };
	const alreadyRecorded = await db.countDocuments(collectionName, keys);
	if (alreadyRecorded) return { joined: true };

	const [userData] = await Promise.all([
		User.getUserFields([uid], userFields),
	]);
	if (!userData.picture) {
		userData.picture = 'https://sdlms.deepthought.education/assets/uploads/files/files/files/default_profile.png';
	}
	const currentTimestamp = Date.now();
	const payload = {
		...keys,
		tid: topicId,
		...userData,
		joinedAt: currentTimestamp,
		stats: {
			eb: { timestamp: currentTimestamp, count: { characters: 0, words: 0 } },
			tb: { timestamp: currentTimestamp, count: { characters: 0, words: 0 } },
		},
		type: 'attendance',
	};
	const state = await db.updateField(collectionName, keys, payload, {
		upsert: true,
	});
	if (state && state.result.upserted) {
		// If it's a new entry, increment the attendance count
		await db.incrementCount(collectionName, {
			_key: `user:${uid}`,
		}, 'classes_attended');
	}
	return {
		joined: true,
	};
};

sdlmsAPI.getAttendance = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}

	const collectionName = db.collections.DEFAULT;
	const keys = {
		tid: parseInt(data.params.tid),
		type: 'attendance',
	};

	const search = {};

	if (data.query.key) {
		search[data.query.key] = isNaN(data.query.query) ? {
			$regex: data.query.query,
		} : parseInt(data.query.query);
	}

	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limit) || 5;
	const [attendance, count] = await Promise.all([
		db.getFieldsWithPagination(collectionName, {
			...keys,
			...search,
		}, limit, page),
		db.countDocuments(collectionName, {
			...keys,
			...search,
		}),
	]);

	return utils.paginate(`/sdlms${data.url}`, attendance, count, limit, page);
};

sdlmsAPI.getFeedbackData = async function (data) {
	const collectionName = db.collections.DEFAULT;
	if (data.query &&
		Object.keys(data.query).length === 0 &&
		Object.getPrototypeOf(data.query) === Object.prototype) {
		throw new Error('Missing query parameters');
	}

	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}

	const keys = {
		type: 'feedback',
	};
	/**
	 * @author Shubham Bawner
	 * @date 19th March 22
	 * @description if sessonID and user id is passed, then get the feedbacks for the user(received by him) in ALL those sessions
	 */ //----
	//! I have taken attachment_id as Object IDs of events, and not as session tids(in sence of naming), as the latest documents in database have it as tids, but older ones also had tids!
	if (data.query.sessionIDs && data.query.uid) {
		const IDs = data.query.sessionIDs.split(',');

		// ? do we need only feedbacks of which child is creator, or only those which are received by him, or both? (default I am taking only received)
		const type = data.query.type || 'received';
		const query = type == 'received' ? {
			asset_owner_uid: parseInt(data.query.uid),
		} : {
			creator: parseInt(data.query.uid),
		};

		// ? how do I paginate this?(do I even need to?)
		const sessionsFeedbackData = {};

		for (let i = 0; i < IDs.length && i < 10; i++) {
			const resp = await db.findFields(collectionName, {
				attachment_id: IDs[i],
				...query,
				type: 'feedback',
			});
			sessionsFeedbackData[IDs[i]] = resp || [];
		}

		//* this dosnt work
		// let sessionsFeedbackData = IDs.map(async (id) => {
		// 	let resp =  await db.findFields(collectionName, { attachment_id:id, ...query, type: "feedback" });
		// }

		//* this works
		// let sessionsFeedbackData = await Promise.all(IDs.map( (id) => {
		// 	let sessionFeedbackData = db.findFields(collectionName, { attachment_id:id, ...query, type: "feedback" });
		// 	return sessionFeedbackData;
		// }) )


		return sessionsFeedbackData;
	}

	//----
	if (data.query.id) {
		return await db.findFields(collectionName, {
			...keys,
			attachment_id: data.query.id,
		});
	}
	if (data.query.uid) {
		const page = parseInt(data.query.page) || 0;
		const limit = parseInt(data.query.limit) || 5;
		const type = data.query.type || 'received';
		const query = type == 'received' ? {
			asset_owner_uid: parseInt(data.query.uid),
		} : {
			creator: parseInt(data.query.uid),
		};

		const [feedbackData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, {
				...keys,
				...query,
			}, limit, page),
			db.countDocuments(collectionName, {
				...keys,
				...query,
			}),
		]);
		const feedbacks = await Promise.all(feedbackData.map(async (feedback) => {
			const userData = await User.getUserFields([feedback.asset_owner_uid], ['picture', 'fullname', 'username']);
			return {
				...feedback,
				feedback_to: userData,
			};
		}));

		return utils.paginate(`/sdlms${data.url}`, feedbacks, count, limit, page);
	}
};

sdlmsAPI.createFeedback = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}

	const collectionName = db.collections.DEFAULT;
	const asset_owner_uid = parseInt(data.body.asset_owner_uid);
	const [UserFields, feedbackFor, asset_owner] = await Promise.all([
		User.getUserFields([uid], ['picture', 'fullname']),
		db.findField(collectionName, {
			_id: ObjectId(data.body.attachment_id),
		}),
		User.getUserFields([asset_owner_uid], ['fullname']),
	]);
	const currentTime = Date.now();
	const feedbackTo = await User.getUserFields([feedbackFor.userId], ['picture', 'fullname']);

	const feedback = {
		created: currentTime,
		modified: currentTime,
		topic: data.body.topic,
		content: data.body.content,
		asset_owner_uid: asset_owner_uid,
		asset_owner_name: asset_owner.fullname,
		feedback_for: feedbackFor.type,
		// We will have to get the user info while fetching the feedbacks
		feedback_to: feedbackTo,
		//  attachment_id: parseInt(data.body.attachment_id),
		/**
		 * @author Deepansu
		 * removing parseInt bcz it was converting 61c083c7f4d46f184c2463f7 to 61
		 * parseInt('61c083c7f4d46f184c2463f7') = 61
		 * */
		attachment_id: (data.body.attachment_id),
		attachment_type: data.body.attachment_type,
		attachments: data.body.attachments,
		pings: data.body.pings,
		creator: uid,
		fullname: UserFields.fullname,
		profile_picture_url: UserFields.picture,
		created_by_admin: false,
		created_by_current_user: false,
		upvote_count: 0,
		votes: [],
		user_has_upvoted: false,
		is_new: true,
		type: 'feedback',
	};
	if (data.body.parent) {
		feedback.parent = data.body.parent;
	}

	const resp = await db.setField(collectionName, feedback);
	return {
		id: resp._id,
	};
};

sdlmsAPI.updateFeedback = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;

	const keys = {
		creator: uid,
		_id: ObjectId(data.params.id),
	};
	const currentTime = Date.now();
	const parsedData = {
		modified: currentTime,
	};
	const dataElements = ['content', 'attachments', 'pings', 'upvote_count'];
	dataElements.forEach((elem) => {
		if (data.body[elem]) {
			parsedData[elem] = data.body[elem];
		}
	});
	if (data.body.is_new) {
		parsedData.is_new = JSON.parse(data.body.is_new.toLowerCase());
	}
	const state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error('Unauthorized write access!');
	}
	return state;
};

sdlmsAPI.deleteFeedback = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}

	const collectionName = db.collections.DEFAULT;
	const keys = {
		creator: uid,
		_id: ObjectId(data.params.id),
	};
	const record = await db.findField(collectionName, keys);
	if (!record) {
		throw new Error('Unauthorized delete access!');
	}

	const state = await db.removeField(collectionName, keys);
	if (state.result.n === 1) {
		return {
			deleted: true,
		};
	}
	return {
		deleted: false,
	};
};

/**
 *
 * @author imshawan
 * @date 14-02-2022
 * @function getSessions
 * @description Takes the limit and page number as query params (page, limitBy) and returns an array of sessions in paginated format.
 * @param {Object} data Request object
 * @returns Sessions, current page and total number of documents in the page
 */
sdlmsAPI.getSessions = async function (data) {
	let uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}

	const collectionName = db.collections.DEFAULT;

	const query = data.query;

	/**
	 * @author Shubham Bawner
	 * @date 14-02-2022
	 * @description: if its parent give him his chil's session data
	 */

	if (query.child_uid) {
		const children = await groups.getChildren(uid);
		if (children && children.includes(parseInt(query.child_uid))) {
			uid = parseInt(query.child_uid);
		}
	}

	const page = parseInt(query.page) || 0;
	const limit = parseInt(query.limitBy) || 5;
	const type = query.type;

	const keys = {
		type: 'session',
		members: { $all: [parseInt(uid)] },
	};
	// 7 :00  isLive --> current Session

	// !isLive && sche > currentTime --> upcoming sessions
	// we have to check is isLive exists as isLive property doesn't exist for upcoming sessions

	// sche <= currentTime && ended_on > currentTime --> current [Next session on 8th march]

	// !isLive && sche < currentTime && ended_on < currentTime --> Previous sessions

	// upcoming / previous / current

	if (type == 'upcoming') {
		keys.state = { $ne: 'stop' };
		// keys.schedule = { $gte: Date.now() - 3600000 };
		// keys.ended_on = {
		// 	$gt: Date.now()
		// };
	} else if (type == 'previous') {
		keys.isLive = { $eq: false };
		keys.schedule = {
			$lt: Date.now(),
		};
		keys.state = { $eq: 'stop' };
		keys.$or = [{ ended_on: { $lt: Date.now() } }, { ended_on: { $eq: null } }];
	} else if (type == 'current') {
		keys.schedule = { $lte: Date.now() };
		keys.ended_on = { $gte: Date.now() };
	}

	let [sessions, count] = await Promise.all([
		db.getFieldsWithPagination(collectionName, keys, limit, page),
		db.countDocuments(collectionName, keys),
	]);
	if (type == 'previous') {
		sessions = await Promise.all(sessions.map(async (elem) => {
			const [threadbuilder, eaglebuilder] = await Promise.all([
				db.findField(collectionName, {
					topicId: elem.tid,
					userId: uid,
					type: 'threadbuilder',
				}),
				db.findField(collectionName, {
					topicId: elem.tid,
					userId: uid,
					type: 'eaglebuilder',
				}),
			]);
			return {
				...elem,
				threadbuilderStats: threadbuilder ? threadbuilder.stats : {},
				eaglebuilderStats: eaglebuilder ? eaglebuilder.stats : {},
			};
		}));
	}

	sessions = sessions.sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime());
	return utils.paginate(`/sdlms${data.url}`, sessions, count, limit, page);
};

sdlmsAPI.vote = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	const key = {
		_id: ObjectId(data.params.id),
	};
	const feedback = await db.findField(collectionName, key);
	if (!feedback) {
		throw new Error('Invalid feedback Id');
	}
	let votes = feedback.votes || [];

	// if (votes.includes(uid)) {
	// 	votes.splice(votes.IndexOf(uid), 1)
	// }
	// else {
	// 	votes.push(uid)
	// }

	/**
	 * @author Deepansu
	 * above commented code was throwing Error so adding New one
	 *
	 */

	(Array.isArray(votes) ? votes : []).find(vote => vote.uid == uid) ?
		(votes = votes.filter(vote => vote.uid != uid)) :
		votes.push({
			uid: uid,
			created: Date.now(),
		});

	const state = await db.updateFieldWithMultipleKeys(collectionName, key, {
		votes: votes,
		upvote_count: votes.length,
	});
	if (!state) {
		throw new Error('Unauthorized write access!');
	}
	return state;
};

sdlmsAPI.getBatches = async (data) => {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	const categoryFields = ['name', 'cid'];

	const key = {
		categoryType: 'batch',
	};
	if (data.query.cid) {
		const cid = parseInt(data.query.cid);
		const batch = await db.findField(collectionName, {
			...key,
			cid: cid,
		}, categoryFields);
		if (batch) {
			return {
				...batch,
				parent: await db.findField(collectionName, {
					cid: batch.parentCid,
				}, categoryFields),
			};
		} return null;
	}
	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limit) || 5;
	const [batches, count] = await Promise.all([
		db.getFieldsWithPagination(collectionName, key, limit, page),
		db.countDocuments(collectionName, key),
	]);

	const batchData = await Promise.all(batches.map(async (elem) => {
		if (elem.parentCid) {
			const elems = {};
			categoryFields.forEach((e) => {
				if (elem[e]) elems[e] = elem[e];
			});
			return {
				...elems,
				parent: await db.findField(collectionName, {
					cid: elem.parentCid,
				}, categoryFields),
			};
		}
	}));

	return utils.paginate(`/sdlms${data.url}`, batchData, count, limit, page);
};

sdlmsAPI.createBatch = async (data) => {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	const isTeacher = await privileges.users.isTeacher(uid);
	const isAdmin = await User.isAdministrator(uid);
	if (isTeacher || isAdmin) {
		const classCategoryId = parseInt(data.body.classCategoryId);
		const batchName = data.body.batchName;
		const categoryData = await db.findField(collectionName, {
			cid: classCategoryId,
		});
		if (!categoryData) throw new Error(`Category with the Id: ${classCategoryId} doesn't exist`);
		if (categoryData.categoryType && categoryData.categoryType != 'class') {
			throw new Error('The category is not of type \'class\'');
		}
		const category = {
			name: batchName,
			created: data.body.created || Date.now(),
			categoryType: 'batch',
		};
		if (data.body.description) category.description = data.body.description;
		if (data.body.cohortName) category.cohortName = data.body.cohortName;
		if (data.body.batchType) category.batchType = data.body.batchType;
		if (data.body.teachingStyle) category.teachingStyle = data.body.teachingStyle;
		if (data.body.TeachingStyleId) category.TeachingStyleId = data.body.TeachingStyleId;

		return await getCustomCategory(category, classCategoryId);
	}
	throw new Error('Unauthorized');
};

sdlmsAPI.updateBatch = async (data) => {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	const isTeacher = await privileges.users.isTeacher(uid);
	const isAdmin = await User.isAdministrator(uid);
	if (isTeacher || isAdmin) {
		const batchName = data.body.batchName;
		const batchId = data.params.cid;
		const batch = await db.findField(collectionName, {
			cid: batchId,
		});
		if (batch) throw new Error(`Batch with the cid: ${batchId} doesn't exist`);
		const batchData = { name: batchName };
		if (data.body.description) batchData.description = data.body.description;

		const payload = {};
		if (data.body.cohortName) payload.cohortName = data.body.cohortName;
		if (data.body.batchType) payload.batchType = data.body.batchType;
		if (data.body.teachingStyle) payload.teachingStyle = data.body.teachingStyle;
		if (data.body.TeachingStyleId) payload.TeachingStyleId = data.body.TeachingStyleId;

		await Promise.all([
			categories.update({ [batchId]: batchData }),
			db.update(collectionName, { cid: parseInt(batchId), categoryType: 'batch' }, { $set: payload }),
		]);
		return {
			modified: true,
		};
	}
	throw new Error('Unauthorized');
};

sdlmsAPI.deleteBatch = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error('Unauthorized');
	}
	const collectionName = db.collections.DEFAULT;
	const isTeacher = await privileges.users.isTeacher(luid);
	const isAdmin = await User.isAdministrator(luid);
	if (!isTeacher || !isAdmin) {
		const batchId = parseInt(data.params.cid);
		const batch = await db.findField(collectionName, {
			cid: batchId,
		});
		if (!batch) throw new Error(`Batch with the cid: ${batchId} doesn't exist`);

		await categories.purge(batchId, batch.uid);
		return {
			deleted: true,
		};
	}
	throw new Error('Unauthorized');
};

function logGroupEvent(caller, event, additional) {
	events.log({
		type: event,
		uid: caller.uid,
		ip: caller.ip,
		...additional,
	});
}


// async function verifyCategory (category, sub_category) {
// 	const categoryData = await db.findFields(collectionName, { 'categoryType': { $exists: true }}, ['cid', 'name', 'parentCid']);
// 	const sub_categories = categoryData.filter(e => e.parentCid > 0);
// 	const parent_categories = categoryData.filter(e => e.parentCid < 1 || e.parentCid === undefined);

// 	return new Promise((resolve, reject) => {
// 		let main_category = parent_categories.filter(e => e.name == category);
// 		if (main_category.length != 1) {
// 			reject(`Category with the name '${category}' doesn't exist`);
// 		}
// 		let secondary_preference = sub_categories.filter(e => e.name == sub_category);
// 		if (secondary_preference.length != 1) {
// 			reject(`Sub category with the name '${sub_category}' doesn't exist`);
// 		}
// 		if (main_category[0].cid != secondary_preference[0].parentCid) {
// 			reject(`'${secondary_preference[0].name}' is not a part of '${main_category[0].name}'`);
// 		}
// 		resolve(secondary_preference[0])
// 	});

//  }

/**
 *
 * @author imshawan
 * @function getCustomCategory
 * @param {String} category
 * @param {Integer} parent Parent Category Id
 * @description If the category exists then it will return back the category data or else it will create a new category and return it
 * @returns Category Information
 */

async function getCustomCategory(category, parent = 0) {
	const collectionName = db.collections.DEFAULT;
	const admin = await db.findFields(collectionName, {
		_key: 'group:administrators:members',
	});
	const adminUID = parseInt(admin.reverse()[0].value);
	const data = {
		...category,
		description: '',
		icon: 'fa-comments',
		uid: adminUID, // admin user Id
		parentCid: parent,
		cloneFromCid: 0,
		custom: true,
	};
	let categoryData = await db.findField(collectionName, {
		cid: {
			$exists: true,
			$ne: null,
		},
		parentCid: parent,
		custom: true,
		name: category.name,
	});
	if (!categoryData) categoryData = await categories.create(data);
	return categoryData;
}

/**
 * @author Deepansu 2022-03-20
 * @function getShareLink
 * @param {String} url
 * */
sdlmsAPI.getShareLink = async function (req) {
	const data = req.body;
	const payload = {};
	let response = {};

	payload.name = 'sharer';

	switch (data.type) {
		case 'class':
			response = await getSessionSharableLink(data, data.type);
			break;

		case 'spreadsheet':
		case 'eaglebuilder':
		case 'threadbuilder':
		case 'article':
		response = await getAssetSharableLink(data, data.type);
		break;

		default:
			throw new Error('Invalid Type');
			break;
	}
	return response;
};

async function getSessionSharableLink(data, type) {
	var tid = isNaN(data.tid) ? 0 : Number(data.tid);
	var now = new Date();
	if (!tid) throw new Error('Invalid tid supplied');

	const collectionName = db.collections.DEFAULT;

	var session = await db.findField(collectionName, {
		type: 'session',
		tid: tid,
	});
	if (!session) throw new Error(`No ${type} Found against tid: ${data.tid}`);

	if (session.sharer) {
		if (now.getTime() <= session.sharer.expireAt) {
			return session.sharer;
		}
	}
	const payload = {};
	payload.tid = tid;
	payload.type = type;
	payload.parent_id = session._id;

	if (!data.expireAt) {
		throw new Error('Expiry Date is not valid');
	}
	if (now.getTime() >= payload.expireAt) {
		throw new Error('Expiry Date is not valid');
	}
	// by default + one year from now
	payload.expireAt = data.expireAt;

	var uuid = utils.generateUUID();
	payload.uuid = uuid + '-' + now.getTime();
	payload.pid = await db.incrObjectField('global', 'nextPid');
	const resp = await db.setField(collectionName, payload);
	if (!resp) throw new Error(`Unable to Generate Link at this time. Please Try again`);

	var share_id = payload.uuid;
	var keys = {
		tid: tid,
		type: 'session',
	};
	session.sharer = session.sharer || {};
	session.sharer.link = `/sharer?id=${share_id}`;
	session.sharer.id = share_id;
	session.sharer.expireAt = payload.expireAt;
	session.sharer.count = isNaN(session.count) ? 1 : (session.count + 1);


	var updated = await db.update(collectionName, keys,
		{ $set: { sharer: asset.share } });

	if (!updated) throw new Error('Link has been Generated but Can\'t save it. Please Try again in a moment');

	return session.sharer;
}

async function getAssetSharableLink(data, type) {
	const payload = {};
	var pid = isNaN(data.pid) ? 0 : Number(data.pid);
	var now = new Date();
	if (!pid) throw new Error('Invalid pid supplied');

	const collectionName = db.collections.DEFAULT;

	var asset = await db.findField(collectionName, {
		type: type,
		pid: pid,
	});
	// console.log(asset);
	if (!asset) throw new Error(`No ${type} Found against tid: ${data.pid}`);


	if (asset.sharer) {
		if (now.getTime() <= asset.sharer.expireAt) {
			return asset.sharer;
		}
	}

	payload.tid = pid;
	payload.type = type;
	payload.parent_id = asset._id;

	if (!data.expireAt) {
		throw new Error('Expiry Date is not valid');
	}
	if (now.getTime() >= payload.expireAt) {
		throw new Error('Expiry Date is not valid');
	}
	// by default + one year from now
	payload.expireAt = data.expireAt;

	var uuid = utils.generateUUID();
	payload.uuid = uuid + '-' + now.getTime();
	payload.pid = await db.incrObjectField('global', 'nextPid');
	const resp = await db.setField(collectionName, payload);
	if (!resp) throw new Error(`Unable to Generate Link at this time. Please Try again`);

	const share_id = payload.uuid;
	const keys = {
		pid: pid,
		type: type,
	};
	asset.sharer = asset.sharer || {};
	asset.sharer.link = `/sharer?id=${share_id}`;
	asset.sharer.id = share_id;
	asset.sharer.expireAt = payload.expireAt;
	asset.sharer.count = isNaN(asset.count) ? 1 : (asset.count + 1);

	const updated = await db.updateFieldWithMultipleKeys(collectionName, keys, {
		sharer: asset.sharer,
	});
	if (!updated) throw new Error('Link has been Generated but Can\'t save it. Please Try again in a moment');
	return asset.sharer;
}

/**
 * @author Shubham Bawner
 * @function crud for comments
 * @date 2022-04-24
 *
 */

sdlmsAPI.comment = async function (req, res, next) {
	const data = req.body;
	data.uid = req.uid;
	data.content = data.content.toString();
	data.typeOfAsset = 'comment';
	data.toPid = req.toPid;

	if (!data.content) throw new Error('Comment cannot be empty');
	if (data.content.length > 5000) throw new Error('Comment cannot be more than 5000 characters');

	if (!data.toPid && !data.tid) throw new Error('Invalid tid or Invalid toPid, one of them required!');

	const comment = await posts.create(data);
	if (!comment) throw new Error('Comment not created');
	return comment;
};

sdlmsAPI.editComment = async function (req, res, next) {
	const data = req.body;
	data.uid = req.uid;
	data.pid = data.pid;
	if (!data.pid) throw new Error('pid required!');
	if (!data.uid) throw new Error('login first!');


	data.content = data.content.toString();
	if (!data.content) throw new Error('Comment cannot be empty');
	if (data.content.length > 5000) throw new Error('Comment cannot be more than 5000 characters');

	const comment = await posts.edit(data);
	if (!comment) throw new Error('Comment not updated');
	return comment;
};

sdlmsAPI.getComments = async function (req, res, next) {
	const collectionName = db.collections.DEFAULT;
	const data = req.query;

	if (!data.toPid && !data.tid) throw new Error('Invalid tid or Invalid toPid, one of them required!');

	let comments = [];
	if (data.isNum) {
		if (data.toPid) comments = await db.findFields(collectionName, { typeOfAsset: 'comment', toPid: parseInt(data.toPid) });
		else comments = await db.findFields(collectionName, { typeOfAsset: 'comment', tid: parseInt(data.tid) });
	} else if (data.toPid) comments = await db.findFields(collectionName, { typeOfAsset: 'comment', toPid: data.toPid });
	else comments = await db.findFields(collectionName, { typeOfAsset: 'comment', tid: data.tid });
	if (!comments) throw new Error('Comments not found');
	return comments;
};

sdlmsAPI.deleteComment = async function (req, res, next) {
	const uid = req.uid;
	const pid = req.params.pid;
	if (!pid) throw new Error('pid required!');
	if (!uid) throw new Error('login first!');

	await posts.delete(pid, uid);
	await posts.purge(pid, uid);
	return { deleted: true };
};

/**
 * TODO delete Comment api is not working properly
 * TODO testing left for creating with toPid
 */


sdlmsAPI.createPoll = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error("Unauthorized");
	}
	const collectionName = db.collections.SDLMS.POLL;
	const tid = parseInt(data.body.tid);
	if (!tid) {
		throw new Error("tid was not supplied");
	}
	const pid = await db.incrObjectField('global', 'nextPid');
	const payload = {
		_key: `class:polls:${tid}`,
        uid: uid,
        pid: pid,
		responses: [],
    }
	if (req.body.content) {
		let content = req.body.content;
		if (!utilities.isJSON(content)) {
			content = JSON.parse(content);	
		}
		payload.content = content;
	}

	return await db.setField(collectionName, payload);
}

sdlmsAPI.respondToPoll = async function (data) {
	const uid = parseInt(data.uid);
	if (!data.uid || uid < 1) {
		throw new Error("Unauthorized");
	}
	const collectionName = db.collections.SDLMS.POLL;
	const tid = parseInt(data.body.tid);
	const pid = parseInt(data.body.pid);
	if (!tid) {
		throw new Error("tid was not supplied");
	}
	if (!pid) {
		throw new Error("pid was not supplied");
	}

	const keys = {
		_key: `class:polls:${tid}`,
		pid,
		tid
	}

	const payload = {
		"id":1,
		"content": "",
		"type": "eurka",
		"votes": 0,
		"selected": 1
	}
	// TODO
}

sdlmsAPI.createThought = async function (req) {
	const uid = parseInt(req.uid);
	const group = req.group;

	const tid = parseInt(req.tid);
	const pid = await db.incrObjectField('global', 'nextPid');
	const collectionName = db.collections.SDLMS.POLL;

	let content = req.content;
	let data  = utilities.isJSON(req.data  || '') ? JSON.parse(req.data)  : {};

	let payload = {
		_key: `polls:thought:${group}:${tid}`,
		pid,
		uid,
		content,
		group,
		data,
		votes: [],
		status: 'new',
	}

	return await db.setField(collectionName, payload);
}

sdlmsAPI.announcePoll = async function (req) {
	const group = req.group;

	const tid = parseInt(req.tid);
	const collectionName = db.collections.SDLMS.POLL;

	const keys = {
		_key: `polls:thought:${group}:${tid}`,
		status: 'new'
	}

	return await db.updateField(collectionName, keys, { $set: {status: 'published'} });
}

sdlmsAPI.getThoughts = async function (req) {
	const group = req.group;

	const tid = parseInt(req.tid);
	const collectionName = db.collections.SDLMS.POLL;

	const keys = {
		_key: `polls:thought:${group}:${tid}`,
		status: 'new'
	}

	return await db.findFields(collectionName, keys);
}

sdlmsAPI.voteForThought = async function (req) {
	const uid = parseInt(req.uid);
	const pid = parseInt(req.pid);
	const tid = parseInt(req.tid);

	const group = req.group;
	const userFields = ['username', 'displayname', 'picture', 'fullname', 'uid'];

	const collectionName = db.collections.SDLMS.POLL;
	const userData = await User.getUserFields([uid], userFields);

	const keys = {
		_key: `polls:thought:${group}:${tid}`,
		pid
	}

	return await db.updateField(collectionName, { ...keys, 'votes.$.uid': {$ne: uid}}, { $push: { 'votes': userData } })
}