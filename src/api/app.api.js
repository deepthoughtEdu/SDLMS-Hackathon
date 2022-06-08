/**
 * @author imshawan
 * @description This file contains all the API tools for the DT Mobile App
 * @note caller(req), data
 */
"use strict";

const _ = require("lodash");
const categories = require("../categories");
const db = require("../database");
const User = require("../user");
const Topics = require("../topics");
const utils = require("../utils");
const winston = require("winston");
const Uploader = require("../controllers/FIleUpload");
const ObjectId = require("mongodb").ObjectId;
const nconf = require("nconf");
const axios = require("axios");
const utilities = require("../controllers/utils");
const fs = require('fs');

const plugins = require("../plugins");

const appApi = module.exports;

appApi.getHome = async function (req) {
	return {
		message: "Mobile App Init",
	};
};

/**
 *
 * @function getUserData
 * @param {Object} data Request (req)
 * @returns Returns null if the data isn't found or else returns User data as object
 */

appApi.getUserData = async function (data) {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error("Unauthorized");
	}
	let userFields = [
		"username",
		"email",
		"lastonline",
		"picture",
		"fullname",
		"status",
		"uid",
		"signature",
		"birthday",
		"location",
		"aboutme",
		"uploadedpicture",
		"pronoun",
		"social_designation",
	];

	const userData = await User.getUserFields(
		[data.query.uid ? parseInt(data.query.uid) : luid],
		userFields
	);

	if (!userData) {
		return null;
	}
	return userData;
};

/**
 * @function createJoke
 * @param {Object} data request object
 * @description This function creates a joke (post as in nodebb) and sends back the Id of the joke (post)
 * @returns Post Id
 */
appApi.createJoke = async function (data) {
	/**
	 * @description We will not verify if the user has logged in or not because users will have the capability for creating
	 * jokes even without logged in
	 */

	// const luid = parseInt(data.uid);
	// if (!data.uid || luid < 1) {
	// 	throw new Error("Unauthorized");
	// }

	let cid = await getCustomCategoryId("joke");
	return await createPost({
		cid: cid,
		author_name: data.body.author_name,
		email: data.body.email,
		content: data.body.content,
		approved: false,
		type: "joke",
	});
};

appApi.getJoke = async (data) => {
	/**
	 * @description Verification whether the user has loggged in or not is not required as Joke is an global object
	 * and can be accessed by anyone as viewer
	 */
	const collectionName = db.collections.DEFAULT;
	const keys = { type: "joke" };
	if (data.query.tid) {
		return await db.findFields(collectionName, { ...keys, tid: parseInt(data.query.tid) });
	}
	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limit) || 5;
	const [jokes, count] = await Promise.all([
		db.getFieldsWithPagination(collectionName, keys, limit, page),
		db.countDocuments(collectionName, keys),
	]);
	return utilities.paginate(`/app${data.url}`, jokes, count, limit, page);
};

/**
 * @author Subham Bhattacharjee
 * @param {Object} req
 * @description This creates a new annecdote and returns it's tid
 * @returns {Object} {tid: int}
 */

const validAnnecdoteScreens = ['login', 'signup', 'create_event'];
appApi.createAnnecdote = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) throw new Error("Unauthorized");

	const cid = await getCustomCategoryId("annecdotes");
	const currentTime = Date.now();
	const annecdote = {
		cid,
		uid: req.uid,
		title: req.body.title,
		content: req.body.content,
		author_uid: Number(req.body.author_uid),
		parent_id: req.body.parent_id,
		createdAt: currentTime,
		updatedAt: currentTime,
		type: "annecdote",
	}

	if (req.body.status) {
		annecdote.status = req.body.status;
		annecdote.approved = req.body.status == 'published' ? true : false;
	}
	if (req.body.placements) {
		let placements = req.body.placements;
		if (utilities.isJSON(placements)) {
			if (!Array.isArray(placements)) {
				throw new Error('\'placements\' must be an array');
			}
		} else {
			placements = JSON.parse(placements);
		}

		placements.forEach((element) => {
			if (!validAnnecdoteScreens.includes(element)) throw new Error(`Invalid screen name: ${element}`);
		})
		annecdote.placements = placements;
	}

	return await createPost(annecdote);
};

/**
 *
 * @author Subham Bhattacharjee
 * @param {Object} data
 * @description This returns one annecdote if given a tid otherwise
 * returns a list of all annecdotes
 * @returns one or a list of annecdote
 */

appApi.getAnnecdote = async (data) => {
	const luid = parseInt(data.uid);
	// if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const keys = { type: "annecdote" };

	if (data.query.tid) {
		return await db.findFields(collectionName, { ...keys, tid: parseInt(data.query.tid) });
	}

	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limit) || 5;
	let [annecdotes, count] = [[], 0];

	if (data.query.screen) {
		let screen = data.query.screen;
		if (!validAnnecdoteScreens.includes(screen)) throw new Error(`Invalid screen name: ${screen}`);
		[annecdotes, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, { ...keys, placements: screen }, limit, page),
			db.countDocuments(collectionName, { ...keys, placements: screen }),
		]);
	} else {
		[annecdotes, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, keys, limit, page),
			db.countDocuments(collectionName, keys),
		]);
	}

	if (annecdotes.length) {
		let annecdotesWithUser = await Promise.all(annecdotes.map(async (item) => {
			if (item.author_uid) {
				let user = await User.getUserFields([item.author_uid], ["username", "fullname", "userslug", "picture"])
				return { ...item, author: user };
			}
			return { ...item, author: {} };
		}));
		annecdotes = annecdotesWithUser;
	}

	return utilities.paginate(`/app${data.url}`, annecdotes, count, limit, page);
};

/**
 *
 * @author Subham Bhattacharjee
 * @param {Object} req
 * @description This function updates an annecdote if it exists,
 *  otherwise throws an error
 * @returns Object containing updated data
 */

appApi.updateAnnecdote = async (req) => {
	const luid = parseInt(req.uid);
	const collectionName = db.collections.DEFAULT;
	if (!req.uid || luid < 1) throw new Error("Unauthorized");
	let updatedData = {};

	if (req.body.title) updatedData.title = req.body.title;
	if (req.body.content) updatedData.content = req.body.content;
	if (req.body.author_uid) updatedData.author_uid = Number(req.body.author_uid);
	if (req.body.parent_id) updatedData.parent_id = req.body.parent_id;
	if (req.body.status) {
		updatedData.status = req.body.status;
		updatedData.approved = req.body.status == 'published' ? true : false;
	}
	if (req.body.placements) {
		let placements = req.body.placements;
		if (utilities.isJSON(placements)) {
			if (!Array.isArray(placements)) {
				throw new Error('\'placements\' must be an array');
			}
		} else {
			placements = JSON.parse(placements);
		}

		placements.forEach((element) => {
			if (!validAnnecdoteScreens.includes(element)) throw new Error(`Invalid screen name: ${element}`);
		})
		updatedData.placements = placements;
	}
	updatedData.updatedAt = Date.now();

	const data = await db.updateFieldWithMultipleKeys(collectionName,
		{
			uid: req.uid,
			tid: parseInt(req.params.tid),
			type: "annecdote",
		},
		updatedData
	);
	if (!data) throw new Error("Can not be updated");

	return data;
};

/**
 *
 * @author Subham Bhattacharjee
 * @param {Object} req
 * @description deletes the given annecdote if it exists
 * @returns object specifying if the delete is completed
 */

appApi.deleteAnnecdote = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const { result } = await db.removeField(collectionName, {
		uid: req.uid,
		tid: parseInt(req.params.tid),
		type: "annecdote",
	});

	return { deleted: result.n > 0 };
};

/**
 *
 * @author Subham Bhattacharjee
 * @param {req}
 * @description gets all mascots or the mascot with the uid specified by query
 * @returns Mascots array
 */

appApi.getMascot = async (req) => {
	const collectionName = db.collections.DEFAULT;
	const keys = { role: "mascot" };
	const Mascots = await db.findFields(collectionName,
		req.query.uid ? { ...keys, uid: parseInt(req.query.uid) } : keys
	);
	if (!Mascots) return null;
	return Mascots;
};

/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @param {*} res
 * @returns null
 * @description creates mascot
 */

appApi.createMascot = async (req) => {
	req.body.role = "mascot";
	const mascotFields = [
		"role",
		"email",
		"username",
		"password",
		"personality_traits",
		"favourite_authors",
		"favourite_movies",
		"followed",
	];
	const Data = mascotFields.reduce((Data, field) => {
		if (req.body[field]) return { ...Data, [field]: req.body[field] };
		return Data;
	}, {});
	const uploads = await Uploader.uploadContent(req);
	if (!uploads || uploads.length === 0)
		return res.status(400).json({
			status: {
				code: 400,
				message: "can not upload profile pic",
			},
		});
	uploads.foreach((file) => {
		if (file.field !== "picture") return;
		Data.picture = file.url;
		Data.uploadedpicture = file.url;
	});

	return await User.create(Data);
};

/**
 *
 * @author Subham Bhattacharjee
 * @param {req}
 * @description updates the mascot having user id same as uid
 * @returns object having property updated as true if sucesfully updated
 */

appApi.updateMascot = async (req) => {
	const luid = parseint(req.uid);
	const mascotUid = parseint(req.params.uid);
	const collectionName = db.collections.DEFAULT;

	if (!req.uid && luid <= 0) throw new Error("Unauthorised");
	if (!(await User.isAdministrator(req.uid)))
		throw new Error("Must be an admin");
	if (!req.params.uid && mascotUid <= 0) throw new Error("Doesn't exists");

	const customFields = [
		"signature",
		"personality_traits",
		"favourite_authors",
		"favourite_movies",
		"followed",
		"given_access_to",
	];
	const data = [
		...customFields,
		"picture",
		"fullname",
		"location",
		"birthday",
	].reduce(
		(data, field) =>
			req.body[field] ? { ...data, [field]: req.body[field] } : data,
		{}
	);

	uploads = await Uploader.uploadContent(req);
	uploads.foreach((file) => {
		if (file.field !== "pofile_pic") return;
		data.picture = file.url;
		data.uploadedpicture = file.url;
	});

	if (req.body.username && req.body.username.length > 0) {
		data.username = req.body.username;
		data.userslug = utils.slugify(req.body.username);
	}
	const updatedData = await db.updateFieldWithMultipleKeys(collectionName,
		{
			uid: mascotUid,
			role: "mascot",
		},
		data
	);

	if (!updatedData) throw new Error("Can not be updated");
	return { updated: true };
};

