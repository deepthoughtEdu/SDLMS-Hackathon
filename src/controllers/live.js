'use strict';

const winston = require('winston');
const { session } = require('passport');
const db = require('../database');
const user = require('../user');
const helpers = require('./helpers');
const groups = require('../groups');
const privileges = require('../privileges');
const { sessions } = require('./accounts');
const api = require('../api');

const livePageController = module.exports;

livePageController.get = async function (req, res, next) {
	const collectionName = db.collections.DEFAULT;
	const livePage = {};
	livePage.title = 'Live Class';
	const fields = [
		'uid',
		'username',
		'fullname',
		'userslug',
		'picture',
		'status',
	];
	const PAGE = 0;
	const LIMIT = 5;
	const sharerId = req.url.split('id=')[1] || null;
	const tid = parseInt(req.params.topicId);
	const uid = parseInt(req.uid);

	if (!uid) {
		return res.redirect(`/login`);
	}
	const keys = { tid: tid };
	const [userData, Sessions, attendance] = await Promise.all([
		user.getUsersFields([req.uid], fields),
		// privileges.users.isTeacher(req.uid),
		// privileges.users.isStudent(req.uid),
		db.findFields(collectionName, { ...keys, type: 'session' }),
		db.getFieldsWithPagination(collectionName, { ...keys, type: 'attendance' }, LIMIT, PAGE),
	]);

	livePage.user = userData;
	livePage.Sessions = Sessions.filter(elem => elem.members && (elem.members.includes(uid) || (elem.sharer && elem.sharer.id == sharerId) || elem.teacher_uid == uid) && elem.isLive);

	let [isTeacher, isStudent] = [false, true];

	if (livePage.Sessions.length && req.uid) {
		/**
		 * @date 01-04-2022
		 * @author imshawan
		 * @description Only if a user is registered of the session, or has the shareable link, only than it will
		 * enter this if-else block.
		 *
		 * But still review is required to make sure that the logic is correct.
		 */
		if (livePage.Sessions[0].TeachingStyleId) {
			let id = livePage.Sessions[0].TeachingStyleId;
			livePage.teaching_style = await db.findField(db.collections.SDLMS.TEACHING_STYLE, { $or: [{TeachingStyleId: id }, {TeachingStyleId: Number(id)}] })
		}
		if (!livePage.Sessions[0].attendance) {
			livePage.Sessions[0].attendance = attendance || [];
		}
		if (livePage.Sessions[0].teacher_uid == req.uid) {
			isStudent = false;
			isTeacher = true;
		} else {
			// Record the attendance of users except the teacher of the session
			// Attendance was not being recorded before if the user falls on both teacher and student groups
			await api.sdlms.recordAttendance({ uid, tid });
		}
		// if (livePage.Sessions[0].members && !livePage.Sessions[0].members.includes(req.uid)) {
		// 	await db.update({ ...keys, type: 'session', 'members': { $ne: uid } }, { $push: { 'members': uid } });
		// }
	}
	livePage.isTeacher = isTeacher;
	livePage.isStudent = isStudent;
	livePage.tracker = Boolean(await db.countDocuments(collectionName, { type: 'eaglebuilder', sessionTracker: true, tid: tid }));

	res.render('sdlms/live', livePage);
};

livePageController.getAttendance = async function (req, res, next) {
	const collectionName = db.collections.DEFAULT;
	const key = {
		tid: parseInt(req.params.tid),
		type: 'session',
	};
	var Session = await db.findFields(collectionName, key);
	Session = Session[0];

	helpers.formatApiResponse(200, res, {
		attendance: Session.attendance,
	});
};

livePageController.getMembers = async function (req, res, next) {
	const collectionName = db.collections.DEFAULT;
	const key = {
		tid: parseInt(req.params.tid),
		type: 'session',
	};
	var Session = await db.findFields(collectionName, key);
	Session = Session[0];

	helpers.formatApiResponse(200, res, {
		members: Session.members,
	});
};
