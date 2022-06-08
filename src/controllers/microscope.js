const microscopeController = module.exports;
const fs = require('fs').promises;
const db = require('../database');
const users = require('../user');
const utils = require('./utils');


microscopeController.get = async function (req, res, next) {
	let tid =parseInt(req.params.tid);
	let uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect(`/login?share_redirect=true&url=/sharer?id=${req.query.id}`);
	}
	const collectionName = db.collections.DEFAULT;
	var session = await db.findField(collectionName, {
		type: 'session',
		tid: tid,
	});
	console.log(session);
	if (!session) {
		throw new Error('No session found');
	}
	const data = await fs.readFile(`logs/session_tracking_${tid}.txt`, 'utf8');
	const fields = ['uid', 'username', 'fullname', 'userslug', 'picture', 'status'];

	var [reactions, tracker, user] = await Promise.all([db.findField(collectionName, {
		tid: parseInt(tid),
		type: 'reactions',
	}), db.findField(collectionName, {
		topicId: tid,
		type: 'eaglebuilder',
		sessionTracker: true,
	}), users.getUsersFields([req.uid], fields)]);

	let count = ((reactions||{}).reactions || []).reduce((p, c) => {
		if (!p.hasOwnProperty(c.uid)) p[c.uid] = 0;
		p[c.uid]++;
		return p;
	}, {});

	const highestUids = Object.keys(Object.fromEntries(
		Object.entries(Object.keys(count).sort().reduce(
			(obj, key) => {
				obj[key] = count[key];
				return obj;
			}, {}
		)).slice(0, 5)
	)).map(e => Number(e));

	var topReactionStudents = [];
	if (highestUids.length) topReactionStudents = await users.getUsersFields([highestUids], fields);

	var stats = (data.split('SDLMS_LOG_SEPARATOR'));
	stats = stats.filter(e => utils.isJSON(e));
	stats = stats.map(e => JSON.parse(e));

	res.render('sdlms/microscope', {
		title: 'Session Microscope',
		message: 'hello this is working',
		data: {
			tid: tid,
			stats: stats,
			reactions: reactions || {},
			session: session,
			tracker: tracker,
			user: user ? user[0] : null,
			most: {
				reactions: topReactionStudents,
			},
		},
	});
};