/**
 *
 * @author Subham Bhattacharjee
 * @param {req}
 * @description Deletes the mascot specified by the uid
 * @returns object containg deleted field as true if the specified mascot was deleted
 */

appApi.deleteMascot = async (req) => {
	const luid = parseint(req.uid);
	const mascotUid = parseint(req.params.uid);
	const collectionName = db.collections.DEFAULT;

	if (!req.uid || luid <= 0) throw new Error("Unauthorised");
	if (!(await User.isAdministrator(luid))) throw new Error("Must be an admin");
	if (!req.params.uid || mascotUid <= 0) throw new Error("Doesn't exists");

	const { result } = await db.removeField(collectionName, {
		uid: mascotUid,
		role: "mascot",
	});

	return { deleted: result.n > 0 };
};

/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @description get all discussion room or the specified one if user user have proper rigor rank
 * @returns List of all Discussion Room or the one specified by tid
 */

appApi.getDiscussionRoom = async req => {

	const luid = parseInt(req.uid)
	if (!req.uid || luid <= 0) throw new Error("Unauthorised")
	const collectionName = db.collections.DEFAULT;

	const cid = await getCustomCategoryId("discuss_room")
	const keys = { cid, type: "discuss_room" }
	const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 5;
	const room_type = req.query.type || 'latest'
	const order = {}
	let [DiscussionRooms, count] = [[], 0]
	const userFields = [
		"username",
		"fullname",
		"userslug",
		"picture",
		"signature",
		"aboutme",
		"status",
		"lastonline"
	]

	if (room_type == 'latest') {
		order['viewcount'] = 1
	}
	else {
		order['viewcount'] = -1
	}
	if (req.query.tid) {
		let tid = parseInt(req.query.tid);
		let key = { tid: tid, type: 'discuss_room' }
		let roomData = await db.findField(collectionName, key)
		let [userData] = await Promise.all([
			await User.getUserFields([roomData.uid], userFields),
		]);
		let room_data = { ...roomData, user: userData, }
		return utilities.paginate(`/app${req.url}`, room_data, count, limit, page)
	} else if (req.body.preferences && req.body.preferences.length != 0) {
		const preferences = req.body.preferences;
		let filter = []
		preferences.forEach(preference => {

			if (preference.hasOwnProperty('sub_cids')) {
				preference['sub_cids'].forEach(sub_cid => {
					let key = {}
					key['sub_cid'] = sub_cid;
					key['cid'] = preference['cid'];
					key['type'] = 'discuss_room'
					filter.push(key)
				})
			}
			else {
				let key = {};
				key['cid'] = preference['cid'];
				key['type'] = 'discuss_room';
				filter.push(key)

			}
		})
		let search = {}
		search['$or'] = filter;
		[DiscussionRooms, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, search, limit, page, order),
			db.countDocuments(collectionName, search)
		]);

	} else if (req.query.term) {
		const term = req.query.term;

		[DiscussionRooms, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, { $or: [{ name: { $regex: term }, description: { $regex: term } }], type: 'discuss_room' }, limit, page),
			db.countDocuments(collectionName, { $or: [{ name: { $regex: term }, description: { $regex: term } }], type: 'discuss_room' })
		]);
	} else {
		[DiscussionRooms, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, keys, limit, page, order),
			db.countDocuments(collectionName, keys)
		]);
	}

	const DiscussionRoomsWithAuthor = await Promise.all(DiscussionRooms.map(async DiscussionRoom => ({
		...DiscussionRoom,
		author: await User.getUserFields([parseInt(DiscussionRoom.uid)], userFields)
	})))

	return utilities.paginate(`/app${req.url}`, DiscussionRoomsWithAuthor, count, limit, page)
}

/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @description create a new discussion room with specified fields if user is logged in
 * @returns tid
 */

appApi.createDiscussionRoom = async (req) => {
	const luid = parseInt(req.uid);

	if (!req.uid || luid <= 0) throw new Error("Unauthorised");

	const uid = req.uid
	const category = req.body.category || 'discuss_room';
	const cid = await getCustomCategoryId(category)

	// const defaultData = {
	// 	uid,
	// 	cid,
	// 	type: "discuss_room"
	// }

	// const DiscussionRoomFields = ["name", "description", "min_rigor_rank", "intent", "tagline"]

	// const Data = Object.keys(req.body).reduce(
	// 	(result, key) => DiscussionRoomFields.includes(key) ? { ...result, [key]: req.body[key] } : result,
	// 	defaultData
	// )

	const Data = {
		type: 'discuss_room',
		cid: cid,
		name: req.body.name,
		classification: req.body.classification,
		criteria: req.body.criteria,
		description: req.body.description,
		rules: req.body.rules,
		isEvent: req.body.event,
		moderators: req.body.moderators
	}

	if (req.files && req.files.files) {
		const uploads = await Uploader.uploadContent(req)
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				Data[file.field] = file.url
			})
		}
	}

	return await Topics.create(Data)
}


/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @description This updates the discussion room having the given tid
 * @returns An object containing updated attribute which would be true if the Discussion Room was deleted
 */

appApi.updateDiscussionRoom = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid && luid <= 0) throw new Error("Unauthorised");
	const DiscussionRoomTID = parseInt(req.params.tid);
	const collectionName = db.collections.DEFAULT;

	if (!req.params.tid || DiscussionRoomTID <= 0)
		throw new Error("TID is required");

	const DiscussionRoomFields = [
		"name",
		"description",
		"min_rigor_rank",
		"intent",
		"tagline",
	];

	const Data = Object.keys(req.body).reduce(
		(result, key) =>
			DiscussionRoomFields.includes(key)
				? { ...result, [key]: req.body[key] }
				: result,
		{}
	);
	if (req.files) {
		const uploads = await Uploader.uploadContent(req);
		uploads.forEach((file) => {
			if (file.field !== "picture") return;
			Data.picture = file.url;
		});
	}
	const updatedData = await db.updateFieldWithMultipleKeys(collectionName,
		{
			uid: luid,
			tid: DiscussionRoomTID,
			type: "discuss_room",
		},
		Data
	);

	if (!updatedData) throw new Error("Can not be updated");
	return { updated: true };
};

/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @description Deletes the specified discussion room if the user has access to do so
 * @returns An object containing the deleted field which would be true if the DR was deleted
 */

appApi.deleteDiscussionRoom = async (req) => {
	const luid = parseInt(req.uid);
	const DiscussionRoomTID = parseInt(req.params.tid);

	if (!req.uid || luid <= 0) throw new Error("Unauthorised");
	if (!req.params.tid || DiscussionRoomTID <= 0)
		throw new Error("Doesn't exists");

	const collectionName = db.collections.DEFAULT;
	const { result } = await db.removeField(collectionName, {
		uid: req.uid,
		tid: DiscussionRoomTID,
		type: "discuss_room",
	});

	return { deleted: result.n > 0 };
};

// TODO: Make data structures for threads so I can finish create function
// appApi.createThread = async req => {
// 	const luid = parseInt(req.uid)
// 	const DiscussionRoomTID = parseInt(req.params.tid)

// 	if(!req.uid && luid <= 0) throw new Error("Unauthorised")
// 	if(!req.params.tid && DiscussionRoomTID <= 0) throw new Error("Discussion Room Doesn't exists")

// 	const cid = parseInt(data.body.cid)
// 	const sub_cid = parseInt(data.body.sub_cid)

// }

/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @description Gets all the tags, or the tags that matches the given type or the given tag
 * @returns array of all matched tags
 */

appApi.getTag = async (req) => {
	const collectionName = db.collections.DEFAULT;
	let keys = { function: "tag" };

	if (req.query.type) keys.type = req.query.type;
	if (req.query.tag) keys.name = req.query.tag;

	const Tags = db.findFields(collectionName, keys);
	if (!Tags) throw new Error("Couldn't get tag");

	return Tags;
};

/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @description creates new tag with given name and type
 * @returns object containin tagid and aknoledgment data
 */

appApi.createTag = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid && luid <= 0) throw new Error("Unauthorised");
	if (!(await User.isAdministrator(luid))) throw new Error("Must be an admin");
	if (!req.body.tag) throw new Error("Tag is required to create a tag");

	return await createTag(req.body.tag, req.body.type);
};

/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @description updates the given tag
 * @returns Object containing updated data
 */

appApi.updateTag = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid && luid <= 0) throw new Error("Unauthorised");
	const collectionName = db.collections.DEFAULT;

	if (!(await User.isAdministrator(luid))) throw new Error("Must be an admin");
	if (!req.body.tag) throw new Error("Tag is required to update a tag");

	const fields = {};

	if (req.body.type) fields.type = req.body.type;

	const tagid = utils.slugify(req.params.tag);

	const TagData = await db.updateFieldWithMultipleKeys(collectionName,
		{
			_key: `tag:${tagid}`,
			function: "tag",
		},
		fields
	);

	if (!TagData) throw new Error("Couldn't update tag");

	return TagData;
};

/**
 * @author Subham Bhattacharjee
 * @param {*} req
 * @description Deletes given tag
 * @returns Object containing a field deleted which would e true if the tag was deleted
 */

appApi.deleteTag = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid && luid <= 0) throw new Error("Unauthorised");
	if (!(await User.isAdministrator(luid))) throw new Error("Must be an admin");
	if (!req.params.tag) throw new Error("Tag is required to delete a tag");

	const tagid = utils.slugify(req.params.tag);
	const collectionName = db.collections.DEFAULT;

	const { result } = await db.removeField(collectionName, {
		_key: `tag:${tagid}`,
	});

	return { deleted: result.n > 0 };
};

/**
 * @author imshawan
 * @function createNudge
 * @description Creates a nudge with the supplied params in the request body and returns the unique nudge Id on successful creation of a nudge
 * @param {Object} req - Request body
 * @returns Nudge Id
 */

const nudgeFields = [
	"asset_type",
	"assetId",
	"title",
	"schedule",
	"end_time",
	"description",
	"invitation_text",
];

appApi.createNudge = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) throw new Error("Unauthorized");
	const [tid, cid] = await Promise.all([
		db.incrObjectField("global", "nextTid"),
		getCustomCategoryId("nudges"),
	]);

	const collectionName = db.collections.DEFAULT;
	let nudge = {
		_key: `nudge:${req.body.assetId}`,
		type: "nudge",
		uid: luid,
		tid: tid,
		cid: cid,
	};
	const uploads = await Uploader.uploadContent(req);
	if (uploads && uploads.length !== 0) {
		uploads.forEach((file) => {
			nudge[file.field] = file.url;
		});
	}
	nudgeFields.forEach((field) => {
		nudge[field] = req.body[field];
	});

	const response = await db.setField(collectionName, nudge);
	return {
		message: "Nudge created",
		id: response._id,
	};
};

