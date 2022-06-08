'use strict';

const winston = require('winston');
const db = require('../database');
const user = require('../user');
const helpers = require('./helpers');
const groups = require('../groups');
const privileges = require('../privileges');

const postClassPageController = module.exports;

postClassPageController.get = async (req, res, next) => {
	const luid = parseInt(req.uid);
	const collectionName = db.collections.DEFAULT;
	if (!req.uid || luid < 1) { throw new Error('Unauthorized'); }
	if (!luid) {
		return res.redirect(`/login`);
	}
	const fields = [
		'uid',
		'username',
		'fullname',
		'userslug',
		'picture',
		'status',
	];
	const postClassPage = {};

	postClassPage.title = 'Post Class';
	var [isTeacher, isStudent] = [false, !false];
	const PAGE = 0;
	const LIMIT = 5;
	const keys = { tid: parseInt(req.params.topicId) };

	var [userData, Sessions, attendance] = await Promise.all([
		user.getUsersFields([req.uid], fields),
		db.findField(collectionName, { ...keys, type: 'session' }),
		db.getFieldsWithPagination(collectionName, { ...keys, type: 'attendance' }, LIMIT, PAGE),
	]);

	if (Sessions && luid) {
		if (!Sessions.attendance) {
			Sessions.attendance = attendance || [];
		}
		if (Sessions.teacher_uid == luid) {
			isStudent = false;
			isTeacher = true;
		}
		if (Sessions.TeachingStyleId) {
			let id = Sessions.TeachingStyleId;
			postClassPage.teaching_style = await db.findField(db.collections.SDLMS.TEACHING_STYLE, { $or: [{TeachingStyleId: id }, {TeachingStyleId: Number(id)}] })
		}
	}

	postClassPage.user = userData;
	postClassPage.isTeacher = isTeacher;
	postClassPage.isStudent = isStudent;
	postClassPage.Sessions = Sessions;
	postClassPage.tracker = Boolean(await db.countDocuments(collectionName, { type: 'eaglebuilder', sessionTracker: true, tid: parseInt(req.params.topicId) }));

	res.render('sdlms/postclass', postClassPage);
};
