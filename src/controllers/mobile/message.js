const messageController = module.exports;

const messaging = require('../../messaging');
const meta = require('../../meta');
const user = require('../../user');
const privileges = require('../../privileges');
const helpers = require('../helpers');

messageController.getList = async function (req, res, next) {


	if (meta.config.disableChat) {
		return next();
	}

	const uid = parseInt(req.uid);
	if (!uid) {
		return next();
	}
	const canChat = await privileges.global.can('chat', req.uid);
	if (!canChat) {
		return next(new Error('[[error:no-privileges]]'));
	}
	const recentChats = await messaging.getRecentChats(req.uid, uid, 0, 19);
	if (!recentChats) {
		return next();
	}

	if (!req.params.roomid) {
		return res.render('mobile/message/list', {
			rooms: recentChats.rooms,
			uid: uid,
			userslug: req.params.userslug,
			nextStart: recentChats.nextStart,
			allowed: true,
			title: '[[pages:chats]]',
		});
	}
	const room = await messaging.loadRoom(req.uid, { uid: uid, roomId: req.params.roomid });
	if (!room) {
		return next();
	}

	room.rooms = recentChats.rooms;
	room.nextStart = recentChats.nextStart;
	room.title = room.roomName || room.usernames || '[[pages:chats]]';
	room.uid = uid;
	room.userslug = req.params.userslug;

	room.canViewInfo = await privileges.global.can('view:users:info', uid);

	res.render('chats', room);
};

messageController.getChat = async function (req, res, next) {
	if (meta.config.disableChat) {
		return next();
	}

	const uid = parseInt(req.uid);
	if (!uid) {
		return next();
	}
	const canChat = await privileges.global.can('chat', req.uid);
	if (!canChat) {
		return next(new Error('[[error:no-privileges]]'));
	}
	const recentChats = await messaging.getRecentChats(req.uid, uid, 0, 19);
	if (!recentChats) {
		return next();
	}

	const room = await messaging.loadRoom(req.uid, { uid: uid, roomId: req.params.roomid });
	if (!room) {
		return next();
	}

	room.rooms = recentChats.rooms;
	room.nextStart = recentChats.nextStart;
	room.title = room.roomName || room.usernames || '[[pages:chats]]';
	room.uid = uid;
	room.userslug = req.params.userslug;

	room.canViewInfo = await privileges.global.can('view:users:info', uid);

	res.render("mobile/message/chat", room);
};

messageController.getRequest = async function (req, res, next) {
	res.render('mobile/message/request', {
		title: 'Event request',
		message: 'hello this is working',
	});
};