/**
 * @author imshawan
 * @date 09-02-2022
 * @function updateNudge
 * @description Used for updating a particular nudge. Note: Only the user who created the nudge can modify it
 * @param {Object} req Request body
 * @returns Object, { updated: true } if the updation process is successful
 */

appApi.updateNudge = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const keys = {
		_id: ObjectId(req.params.id),
		type: "nudge",
		uid: luid, // Must be the same user who created the nudge, or else won't be able to modify the nudge
	};
	let parsedData = {};
	if (req.files.files) {
		const uploads = await Uploader.uploadContent(req);
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				parsedData[file.field] = file.url;
			});
		}
	}
	nudgeFields.forEach((field) => {
		if (req.body[field]) {
			parsedData[field] = req.body[field];
		}
	});

	if (req.body.assetId) {
		parsedData["_key"] = `nudge:${req.body.assetId}`;
	}

	const response = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!response) {
		throw new Error("Unauthorized write access!");
	}
	return response;
};

/**
 * @date 09-02-2022
 * @function getNudge
 * @description Used for getting a particular nudge with its Id. Or if no Id is supplied, it will return all the nudges.
 * @param {Object} req Request body
 * @returns Array of nudge(s)
 */
appApi.getNudge = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;
	const keys = { type: "nudge" };
	const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limitBy) || 5;
	let nudgeData = [];
	let count = 0;
	const userFields = [
		"username",
		"fullname",
		"userslug",
		"picture",
		"signature",
		"aboutme",
	];

	if (req.query.id) {
		let query = {};
		if (req.query.id && isNaN(req.query.id)) {
			query._id = ObjectId(req.query.id);
		} else if (req.query.id) {
			query.tid = parseInt(req.query.id);
		}

		const [nudges] = await Promise.all([db.findField(collectionName, { ...keys, ...query })]);

		if (!nudges) return null;
		else {
			let userdata = await User.getUserFields([nudges.uid], userFields);
			return { ...nudges, user: userdata[0] };
		}
	} else if (req.body.preferences && req.body.preferences.length != 0) {
		const preferences = req.body.preferences;
		let filter = [];
		preferences.forEach((preference) => {
			if (preference.hasOwnProperty("sub_cids")) {
				preference["sub_cids"].forEach((sub_cid) => {
					let key = {};
					key["sub_cid"] = sub_cid;
					key["cid"] = preference["cid"];
					key["type"] = "nudge";
					filter.push(key);
				});
			} else {
				let key = {};
				key["cid"] = preference["cid"];
				key["type"] = "nudge";
				filter.push(key);
			}
		});
		let search = {};
		search["$or"] = filter;
		[nudgeData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, search, limit, page),
			db.countDocuments(collectionName, search),
		]);
	} else if (req.query.term) {
		const term = req.query.term;

		[nudgeData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName,
				{
					$or: [{ title: { $regex: term }, description: { $regex: term } }],
					type: "nudge",
				},
				limit,
				page
			),
			db.countDocuments(collectionName, {
				$or: [{ title: { $regex: term }, description: { $regex: term } }],
				type: "nudge",
			}),
		]);
	}

	[nudgeData, count] = await Promise.all([
		db.getFieldsWithPagination(collectionName, keys, limit, page),
		db.countDocuments(collectionName, keys),
	]);

	let nudges = await Promise.all(
		nudgeData.map(async (elem) => {
			let [userData] = await Promise.all([
				User.getUserFields([elem.uid], userFields),
			]);
			return { ...elem, user: userData };
		})
	);
	return utilities.paginate(`/app${req.url}`, nudges, count, limit, page);
};

/**
 * @date 09-02-2022
 * @function deleteNudge
 * @description Used for getting a particular nudge with its Id.
 * @param {Object} req Request body
 * @returns Object, which on successful deletion { deleted: true } else deletion is false
 */
appApi.deleteNudge = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) throw new Error("Unauthorized");

	const keys = {
		uid: luid,
		_id: ObjectId(req.params.id),
		type: "nudge",
	};
	const collectionName = db.collections.DEFAULT;
	const response = await db.removeField(collectionName, keys);
	if (response.result.n === 1) {
		return { deleted: true };
	} else {
		return { deleted: false };
	}
};

/**
 * @author imshawan
 * @date 16-02-2022
 * @function getEvents
 * @description Returns event(s) array based on the query parameters. The function returns events either based on a unique event id,
 * or the rigor rank or by latest events that are created.
 * @param {Object} data Request body
 * @returns Array of event(s). Returns null if not query params are found.
 */
appApi.getEvents = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;
	const userFields = [
		"username",
		"fullname",
		"userslug",
		"picture",
		"signature",
		"aboutme",
	];
	const event_type = data.query.type;
	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limitBy) || 5;
	let [events, count] = [[], 0]

	const keys = {
		type: "event",
	};
	const order = {};
	if (event_type == "latest") {
		order["viewcount"] = 1;
	} else {
		order["viewcount"] = -1;
	}

	if (data.query.tid) {
		let event = await db.findFields(collectionName, { ...keys, tid: parseInt(data.query.tid) });
		if (event && event[0].moderator) {
			let moderator = await User.getUserFields(
				[parseInt(event[0].moderator)],
				userFields
			);
			event[0].moderator_data = moderator;
		}
		return event;
	} else if (data.query.rigor_rank) {
		[events, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName,
				{ ...keys, rigor_rank: parseInt(data.query.rigor_rank) },
				limit,
				page
			),
			db.countDocuments(collectionName, keys),
		]);
	} else if (data.body.preferences && data.body.preferences.length != 0) {
		const preferences = data.body.preferences;
		let filter = [];
		preferences.forEach((preference) => {
			if (preference.hasOwnProperty("sub_cids")) {
				preference["sub_cids"].forEach((sub_cid) => {
					let key = {};
					key["sub_cid"] = sub_cid;
					key["cid"] = preference["cid"];
					key["type"] = "event";
					filter.push(key);
				});
			} else {
				let key = {};
				key["cid"] = preference["cid"];
				key["type"] = "event";
				filter.push(key);
			}
		});
		let search = {};
		search["$or"] = filter;

		[events, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, search, limit, page, order),
			db.countDocuments(collectionName, search),
		]);
	} else if (data.query.term) {

		const term = data.query.term;
		[events, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, { $or: [{ name: { $regex: term }, description: { $regex: term } }], type: 'event' }, limit, page),
			db.countDocuments(collectionName, { $or: [{ name: { $regex: term }, description: { $regex: term } }], type: 'event' })
		]);

	} else {
		[events, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, keys, limit, page, order),
			db.countDocuments(collectionName, keys),
		]);
	}

	let eventsData = [];
	if (events && events.length !== 0) {
		eventsData = await Promise.all(
			events.map(async (elem) => {
				let user = await User.getUserFields(
					[parseInt(elem.moderator)],
					userFields
				);
				return { ...elem, moderator_data: user };
			})
		);
	}
	return utilities.paginate(`/app${data.url}`, eventsData, count, limit, page);
};

/**
 * @function createEvent
 * @param {Object} data Request body
 * @returns Id of the created Event
 */
const eventFields = [
	"name",
	"tagline",
	"schedule",
	"description",
	"moderator",
	"sub_category",
	"rigor_rank",
	"field_1",
	"description_1",
	"field_2",
	"description_2",
];
appApi.createEvent = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	//const cid = await getCustomCategoryId(data.body.category || 'events')
	let cid = parseInt(data.body.category);
	if (!cid) {
		await getCustomCategoryId("events");
	}

	let event = {
		uid: luid,
		cid: cid,
		attendees: [],
		timestamp: Date.now(),
		category: cid,
		type: "event",
	};
	const uploads = await Uploader.uploadContent(data);
	if (uploads && uploads.length !== 0) {
		uploads.forEach((file) => {
			event[file.field] = file.url;
		});
	}
	// Parsing the sub_category as Int value, by default it was being parsed as string
	event.sub_category = parseInt(data.body.sub_category);
	eventFields.forEach((field) => {
		if (data.body[field]) {
			event[field] = data.body[field];
		}
	});
	return await createPost(event);
};

/**
 *
 * @function updateEvent
 * @description Enables updation of a event
 * @param {Object} req Request body
 * @returns updated as true on successful updaation
 */
appApi.updateEvent = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const keys = {
		tid: parseInt(req.params.tid),
		type: "event",
		uid: luid,
	};
	let parsedData = {};
	if (req.files.files) {
		const uploads = await Uploader.uploadContent(req);
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				parsedData[file.field] = file.url;
			});
		}
	}
	eventFields.forEach((field) => {
		if (req.body[field]) {
			parsedData[field] = req.body[field];
		}
	});

	const response = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!response) {
		throw new Error("Unauthorized write access!");
	}
	return response;
};
/**
 * @date 16-02-2022
 * @function deleteEvent
 * @description Deletes a particular event based on its Id. Only the creator of the Event has the authorization to delete it.
 * @param {Object} req Request body
 * @returns deleted as true on successful deletion
 */
appApi.deleteEvent = async (req) => {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) throw new Error("Unauthorized");

	const keys = {
		tid: parseInt(req.params.tid),
		type: "event",
		uid: luid,
	};

	const collectionName = db.collections.DEFAULT;
	const response = await db.removeField(collectionName, keys);
	if (response.result.n === 1) {
		return { deleted: true };
	} else {
		return { deleted: false };
	}
};

