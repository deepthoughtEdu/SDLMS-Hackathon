"use strict";

const winston = require("winston");
const db = require("../database");
const user = require("../user");
const helpers = require('../controllers/helpers');
const groups = require('../groups');
const privileges = require('../privileges');

const parentDashboard = module.exports;

parentDashboard.get = async function (req, res, next) {
	const uid = parseInt(req.uid);
	const collectionName = db.collections.DEFAULT;
	// const isParent = await privileges.users.isParent(req.uid);
	// if(!isParent){ throw new Error("You are not a parent. Please ask the administrator to add you to the parent group."); }

	if (!req.uid || uid < 1) { throw new Error("You must be logged in"); }

	const fields = [
		"uid",
		"username",
		"fullname",
		"userslug",
		"picture",
		"status",
		"assetsCount",
		"classes_attended",
		"signature"
	]
	const parentDashboardData = {};
    const keys = {
		type: 'session',
		members: uid,
		schedule: { $gte: Date.now() - 3600000 }
	}

	var [userData, userGroupData, isTeacher, isStudent, Sessions, 
		feedbacksReceivedCount, feedbacksGivenCount] = await Promise.all([
		user.getUsersFields([req.uid], fields),
		groups.getUserGroups([req.uid]),
		privileges.users.isTeacher(req.uid),
		privileges.users.isStudent(req.uid),
		db.getFieldsWithPagination(collectionName, keys, 5, 0, { schedule: 1 }),
		db.countDocuments(collectionName, { type: 'feedback', asset_owner_uid: uid }),
		db.countDocuments(collectionName, { type: 'feedback', creator: uid })
	])

	userGroupData = userGroupData[0];
	const userGroupNames = userGroupData.filter(Boolean).map(group => group.name);
	userData[0].userGroups = userGroupNames;

	parentDashboardData.title = "Parent Dashboard";
	parentDashboardData.user = userData;
	parentDashboardData.isTeacher = isTeacher;
	parentDashboardData.isStudent = isStudent;
	parentDashboardData.feedbackCount = feedbacksReceivedCount + feedbacksGivenCount;
	parentDashboardData.Sessions = Sessions.filter(elem => elem.members.includes(parseInt(req.uid)));
	try {
		const latest_session_tid = parentDashboardData.Sessions[0].tid;
		const latest_session = await db.findField(collectionName, { type: 'eaglebuilder', topicId: latest_session_tid })
		parentDashboardData.ebMapped = latest_session.sessionTracker || false;
	} catch { }

	res.render("sdlms/parent_dashboard", parentDashboardData);
};

// parentDashboard.create = async function (req, res, next) {
// 	const teacher_uid = parseInt(req.body.teacher_uid);
// 	const teacherData = await user.getUserFields([teacher_uid], [
// 		"username",
// 		"fullname",
// 		"userslug",
// 		"picture",
// 		"status"
// 	])

// 	const tid = await db.incrObjectField('global', 'nextTid');
// 	const payload = {
// 		uid: parseInt(req.uid),
// 		tid: parseInt(tid),
// 		type: "session",
// 		category: req.body.category,
// 		sub_category: req.body.sub_category,
// 		topic: req.body.topic ? req.body.topic : "",
// 		teacher_uid: teacher_uid,
// 		teacher: teacherData,
// 		teaser: req.body.teaser,
// 		relatedSessions: req.body.relatedSessions ? req.body.relatedSessions : 'No related sessions',
// 		schedule: parseInt(req.body.schedule),
// 		members: JSON.parse(req.body.members)
// 	}
// 	await db.setField(payload);
// 	helpers.formatApiResponse(200, res, { tid: tid });
// }

// parentDashboard.update = async function (req, res, next) {
// 	const payload = {};
// 	const key = {
// 		tid: parseInt(req.body.tid),
// 		type: "session"
// 	}
// 	if (req.body.topic) {
// 		payload.topic = req.body.topic;
// 	}
// 	if (req.body.schedule) {
// 		payload.schedule = parseInt(req.body.schedule);
// 	}
// 	helpers.formatApiResponse(200, res, await update(key, payload));
// }


// parentDashboard.updateClassStatus = async function (req, res, next) {
// 	const payload = {
// 		isLive: JSON.parse(req.body.isLive.toLowerCase())
// 	};
// 	const key = {
// 		tid: parseInt(req.params.tid),
// 		type: "session"
// 	}
// 	helpers.formatApiResponse(200, res, await update(key, payload));
// }

// async function update(keys, payload) {
// 	let state = await db.updateFieldWithMultipleKeys(keys, payload);
// 	if (!state) { throw new Error("Unauthorized write access!"); }
// 	return state;
// }