appApi.eventRegisteration = async (data, register) => {
	const luid = parseInt(data.uid);
	if (!luid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;
	console.log(luid);

	const keys = {
		_id: ObjectId(data.params.id),
		type: "event",
	};

	const record = await db.findField(collectionName, keys);
	if (!record || record.type != "event") throw new Error("Not an event");

	if (register) {
		await db.update(collectionName,
			{ ...keys, attendees: { $ne: luid } },
			{ $push: { attendees: luid } }
		);
	} else {
		await db.update(collectionName,
			{ ...keys, attendees: luid },
			{ $pull: { attendees: luid } }
		);
	}

	return { registered: register };
};

/**
 * @date 16-02-2022
 * @function checkUsername
 * @description Checks for an existing user by username
 * @param {Object} data Request body
 * @returns userExists: Boolean, depending upon the username
 */
appApi.checkUsername = async (data) => {
	if (!data.query.username)
		throw new Error("Missing query parameter 'username'");
	const uid = await User.getUidByUserslug(data.query.username);
	if (uid) {
		return { userExists: true };
	}

	return { userExists: false };
};

appApi.create_Post = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	const cid = parseInt(data.body.cid);
	const sub_cid = parseInt(data.body.sub_cid);
	const tid = parseInt(data.body.tid);
	const pid = await db.incrObjectField("global", "nextPid");
	const Post = {
		cid: cid,
		pid,
		sub_cid: sub_cid,
		uid: data.uid,
		content: data.body.content,
		tags: data.body.tags ? JSON.parse(data.body.tags) : [],
		attachment_id: data.body.attachment_id || null,
		uid: luid,
		approved: false,
		timestamp: Date.now(),
		type: "post",
	};

	if (data.files && data.files.files) {
		const uploads = await Uploader.uploadContent(data);
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				Post[file.field] = file.url;
			});
		}
	}
	if (tid) Post.tid = tid;

	return await createPost(Post);
};

appApi.getPosts = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;
	const userFields = [
		"username",
		"fullname",
		"userslug",
		"picture",
		"signature",
	];

	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limitBy) || 5;
	const post_type = data.query.type || "latest";
	const order = {};

	const keys = {
		type: "post",
	};

	if (post_type == "latest") {
		order["viewcount"] = 1;
	} else if (post_type == "popular") {
		order["viewcount"] = -1;
	}

	if (data.query.uid) keys.uid = parseInt(data.query.uid);
	let postData = [];
	let count = 0;
	if (data.query.tid) {
		let tid = parseInt(data.query.tid);
		let key = { tid: tid, type: 'post' }
		let post = await db.findField(collectionName, key)
		let query = {};
		if (post.attachment_id && isNaN(post.attachment_id)) {
			query._id = ObjectId(post.attachment_id);
		} else if (post.attachment_id) {
			query.tid = parseInt(post.attachment_id);
		}
		let [userData, attachment, comment_count, _] = await Promise.all([
			await User.getUserFields([post.uid], userFields),
			db.findField(collectionName, query),
			db.countDocuments(collectionName, { tid: tid, type: 'comment' }),
			db.incrementCount(collectionName, key, 'viewcount') // Increment view count for a particular post
		]);
		// Incrementing the view count here itself, because the view count gets increased only after that record is called
		// To avoid an additional db query its best to increment the count here manually by 1
		let post_data = { ...post, comment_count: comment_count, viewcount: post.viewcount + 1, user: userData, attachment: attachment }
		return utilities.paginate(`/app${data.url}`, post_data, count, limit, page)
	} else if (data.body.preferences && data.body.preferences.length != 0) {
		const preferences = data.body.preferences;
		let filter = []
		preferences.forEach(preference => {

			if (preference.hasOwnProperty('sub_cids')) {
				preference['sub_cids'].forEach(sub_cid => {
					let key = {}
					key['sub_cid'] = sub_cid;
					key['cid'] = preference['cid'];
					key['type'] = 'post'
					filter.push(key)
				})
			}
			else {
				let key = {};
				key['cid'] = preference['cid'];
				key['type'] = 'post';
				filter.push(key)

			}
		})
		let search = {}
		search['$or'] = filter;

		[postData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, search, limit, page, order),
			db.countDocuments(collectionName, search)
		]);
	} else if (data.query.term) {


		const term = data.query.term;
		[postData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, { $or: [{ title: { $regex: term }, content: { $regex: term } }], type: 'post' }, limit, page),
			db.countDocuments(collectionName, { $or: [{ title: { $regex: term }, content: { $regex: term } }], type: 'post' })
		]);

	} else {

		[postData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, keys, limit, page, order),
			db.countDocuments(collectionName, keys),
		]);
	}

	let posts = await Promise.all(postData.map(async (elem) => {
		let attachment = null;
		let [userData, comment_count] = await Promise.all([
			User.getUserFields([elem.uid], userFields),
			db.countDocuments(collectionName, { tid: elem.tid, type: 'comment' })
		])
		if (elem.attachment_id) {
			let query = {};
			if (isNaN(elem.attachment_id)) {
				query._id = ObjectId(elem.attachment_id);
			} else {
				query.tid = parseInt(elem.attachment_id);
			}
			attachment = await db.findField(collectionName, query);
		}

		return {
			...elem,
			comment_count: comment_count,
			user: userData,
			attachment: attachment,
		};
	})
	);
	return utilities.paginate(`/app${data.url}`, posts, count, limit, page);
};

appApi.updatePost = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const keys = {
		type: "post",
		uid: luid,
		tid: parseInt(data.params.tid),
	};
	let parsedData = {};
	if (data.body.content) parsedData.content = data.body.content;
	if (data.body.tags) parsedData.tags = JSON.parse(data.body.tags);
	if (data.body.attachment_id)
		parsedData.attachment_id = data.body.attachment_id;
	if (data.body.cid) parsedData.cid = data.body.cid;
	if (data.body.sub_cid) parsedData.sub_cid = data.body.sub_cid;

	if (data.files && data.files.files) {
		const uploads = await Uploader.uploadContent(data);
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				parsedData[file.field] = file.url;
			});
		}
	}

	let state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error("Unauthorized write access!");
	}
	return state;
};

appApi.deletePost = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	const keys = {
		type: "post",
		uid: luid,
		tid: parseInt(data.params.tid),
	};

	const collectionName = db.collections.DEFAULT;
	const response = await db.removeField(collectionName, keys);
	if (response.result.n === 1) {
		return { deleted: true };
	} else {
		return { deleted: false };
	}
};
/**
 * @author imshawan
 * @date 01-03-2022
 * @function saveItems
 * @description Enables saving of Items to user's personal saved item collection
 * @param {Object} data Request body
 * @returns {Object} {saved: true} if the save is successfull
 */

const item_names = [
	"joke",
	"annecdote",
	"nudge",
	"event",
	"post",
	"discuss_room",
	"article",
];
appApi.saveItems = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	const collectionName = db.collections.DEFAULT;
	const Id = data.body.id;
	const Item = data.params.item_name;
	if (!Item) throw new Error("API call should contain valid parameters");
	if (item_names.indexOf(Item) === -1)
		throw new Error(`Invalid parameter "${Item}" supplied to this API call`);

	const saved_item = await db.findField(collectionName, { _id: ObjectId(Id) });
	if (!saved_item || saved_item.type != Item)
		throw new Error(`Invalid ${Item}`);

	const record = await db.findField(collectionName, { _key: `saved_items:user:${luid}` });
	if (record) {
		if (!record[Item]) {
			await db.update(collectionName,
				{ _key: `saved_items:user:${luid}` },
				{ $set: { [Item]: [Id] } }
			);
		} else if (record[Item].indexOf(Id) === -1) {
			await db.update(collectionName,
				{ _key: `saved_items:user:${luid}` },
				{ $push: { [Item]: Id } }
			);
		} else throw new Error(`${Item} with the Id ${Id} is already saved`);
	} else {
		await db.setField(collectionName, {
			_key: `saved_items:user:${luid}`,
			uid: luid,
			[Item]: [Id],
		});
	}

	return { saved: true };
};

appApi.getSavedItems = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	const collectionName = db.collections.DEFAULT;

	const Item = data.params.item_name;
	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limit) || 5;
	let count = 0;

	if (!Item) throw new Error("API call should contain valid parameters");
	if (item_names.indexOf(Item) === -1)
		throw new Error(`Invalid parameter "${Item}" supplied to this API call`);

	const savedItems = await db.findField(collectionName, { _key: `saved_items:user:${luid}` });
	if (savedItems) {
		const savedItem = savedItems[Item];
		count = savedItem.length;

		if (!savedItem) {
			return utilities.paginate(`/app${data.url}`, [], count, limit, page);
		} else {
			const records = [];
			let start = page * limit;
			let end = start + limit;
			const Items = savedItem.splice(start, end);

			await Promise.all(Items.map(async (item) => {
				if (item) {
					let record = await db.findField(collectionName, { _id: ObjectId(item) });
					if (record && record.uid) {
						record.user = await User.getUserFields([record.uid], ['username', 'fullname', 'signature', 'picture']);
					}
					records.push(record);
				}
			}));

			return utilities.paginate(`/app${data.url}`, records, count, limit, page);
		}
	} else {
		return utilities.paginate(`/app${data.url}`, [], count, limit, page);
	}
}

/**
 * @author imshawan
 * @date 04-03-2022
 * @function createTicket
 * @description The function handles the ticket creation operation.
 * @param {Object} data
 * @returns {Object} created: true, if ticket creation is successfull
 */
const headers = {
	"Content-Type": "application/json",
	accept: "*/*",
};
appApi.createTicket = async (data) => {
	const collectionName = db.collections.DEFAULT;
	const URL = "https://desk.zoho.in/api/v1/tickets";
	const contact =
		typeof data.body.contact == "string"
			? JSON.parse(data.body.contact)
			: data.body.contact;

	if (!contact.hasOwnProperty("firstName"))
		throw new Error("Contact does not contain the property: firstName");
	if (!contact.hasOwnProperty("lastName"))
		throw new Error("Contact does not contain the property: lastName");
	if (!contact.hasOwnProperty("email"))
		throw new Error("Contact does not contain the property: email");
	if (!contact.hasOwnProperty("phone"))
		throw new Error("Contact does not contain the property: phone");

	let accesstoken = await db.findField(collectionName, { _key: "zoho:access_token" });
	if (!accesstoken) {
		accesstoken = await generateAccessToken();
		await db.setField(collectionName, { _key: "zoho:access_token", ...accesstoken });
	}

	const ticket = {
		subject: data.body.subject,
		departmentId: "57374000000010772",
		channel: "Email",
		description: data.body.description,
		language: "English",
		priority: "High",
		phone: contact.phone,
		category: data.body.category,
		email: contact.email,
		status: "Open",
		contact: contact,
	};

	let header, response;

	try {
		header = {
			...headers,
			Authorization: `Zoho-oauthtoken ${accesstoken.access_token}`,
		};
		response = await fetchApi(URL, header, ticket, "post");
	} catch {
		accesstoken = await generateAccessToken();
		await db.updateFieldWithMultipleKeys(collectionName,
			{ _key: "zoho:access_token" },
			accesstoken
		);
		header = {
			...headers,
			Authorization: `Zoho-oauthtoken ${accesstoken.access_token}`,
		};
		response = await fetchApi(URL, header, ticket, "post");
	}
	return response.id;
};

appApi.deleteTickets = async (data) => {
	const URL = "https://desk.zoho.in/api/v1/tickets/moveToTrash";
	const collectionName = db.collections.DEFAULT;

	let accesstoken = await db.findField(collectionName, { _key: "zoho:access_token" });
	if (!accesstoken) {
		accesstoken = await generateAccessToken();
		await db.setField(collectionName, { _key: "zoho:access_token", ...accesstoken });
	}
	let header;
	let body = data.body;
	try {
		header = {
			...headers,
			Authorization: `Zoho-oauthtoken ${accesstoken.access_token}`,
		};
		await fetchApi(URL, header, body, "post");
	} catch {
		accesstoken = await generateAccessToken();
		await db.updateFieldWithMultipleKeys(collectionName,
			{ _key: "zoho:access_token" },
			accesstoken
		);
		header = {
			...headers,
			Authorization: `Zoho-oauthtoken ${accesstoken.access_token}`,
		};
		await fetchApi(URL, header, body, "post");
	}
	return { deleted: true };
};

appApi.searchTickets = async (data) => {
	const baseURL = "https://desk.zoho.in/api/v1/tickets/search";
	const collectionName = db.collections.DEFAULT;

	let URL;
	let accesstoken = await db.findField(collectionName, { _key: "zoho:access_token" });
	if (!accesstoken) {
		accesstoken = await generateAccessToken();
		await db.setField(collectionName, { _key: "zoho:access_token", ...accesstoken });
	}
	let header;
	if (data.query.email) {
		let query = { email: data.query.email };
		if (data.query.status) {
			query["status"] = data.query.status;
		}
		if (data.query.category) {
			query["category"] = data.query.category;
		}
		URL = `${baseURL}?${new URLSearchParams(query)}`;
	}
	try {
		header = {
			...headers,
			Authorization: `Zoho-oauthtoken ${accesstoken.access_token}`,
		};
		return await fetchApi(URL, header, {}, "get");
	} catch {
		accesstoken = await generateAccessToken();
		await db.updateFieldWithMultipleKeys(collectionName,
			{ _key: "zoho:access_token" },
			accesstoken
		);
		header = {
			...headers,
			Authorization: `Zoho-oauthtoken ${accesstoken.access_token}`,
		};
		return await fetchApi(URL, header, {}, "get");
	}
};
// const path = require('path')
// const fs = require('fs');
// const FormData = require('form-data')
// async function fetchUploadApi(url, header, imageFile){
// 	// let path = "http://127.0.0.1:4567/assets/uploads/files/images/1648816656070-screenshot-2.png"
// 	// const formData = new FormData();
// 	// formData.append('image', path)
// 	let formData = imageFile
// 	// axios.post(url, formData, {
// 	// 	headers: {
// 	// 	  'Content-Type': 'multipart/form-data',
// 	// 	  ...header
// 	// 	}
// 	// })
// 	// .then(res => console.log(res))
// 	fetch(url, {headers: header, method: "POST", body: formData});
// }

// appApi.upload = async (data) => {
// 	let egFile = "public/uploads/files/images/1648815871607-screenshot-2.png"
// 	const uploads = await Uploader.uploadContent(data)
// 	//const upload = data.files.files.path
// 	const url = nconf.get('url')

// 	let file = uploads[0]["url"]
// 	file = file.replace("assets", "public")
// 	//file = path.resolve(file)
// 	file = url + file.replace("\",  \"/")

// 	const ticket_id = data.params.id
// 	const URL = `https://desk.zoho.in/api/v1/tickets/${ticket_id}/attachments`;
// 	console.log("hello world")
// 	console.log(data.files.files)
// 	let accesstoken = await db.findField(collectionName, { _key: 'zoho:access_token' });
// 	if (!accesstoken) {
// 		accesstoken = await generateAccessToken();
// 		await db.setField({ _key: 'zoho:access_token', ...accesstoken })
// 	}
// 	let header, response;

// 	try {
// 		header = { "accept": "*/*", Authorization: `Zoho-oauthtoken ${accesstoken.access_token}` }
// 		response =  await fetchUploadApi(URL, header, data.files.files);
// 	} catch {
// 		accesstoken = await generateAccessToken();
// 		await db.updateFieldWithMultipleKeys(collectionName,{ _key: 'zoho:access_token' }, accesstoken)
// 		header = { "accept": "*/*", Authorization: `Zoho-oauthtoken ${accesstoken.access_token}` }
// 		response = await fetchUploadApi(URL, header, data.files.files);
// 	}
// 	return response
// }

const preferenceFields = ["category", "sorting"];
const sortingFields = ["rigor_rank", "popular", "latest", "none"]; //Currently allowed sorting methods
/**
 * @author imshawan
 * @date 08-03-2022
 * @function savePreferences
 * @description Main controller for pushing objects inside the preferences document
 * @param {Object} data Request body
 * @returns Boolean, updated: true if the preference object was saved successfully
 */
appApi.savePreferences = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const sortBy = data.query.sortBy;
	// const secondary_preference = data.body.sub_category; // sub category name
	// const field = data.body.category; // category name or the sorting field name should contain in this variable
	const sortingIds = {
		none: 0,
		rigor_rank: 1,
		popular: 2,
		latest: 3,
	};

	const categoryPreferences = Array.isArray(data.body.preferences)
		? data.body.preferences
		: JSON.parse(data.body.preferences);
	const key = {
		_key: `user:${luid}:preferences:category`,
		uid: luid,
	};

	const currentPreferences = await db.findField(collectionName, key);
	if (!currentPreferences) {
		// initializing a blank preference document for an individual user by the user Id
		await db.setField(collectionName, key);
	}

	if (categoryPreferences.length > 0) {
		const categoryData = await db.findFields(collectionName,
			{ categoryType: { $exists: true } },
			["cid", "name", "parentCid"]
		);
		const sub_categories = categoryData.filter((e) => e.parentCid > 0);
		const parent_categories = categoryData.filter(
			(e) => e.parentCid < 1 || e.parentCid === undefined
		);
		const preferences = [];
		const errors = [];

		categoryPreferences.forEach((preference) => {
			let category = parent_categories.find((e) => e.cid == preference.cid);
			let sub_cats = [];
			if (category) {
				if (preference.sub_cids && preference.sub_cids.length > 0) {
					preference.sub_cids.forEach((sub_cid) => {
						let sub_cat = sub_categories.find((e) => e.cid == sub_cid);
						if (!sub_cat) {
							errors.push({ cid: sub_cid, error: "Invalid sub-category" });
						} else if (sub_cat.parentCid != preference.cid) {
							errors.push({
								cid: sub_cid,
								error: `Sub-category does not belong to the parent category with id ${preference.cid}`,
							});
						} else sub_cats.push(sub_cat);
					});
				}
			} else {
				errors.push({ cid: preference.cid, error: "Invalid category id" });
			}

			preferences.push({ ...category, sub_categories: sub_cats });
		});
		if (errors.length) throw new Error(JSON.stringify({ errors }));
		else await db.update(collectionName, key, { $set: { preferences: preferences } });
	} else {
		await db.update(collectionName, key, { $set: { preferences: [] } });
	}

	// if (secondary_preference) {
	//

	// 	let main_category = parent_categories.filter(e => e.name == field);
	// 	if (main_category.length != 1) {
	// 		throw new Error(`Category with the name '${field}' doesn't exist`);
	// 	}
	// 	let sub_category = sub_categories.filter(e => e.name == secondary_preference);
	// 	if (sub_category.length != 1) {
	// 		throw new Error(`Sub category with the name '${secondary_preference}' doesn't exist`);
	// 	}
	// 	if (main_category[0].cid != sub_category[0].parentCid) {
	// 		throw new Error(`'${sub_category[0].name}' is not a part of '${main_category[0].name}'`);
	// 	}
	// 	await db.update({ ...key, [field]: { $exists: false }}, { $set: { [field]: main_category[0] } })
	// 	await db.update({ ...key, [`${field}.sub_categories`]:  {$ne: sub_category[0] } }, { $push: { [`${field}.sub_categories`]: sub_category[0] } });
	// }

	if (sortBy) {
		if (sortingFields.indexOf(sortBy) === -1) {
			throw new Error(
				`Invalid sorting field '${sortBy}', the valid fields are '${sortingFields.join(
					", "
				)}'`
			);
		}
		const sortingKeys = {
			_key: `user:${luid}:preferences:sorting`,
			uid: luid,
		};
		const sortingData = await db.findField(collectionName, sortingKeys);
		if (!sortingData) {
			// initializing a blank sorting document for an individual user by the user Id
			await db.setField(collectionName, sortingKeys);
		}
		await db.update(collectionName, sortingKeys, {
			$set: { sorting: sortBy, sort_id: sortingIds[sortBy] },
		});
	}
	return { updated: true };
};
/**
 * @author imshawan
 * @date 08-03-2022
 * @function removePreferences
 * @description DEPRICATED ->
 * The main controller for removing a preference from the preferences list for a particular user
 * @param {Object} data Request body
 * @returns Boolean, updated: true if the preference object was updated successfully
 */
// appApi.removePreferences = async (data) => {
// 	const luid = parseInt(data.uid)
// 	if (!data.uid || luid < 1) throw new Error("Unauthorized");

// 	const secondary_preference = data.body.sub_category; // sub category name
// 	const field = data.body.category; // category name
// 	const sortBy = data.query.clearSort;
// 	const key = {
// 		_key: `user:${luid}:preferences:category`,
// 		uid: luid
// 	};
// 	const currentPreferences = await db.findField(collectionName, key);
// 	if (!currentPreferences) {
// 		throw new Error('No preferences has been set yet')
// 	}

// 	if (secondary_preference) {
// 		if (!currentPreferences[field]) {
// 			throw new Error(`No category with the name '${field}' exists in the preferences list`);
// 		}
// 		if (currentPreferences[field].sub_categories && currentPreferences[field].sub_categories.filter(el => el.name == secondary_preference).length != 1) {
// 			throw new Error(`No Sub-category with the name '${secondary_preference}' exists in the preferences list`);
// 		}

// 		// await db.update({ ...key, [field]: { $elemMatch: {'name': secondary_preference} }},
// 		// { $pull: { [field]: { 'name': secondary_preference } }});
// 		await db.update({ ...key, [`${field}.sub_categories`]:  { $elemMatch: {'name': secondary_preference} }}, { $pull: { [`${field}.sub_categories`]:  { $elemMatch: {'name': secondary_preference} } }});
// 	}

// 	if (sortBy) {
// 		if (sortingFields.indexOf(sortBy) === -1) {
// 			throw new Error(`Invalid sorting field '${sortBy}', the valid fields are '${sortingFields.join(', ')}'`);
// 		}
// 		const sortingKeys = {
// 			_key: `user:${luid}:preferences:sorting`,
// 			uid: luid
// 		};
// 		const sortingData = await db.findField(collectionName, sortingKeys);
// 		if (!sortingData) throw new Error('No sorting preferences has been set')

// 		await db.update({ ...sortingKeys, 'sorting': { $eq: sortBy }}, { $pull: { 'sorting': sortBy }});
// 	}
// 	return { updated: true };
// }

appApi.getPreferences = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const preferences = await Promise.all(
		preferenceFields.map(async (pref) => {
			let preference = await db.findField(collectionName, {
				_key: `user:${luid}:preferences:${pref}`,
				uid: luid,
			});
			if (preference) {
				delete preference._id;
				delete preference._key;
				return { [pref]: preference };
			}
		})
	);
	return preferences;
};

appApi.getCategory = async (data) => {
	const collectionName = db.collections.DEFAULT;
	const categoryFields = ["name", "cid", "categoryType"];
	// , $or: [{'parentCid' : {$exists:false}}, {'parentCid' : 0}]
	let category = await db.findFields(collectionName,
		{ categoryType: { $exists: true } },
		categoryFields
	);
	if (data.query.name) {
		category = await db.findFields(collectionName, { name: data.query.name }, categoryFields);
	}

	await Promise.all(
		category.map(async (elem) => {
			let subCategory = await db.findFields(collectionName,
				{ parentCid: elem.cid },
				categoryFields
			);
			elem["sub_categories"] = subCategory;
		})
	);
	return category;
};

/**
 * @author Tharun Vemula
 * @function createArticle
 * @description Controller for creating an article.
 * @param {Object} data Request object
 * @returns Id of the created article
 */
appApi.createArticle = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	let cid = parseInt(data.body.cid);
	const sub_cid = parseInt(data.body.sub_cid);
	const nid = parseInt(data.body.nid);
	if (!cid) cid = await getCustomCategoryId("articles");

	// const tid = await db.incrObjectField("global", "nextTid");
	const tid = 1;
	const pid = await db.incrObjectField('global', 'nextPid');

	let article = {
		_key: 'article:' + pid,
		uid: luid,
		tid: tid,
		pid: pid,
		cid: cid,
		sub_cid: sub_cid,
		title: data.body.title,
		content: data.body.content,
		tp: data.body.tp,
		nid: nid,
		mainPid: 0,
		lastposttime: 0,
		postcount: 0,
		viewcount: 0,
		wordcount: data.body.wordcount || 0,
		timestamp: data.timestamp || Date.now(),
		type: "article",
	};

	if (data.body.isDraft) {
		article.status = JSON.parse(data.body.isDraft.toLowerCase()) ? 'draft' : 'published';
	}

	if (data.files && data.files.files) {
		const uploads = await Uploader.uploadContent(data);
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				article[file.field] = file.url;
			});
		}
	}

	await publishArticle(article);
	await db.setField(db.collections.DEFAULT, article);
	return { pid };
};

appApi.getArticles = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const userFields = [
		"username",
		"fullname",
		"userslug",
		"picture",
		"signature",
	];

	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limitBy) || 5;
	const article_type = data.query.type || "latest";

	const keys = {
		type: "article",
		//uid : luid
	};
	let articleData = {};
	let docs = {};
	let count = 1;
	const order = {};
	if (article_type == "latest") {
		order["viewcount"] = 1;
	} else {
		order["viewcount"] = -1;
	}

	if (data.query.pid) {
		let pid = parseInt(data.query.pid);
		let key = { pid: pid, type: "article" };

		let article = await db.findField(collectionName, key);
		if (!article) throw new Error("Doesnt exists");
		let [userData, _] = await Promise.all([
			await User.getUserFields([article.uid], userFields),
			db.incrementCount(collectionName, key, "viewcount"),
			db.incrementCount(db.collections.SDLMS.ARTICLES_HOME, { _key: `article:${pid}:approved` }, "viewcount"),
		]);

		let article_data = { ...article, viewcount: article.viewcount + 1, user: userData }
		return utilities.paginate(`/app${data.url}`, article_data, count, limit, page)
	}
	else if (data.body.preferences && data.body.preferences.length != 0) {
		const preferences = data.body.preferences;
		let filter = [];
		preferences.forEach((preference) => {
			if (preference.hasOwnProperty("sub_cids")) {
				preference["sub_cids"].forEach((sub_cid) => {
					let key = {};
					key["sub_cid"] = sub_cid;
					key["cid"] = preference["cid"];
					key["type"] = "article";
					filter.push(key);
				});
			} else {
				let key = {};
				key["cid"] = preference["cid"];
				key["type"] = "article";
				filter.push(key);
			}
		});
		let search = {};
		search["$or"] = filter;

		[articleData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, search, limit, page, order),
			db.countDocuments(collectionName, search),
		]);
	} else if (data.query.term) {
		const term = data.query.term;
		[articleData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName,
				{
					$or: [{ title: { $regex: term }, content: { $regex: term } }],
					type: "article",
				},
				limit,
				page
			),
			db.countDocuments(collectionName, {
				$or: [{ title: { $regex: term }, content: { $regex: term } }],
				type: "article",
			}),
		]);
	} else {
		[articleData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, keys, limit, page),
			db.countDocuments(collectionName, keys),
		]);
	}
	const articles = await Promise.all(
		articleData.map(async (elem) => {
			let [userData] = await Promise.all([
				User.getUserFields([elem.uid], userFields),
			]);
			return { ...elem, user: userData };
		})
	);
	return utilities.paginate(`/app${data.url}`, articles, count, limit, page);
};

appApi.updateArticle = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const keys = {
		type: "article",
		uid: luid,
		pid: parseInt(data.params.pid),
	};

	let parsedData = {};

	if (data.body.content) parsedData.content = data.body.content;
	if (data.body.wordcount) parsedData.wordcount = data.body.wordcount;
	if (data.body.title) parsedData.title = data.body.title;
	if (data.body.cid) parsedData.cid = data.body.cid;
	if (data.body.sub_cid) parsedData.sub_cid = data.body.sub_cid;
	if (data.body.tp) parsedData.tp = data.body.tp;
	if (data.body.nid) parsedData.nid = data.body.nid;
	if (data.body.isDraft) {
		parsedData.status = JSON.parse(data.body.isDraft.toLowerCase()) ? 'draft' : 'published';
	}

	if (data.files && data.files.files) {
		const uploads = await Uploader.uploadContent(data);
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				parsedData[file.field] = file.url;
			});
		}
	}

	let state = await db.updateField(collectionName, keys, { $set: parsedData });
	if (state && state.result) {
		if (state.result.n < 1) {
			throw new Error("Update operation was unsuccessful");
		}
	} else throw new Error("Unauthorized write access!");

	await publishArticle({ ...parsedData, pid: keys.pid });
	return state;
};

appApi.deleteArticle = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	const isAdmin = await User.isAdministrator(luid);
	const pid = parseInt(data.params.pid);
	const approvedArticleKeys = { _key: `article:${pid}:approved` };
	const keys = {
		type: "article",
		pid: pid,
	};

	if (!isAdmin) {
		keys.uid = luid;
		approvedArticleKeys.uid = luid;
	}

	const collectionName = db.collections.DEFAULT;
	const [response] = await Promise.all([
		db.removeField(collectionName, keys),
		db.removeField(db.collections.SDLMS.ARTICLES_HOME, approvedArticleKeys)
	]);
	if (response.result.n === 1) {
		return { deleted: true };
	} else {
		return { deleted: false };
	}
};

/**
 * @date 07-05-2022
 * @author imshawan
 * @function publishArticle
 * @description This function is used to approve a particular article that is going to be displayed on the article's sub-domain
 * @param {Object} data 
 */

async function publishArticle(data) {
	const key = { _key: `article:${data.pid}:approved` };
	const collectionName = db.collections.SDLMS.ARTICLES_HOME;
	let article = await db.findField(collectionName, key);

	const approvedArticleData = {};

	if (data.content) {
		// Converting HTML data to normal text and generating a mini-content for the article
		let content = data.content.replace(/(<([^>]+)>)/g, "");
		approvedArticleData.content = content.substr(0, 140) + '...';
		approvedArticleData.raw = content;
	}

	['uid', 'pid', 'tid', 'title', 'cid', 'image', 'sub_cid', 'viewcount', 'wordcount', 'status', 'featured'].forEach(field => {
		if (data[field]) approvedArticleData[field] = data[field];
	})

	if (article) {
		await db.updateField(collectionName, key, { $set: approvedArticleData }, { upsert: false });
	} else {
		await db.setField(collectionName, { ...approvedArticleData, ...key });
	}
}

/**
 * @date 20-05-2022
 * @author imshawan
 * @function updateRank
 * @description Helps in updating the rank of a particular using using CSV file upload method
 * @param {Object} data 
 * @returns Updated as true, if operation is successful
 */
const csvFileFields = ['email', 'username', 'uid', 'rigor_rank']; // Must match the CSV file (Checking the fields are in order)
appApi.updateRank = async function (data) {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error("Unauthorized");
	}
	const isAdmin = await User.isAdministrator(luid);
	if (!isAdmin) throw new Error("Unauthorized! Only admins can update rank");

	const collectionName = db.collections.DEFAULT;
	const MAX_ITEMS_PER_CSV = 100;
	let userRankList = [];

	if (data.files && data.files.files) {
		let csvFile = await Uploader.uploadContent(data);

		if (csvFile && csvFile.length !== 0) {
			let filepath = csvFile[0].url;
			let fileSync = fs.readFileSync(filepath.replace('/assets', 'public'), { encoding: 'utf8', flag: 'r' });
			fileSync = fileSync.split('\n');
			let header = fileSync.splice(0, 1)[0].split(',');

			// Verifying over incoming CSV file whether it has all fields and and is in the correct order
			csvFileFields.forEach((field, index) => {
				try {
					// Check for the correct order of the fields in the CSV file
					if (header[index].trim().toLowerCase() !== field) {
						throw new Error(`Invalid CSV file structure`);
					}
				} catch {
					// Catch the error incase of missing fields
					throw new Error(`Invalid CSV file.`);
				}
			});

			// fileSync = fileSync.splice(1); // remove header
			let records = fileSync.length;
			if (records > MAX_ITEMS_PER_CSV) {
				throw new Error(`Current CSV file has ${records} records, maximum records supported is ${MAX_ITEMS_PER_CSV}`);
			}

			await Promise.all(fileSync.map(async (line) => {
				let username = line.split(',')[1];
				let uid = line.split(',')[2];
				let rank = line.split(',')[3];
				if ((uid && isNaN(uid)) || (rank && isNaN(rank))) throw new Error("Ranks and UID are not in correct format");
				else if (uid && uid != 0) {
					uid = parseInt(uid);
					rank = parseInt(rank);
					await db.update(collectionName, { _key: `user:${uid}` }, { $set: { rigor_rank: rank } });
					userRankList.push({ username, uid, rigor_rank: rank });
				}
			}))
		}
	} else {
		throw new Error("No CSV file was found in the request body");
	}

	return { updated: true, list: userRankList };
};

appApi.deleteRank = async function (data) {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error("Unauthorized");
	}
	const collectionName = db.collections.DEFAULT;
	let key = {
		uid: luid,
	};
	let updateData = {
		$set: {
			rigor_rank: 0,
		},
	};
	return await db.update(collectionName, key, updateData);
};

/**
 * @date 20-05-2022
 * @author imshawan
 * @function exportRigorRankListAsCSV
 * @description Responsible for exporting the list of users with their rigor rank in CSV format
 * @param {Object} data 
 * @param {Object} response
 */
appApi.exportRigorRankListAsCSV = async function (data) {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error("Unauthorized");
	}
	const isAdmin = await User.isAdministrator(luid);
	if (!isAdmin) throw new Error("Unauthorized! Only admins has access to rigor_rank");
	const collectionName = db.collections.DEFAULT;

	/**
	 * @description Checking rss_token because, only a user can have this property. 
	 * The 'rigor_rank' property exists in other documents too, but 'rss_token' is only limited to users
	 */
	let rankedUsers = await db.findFields(collectionName, { rigor_rank: { $exists: true, $ne: null }, joindate: { $exists: true, $ne: null } });

	const rigorRankList = rankedUsers.map(user => {
		let lines = ''
		csvFileFields.forEach(field => {
			lines += `${user[field]},`;
		})
		return lines;
	})
	const path = require('path');
	const { baseDir } = require('../constants').paths;

	const fd = await fs.promises.open(
		path.join(baseDir, 'build/export', 'rigorRankList.csv'),
		'w'
	);
	fs.promises.appendFile(fd, csvFileFields.join() + '\n');
	fs.promises.appendFile(fd, rigorRankList.join('\n'));
	await fd.close();
}

appApi.getRankList = async function (data) {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) {
		throw new Error("Unauthorized");
	}
	const isAdmin = await User.isAdministrator(luid);
	if (!isAdmin) throw new Error("Unauthorized! Only admins has access to rigor_rank");
	const collectionName = db.collections.DEFAULT;

	/**
	 * @description Checking rss_token because, only a user can have this property. 
	 * The 'rigor_rank' property exists in other documents too, but 'rss_token' is only limited to users
	 */
	let rankedUsers = await db.findFields(collectionName, { rigor_rank: { $exists: true, $ne: null }, joindate: { $exists: true, $ne: null } });

	return rankedUsers.map(user => {
		let fields = {}
		csvFileFields.forEach(field => {
			fields[field] = user[field];
		})
		return fields;
	})
}

/**
 * @author imshawan
 * @date 04-03-2022
 * @function fetchApi
 * @description The function takes the url, headers, payload, method as parameters and processes an API call
 * @param {String} URL
 * @param {Object} headers
 * @param {Object} payload (Data to be sent, pass an empty object in case it's a GET call)
 * @param {String} method
 * @returns {Object} Response body
 */
async function fetchApi(URL, headers, payload, method) {
	const { data } = await axios.request({
		url: URL,
		method: method.toUpperCase(),
		data: payload,
		headers: headers,
	});

	return data;
}
/**
 * @author imshawan
 * @date 04-03-2022
 * @function generateAccessToken
 * @description Generates a Zoho desk access token bassed upon the Client ID, Refresh token and Client Secret
 * that should be added to the config.json, at the root of nodebb
 * @returns {Object} access token
 */
async function generateAccessToken() {
	const clientId = nconf.get("client_id");
	const refreshToken = nconf.get("refresh_token");
	const clientSecret = nconf.get("client_secret");
	const baseURL = "https://accounts.zoho.in/oauth/v2/token";

	const QueryParams = new URLSearchParams({
		client_id: clientId,
		grant_type: "refresh_token",
		refresh_token: refreshToken,
		client_secret: clientSecret,
	});

	const URL = `${baseURL}?${QueryParams}`;
	return await fetchApi(URL, headers, {}, "post");
}

/**
 *
 * @author imshawan
 * @function createPost
 * @param {Object} data
 * @description Creates a post under a particular category and returns the Id of the post.
 * The only difference with this object (post) is, it is a topic under a category which will not have any post linked to it. (as nodebb has a post linked to each topic)
 * The topic acts as a post therefore leaving behind no linked posts as in nodebb architecture
 * @returns post Id (tid)
 */

async function createPost(data) {
	// To avoid confusions, topic is equal to post here
	const timestamp = data.timestamp || Date.now();

	const tid = data.tid || await db.incrObjectField("global", "nextTid");

	let topicData = {
		...data,
		tid: tid,
		mainPid: 0,
		timestamp: timestamp,
		lastposttime: 0,
		postcount: 0,
		viewcount: 0,
	};
	const result = await plugins.hooks.fire("filter:topic.create", {
		topic: topicData,
		data: data,
	});
	topicData = result.topic;
	await db.setObject("topic:" + topicData.tid, topicData);

	await Promise.all([
		db.sortedSetsAdd(
			[
				"topics:tid",
				"cid:" + topicData.cid + ":tids",
				"cid:" + topicData.cid + ":uid:" + topicData.uid + ":tids",
			],
			timestamp,
			topicData.tid
		),
		db.sortedSetsAdd(
			[
				"topics:views",
				"topics:posts",
				"topics:votes",
				"cid:" + topicData.cid + ":tids:votes",
				"cid:" + topicData.cid + ":tids:posts",
			],
			0,
			topicData.tid
		),
		categories.updateRecentTid(topicData.cid, topicData.tid),
		db.incrObjectField("category:" + topicData.cid, "topic_count"),
		db.incrObjectField("global", "topicCount"),
	]);

	plugins.hooks.fire("action:topic.save", {
		topic: _.clone(topicData),
		data: data,
	});
	return { tid: topicData.tid };
}

/**
 *
 * @author imshawan
 * @function getCustomCategoryId
 * @param {String} category_name
 * @description If the category exists then it will return back the Id or else it will create a new category and return its Id
 * @returns Category ID
 */

async function getCustomCategoryId(category_name) {
	const collectionName = db.collections.DEFAULT;
	let data = {
		name: category_name,
		description: "",
		icon: "fa-comments",
		uid: 1, //Admin
		parentCid: 0,
		cloneFromCid: 0,
		custom: true,
	};
	let category = await db.findField(collectionName, {
		cid: { $exists: true, $ne: null },
		parentCid: 0,
		custom: true,
		name: category_name,
	});
	if (!category) category = await categories.create(data);
	return category.cid;
}

/**
 * @author Subham Bhattacharjee
 * @param {*} tag
 * @param {*} data
 * @description Creates new tag if it doesn't already exists, tags have a tagid which is the same as name of the
 * tag. has afunction which is tag to get them more easily
 * @returns tagid of the created tag and data returned by setfield
 */

async function createTag(tag, data) {
	const tagid = utils.slugify(tag);
	const _key = `tag:${tagid}`;
	const collectionName = db.collections.DEFAULT;

	const TagData = db.findField(collectionName, { _key });

	if (TagData) throw new Error("already exists");

	const tagData = await db.setField(collectionName, {
		_key,
		tagid,
		name: tag,
		type: data.type || "unasigned",
		function: "tag",
	});
	return {
		tagid,
		tagData,
	};
}

/**
 * @author Shubham Bawner
 * @date 7th march
 * @functions to create update delete and get the reflections
 */

appApi.createReflection = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	const cid = await getCustomCategoryId("reflections");

	return await createPost({
		cid,
		content: data.body.content,
		uid: luid, // of the user it is attached to
		topic_tid: data.body.topic_tid, //tid of the event that it is attached to this reflection
		approved: false, //is it already anecdote? this is required by admin pannel, when we want to make anecdotes
		timestamp: Date.now(),
		type: "reflection",
	});
};

appApi.getReflections = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const page = parseInt(data.query.page) || 0;
	const limit = parseInt(data.query.limitBy) || 5;


	let reflectionData = {};
	let count = 0;

	if (data.query.uid) {
		let queriedUid = Number(data.query.uid);
		[reflectionData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, { uid: queriedUid, type: 'reflection' }, limit, page),
			db.countDocuments(collectionName, collectionName, { uid: queriedUid, type: 'reflection' }),
		]);
	} else {
		const keys = getKeysByTime(data, [{ type: "reflection" }]);
		[reflectionData, count] = await Promise.all([
			db.getFieldsWithPagination(collectionName, keys, limit, page),
			db.countDocuments(collectionName, collectionName, keys),
		]);
	}

	let reflections = await Promise.all(
		reflectionData.map(async (elem) => {
			let [userData, attachment] = await Promise.all([
				await User.getUserFields(
					[elem.uid],
					["username", "fullname", "userslug", "picture"]
				),
				db.findField(collectionName, { _id: ObjectId(elem.attachment_id) }),
			]);
			return { ...elem, user: userData, attachment: attachment };
		})
	);

	//reflections = [...reflections, customFromDate, customToDate, data.query.fromDate , data.query.toDate, from, to]
	return utilities.paginate(`/app${data.url}`, reflections, count, limit, page);
};

appApi.updateReflection = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");
	const collectionName = db.collections.DEFAULT;

	const keys = {
		type: "reflection",
		uid: luid,
		tid: parseInt(data.params.tid),
	};
	let parsedData = {};
	if (data.body.content) parsedData.content = data.body.content;
	if (data.body.topic_tid) parsedData.topic_tid = data.body.topic_tid;
	if (data.body.cid) parsedData.cid = data.body.cid;

	let state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error("Unauthorized write access!");
	}
	return state;
};

appApi.deleteReflection = async (data) => {
	const luid = parseInt(data.uid);
	if (!data.uid || luid < 1) throw new Error("Unauthorized");

	const keys = {
		type: "reflection",
		tid: parseInt(data.params.tid),
	};
	const collectionName = db.collections.DEFAULT;
	const response = (await User.isAdministrator(luid))
		? await db.removeField(collectionName, keys)
		: await db.removeField(collectionName, { ...keys, uid: luid });
	if (response.result.n === 1) {
		return { deleted: true };
	} else {
		return { deleted: false };
	}
};

/**
 * to get keys to pass in mongodb search, to filter and get the documents that match date criterion specified by query parameters in req
 * @param {data} req parameter, that can be used to access the query parameters
 * @param {otherFilters} otherFilters array of json filter criterias (ex. [{criteria1:'value'},{type:'reflection'}]) all other filters that are to be applied to data, NOTE: 1. these filters will be applied before time filters 2. in a AND logic, i.e. ONLY the documents from database matching ALL the other fields AND time stamp will be given
 * @returns keys as a json object to pass in mongodb search,
 * @author Sam
 */
let getKeysByTime = (data, otherFilters = []) => {
	let from =
		!isNaN(parseInt(data.query.from)) &&
			JSON.stringify(data.query.from).length >= 12
			? parseInt(data.query.from)
			: Date.now() - 3600000 * 24 * 7; //default period 1 week, 3600000 is no. of milliseconds in 1 hour
	let to =
		!isNaN(parseInt(data.query.to)) &&
			JSON.stringify(data.query.to).length >= 12
			? parseInt(data.query.to)
			: Date.now(); //default period 1 week, 3600000 is no. of milliseconds in 1 hour

	let customFromDate = undefined,
		customToDate = undefined;

	if (data.query.fromDate) {
		customFromDate = data.query.fromDate.split("/"); // pass as "yyyy/mm/dd"
		customFromDate[1]--; //month is by default taken from 0(0 is Jan), but query is to be passed as general date(Jan is 1)
		from = !isNaN(new Date(...customFromDate).getTime())
			? new Date(...customFromDate).getTime()
			: from;
	}
	if (data.query.toDate) {
		customToDate = data.query.toDate.split("/"); // pass as "yyyy/mm/dd"
		customToDate[1]--; //month is by default taken from 0(0 is Jan), but query is to be passed as general date(Jan is 1)
		to = !isNaN(new Date(...customToDate).getTime())
			? new Date(...customToDate).getTime()
			: to;
	}
	const keys = {
		$and: [
			...otherFilters,
			{ timestamp: { $gte: from } },
			{ timestamp: { $lte: to } },
		],
	};
	return keys;
};

async function getFieldsWithPreferences(uid, keys, preferences) {
	const UserPreferences =
		preferences ??
		(await preferenceFields.reduce(
			async (userPreferences, preferenceField) => ({
				...(await userPreferences),
				[preferenceField]: await db.getField(
					`user:${uid}:preferences:${preferenceField}`
				),
			}),
			Promise.resolve({})
		));
	const keysWithPreferences = { ...keys };
	Object.keys(UserPreferences).forEach((preferenceField) => {
		const fieldValue = UserPreferences[preferenceField];
		if (preferenceField === "sorting") {
		}
		if (preferenceField === "category") {
			if (keysWithPreferences.cid) return;
			keysWithPreferences.cid = { $in: [] };
			Object.keys(fieldValue).forEach((key) => {
				if (key === "_id" || key === "_key") return;
				keysWithPreferences.cid.$in.push(
					...(Array.isArray(fieldValue[key])
						? fieldValue[key]
						: [fieldValue[key]])
				);
			});
		}
	});
	return await db.getFields(keysWithPreferences);
}

// async function search(data){
// 	const start = process.hrtime();
// 	data.searchIn = data.searchIn || 'posts';

// 	let result;
// 	result = await searchInContent(data);
// 	result.time = (process.elapsedTimeSince(start) / 1000).toFixed(2);
// 	return result;
// }

// async function searchInContent(data) {
// 	data.uid = data.uid || 0;

// 	async function doSearch(type, searchIn) {
// 		if (searchIn.includes(data.searchIn)) {
// 			return await plugins.hooks.fire('filter:search.query', {
// 				// index: type,
// 				content: data.query,
// 				matchWords: data.matchWords || 'all',
// 				// cid: [],
// 				// uid: [],
// 				searchData: data,
// 			});
// 		}
// 		return [];
// 	}

// 	const [pids, tids] = await Promise.all([
// 		doSearch(data.type, [data.searchIn]),
// 	]);

// 	if (data.returnIds) {
// 		return { pids: pids, tids: tids };
// 	}
// 	else{
// 		return { result :   }
// 	}


const Messaging = require('../messaging');

appApi.createRoom = async (req) => {
	const luid = parseInt(req.uid)

	if (!req.uid || luid <= 0) throw new Error("Unauthorised")

	const uid = req.uid
	const category = req.body.category || 'discuss_room';
	const cid = await getCustomCategoryId(category)

	let moderators = Array.isArray(req.body.moderators) ? req.body.moderators : [req.body.moderators];

	const Data = {
		type: 'discuss_room',
		cid: cid,
		sub_cid: req.body.sub_cid,
		uid: uid,
		name: req.body.name,
		classification: req.body.classification,
		criteria: req.body.criteria,
		description: req.body.description,
		rules: req.body.rules,
		attachment_id: req.body.attachment_id || null,
		moderators: moderators,
		toUids: req.body.toUids || []
	}

	if (req.files && req.files.files) {
		const uploads = await Uploader.uploadContent(req)
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				Data[file.field] = file.url
			})
		}
	}

	let { roomId } = await Messaging.createRoom(Data, uid);
	await Messaging.addUsersToDiscussionRoom(req.uid, moderators, roomId);


	return { roomId };
}

appApi.getRoom = async (req) => {
	const luid = parseInt(req.uid)
	if (!req.uid || luid <= 0) throw new Error("Unauthorised")

	if (req.body.roomId.length == 1) {
		return await Messaging.getRoomData(req.body.roomId);
	}
	else {
		return await Messaging.getRoomsData(req.body.roomId)
	}

}

appApi.deleteRoom = async (req) => {
	const uid = parseInt(req.uid);
	const roomId = parseInt(req.params.roomId)

	if (!req.uid || uid <= 0) throw new Error("Unauthorised");
	if (!roomId || roomId <= 0) throw new Error("Room doesn't exists. Check RoomId")


	const collectionName = db.collections.DEFAULT;
	const data = {
		uid: uid,
		roomId: roomId,
		type: "discuss_room",
	}


	const { result } = await db.removeField(collectionName, data)


	return { deleted: result.n > 0 };
};

appApi.updateRoom = async (req) => {
	const uid = parseInt(req.uid);
	const roomId = parseInt(req.params.roomId)

	if (!uid || uid < 1) throw new Error("Unauthorized");
	if (!roomId || roomId < 1) throw new Error("Room doesn't exists. Check RoomId");

	const collectionName = db.collections.DEFAULT;

	const keys = {
		type: "discuss_room",
		uid: uid,
		roomId: roomId,
	};


	let parsedData = {};
	if (req.body.name) parsedData.name = req.body.name;
	if (req.body.title) parsedData.title = req.body.title;
	if (req.body.cid) parsedData.cid = req.body.cid;
	if (req.body.sub_cid) parsedData.sub_cid = req.body.sub_cid;
	if (req.body.classification) parsedData.classification = req.body.classification;
	if (req.body.criteria) parsedData.criteria = req.body.criteria;
	if (req.body.description) parsedData.description = req.body.description;
	if (req.body.rules) parsedData.rules = req.body.rules;
	if (req.body.attachment_id) parsedData.attachment_id = req.body.attachment_id;

	if (req.files && req.files.files) {
		const uploads = await Uploader.uploadContent(req);
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				parsedData[file.field] = file.url;
			});
		}
	}

	let state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
	if (!state) {
		throw new Error("Unauthorized write access!");
	}
	return state;
};


appApi.sendMessage = async (req) => {
	const luid = parseInt(req.uid)

	if (!req.uid || luid <= 0) throw new Error("Unauthorised")

	const data = {
		uid: luid,
		roomId: parseInt(req.body.roomId),
		content: req.body.content
	}

	return await Messaging.sendMessage(data);
}

appApi.addUsers = async (req) => {
	const uid = parseInt(req.uid)
	if (!req.uid || uid <= 0) throw new Error("Unauthorised")

	const uids = req.body.uids;
	console.log('uids', typeof req.body.uids)
	const roomId = parseInt(req.body.roomId);
	return await Messaging.addUsersToDiscussionRoom(uid, uids, roomId)

}

appApi.removeUsers = async (req) => {
	const uid = parseInt(req.uid)
	if (!req.uid || uid <= 0) throw new Error("Unauthorised")

	const uids = req.body.uids;
	const roomId = parseInt(req.body.roomId);

	console.log(uid, uids, roomId)
	return await Messaging.removeUsersFromRoom(uid, uids, roomId)

}

appApi.leaveRoom = async (req) => {
	const uid = parseInt(req.uid)
	if (!req.uid || uid <= 0) throw new Error("Unauthorised")

	const uids = req.body.uids;
	const roomId = req.body.roomId;
	return await Messaging.leaveRoom(uids, roomId)
}

appApi.loadRoom = async (req) => {
	const uid = parseInt(req.uid)
	const roomId = parseInt(req.body.roomId)
	if (!req.uid || uid <= 0) throw new Error("Unauthorised")

	const data = {
		roomId: roomId,
		uid: uid
	}

	return await Messaging.loadRoom(uid, data)
}

appApi.deleteMessage = async (req) => {
	const uid = parseInt(req.uid)
	if (!req.uid || uid <= 0) throw new Error("Unauthorised")

	const mid = req.body.mid;
	return await Messaging.deleteMessage(mid, uid)

}

appApi.getMessages = async (req) => {
	const uid = parseInt(req.uid)
	if (!req.uid || uid <= 0) throw new Error("Unauthorised")

	const data = {
		uid: uid,
		isNew: req.body.isNew || false,
		callerUid: req.body.callerUid,
		roomId: parseInt(req.body.roomId),
	}

	return await Messaging.getMessages(data);
}

appApi.uploadFiles = async (req) => {
	const uid = parseInt(req.uid)
	if (!req.uid || uid <= 0) throw new Error("Unauthorised")
	const data = {}

	if (req.files && req.files.files) {
		const uploads = await Uploader.uploadContent(req);
		if (uploads && uploads.length !== 0) {
			uploads.forEach((file) => {
				data[file.field] = file.url
			})
		}
	}

	return data;
}
