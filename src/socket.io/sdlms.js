'use strict';

const classes = require('../sdlms/classes');
const Sockets = require('.');
const user = require('../user');
const db = require('../database');

var SocketSdlms = {
	class: {
		assets: {
			spreadsheet: {}
		},
		polls:{

		},
		thought:{
			
		}
	},
	monitor: {}
}
SocketSdlms.class.enter = async function (socket, data,callback) {

	let tid = data.tid;
	const userFields = ['username', 'picture', 'fullname', 'uid'];
	const userData = await user.getUserFields(socket.uid, userFields);

	joinClassAndNotify(socket, tid, true, userData);

	return {
		status: "OK"
	}
}
function joinClassAndNotify (socket,tid,notify=false,data={}){

	socket.currentClassRooms = socket.currentClassRooms || [];
	leaveCurrentClassRoom(socket, `class:room:${tid}`);
	socket.join(`class:room:${tid}`);
	socket.currentClassRooms.push(`class:room:${tid}`);
	console.log(`class:room:${tid}:: `, Sockets.getCountInRoom(`class:room:${tid}`));
	if(notify) socket.in(`class:room:${tid}`).emit('event:class.joined', data);
	
}
SocketSdlms.class.start = async function (socket, data,callback) {

	if (!socket.uid) throw new Error('You must be logged in to start a class');
	if (!data) throw new Error('Invalid data');
	if (!data.tid) throw new Error('Invalid tid');

	let tid = data.tid;
	let live = await classes.startClass(tid, socket.uid);

	if (live.status == 'OK') {

		joinClassAndNotify(socket, tid);

		(live.data.members || []).forEach(function (uid) {
			socket.in('uid_' + uid).emit('event:class.started', live.data);
		});
	} else {
		throw new Error(live);
	}
	return {
		status: 'OK',
	};
};

function leaveCurrentClassRoom(socket, classRoom) {
	if ((socket.currentClassRooms || []).findIndex(e => e == classRoom) > -1) {
		socket.leave(classRoom);
		socket.currentClassRooms = socket.currentClassRooms.filter(e => e != classRoom);
	}
}

SocketSdlms.class.join = async function (socket, data,callback) {

	if (!socket.uid) throw new Error('You must be logged in to start a class');
	if (!data) throw new Error('Invalid data');
	if (!data.tid) throw new Error('Invalid tid');

	let tid = data.tid;
	let joined = await classes.joinClass(tid, socket.uid);

	if (joined.status == 'OK') {
		joinClassAndNotify(socket, tid,true,joined.data);
	}

	return {
		status: 'OK',
	};
};
SocketSdlms.class.assets.update = async function (socket, data,callback) {

	if (!socket.uid) throw new Error('You must be logged in to start a class');
	if (!data) throw new Error('Invalid data');
	if (!data.tid) throw new Error('Invalid tid');
	const collectionName = db.collections.DEFAULT;

	let tid = data.tid;

	const payload = {
		$set: { [`stats.${data.asset_type}`]: data.latest },
	};

	await db.updateField(collectionName, { _key: `attendance:${tid}:${socket.uid}` }, payload);

	socket.in(`class:room:${tid}`).emit('event:class.assets.update', data);
}
SocketSdlms.class.assets.spreadsheet.update = function (socket, data, callback) {

	let tid = data.tid;
    socket.in(`class:room:${tid}`).emit('event:spreadsheet.update', data);
};
SocketSdlms.class.thought.selection = async function (socket, data,callback) {

	if (!socket.uid) throw new Error('You must be logged in to start a class');
	if (!data) throw new Error('Invalid data');
	if (!data.tid) throw new Error('Invalid tid');
	if (!data.content) throw new Error('Invalid content');
	if (!data.group) throw new Error('Invalid group');

	let tid = data.tid;
	data.uid = socket.uid;

	let thought = await classes.createThought(data);
	console.log(`class:room:${tid}:: `, Sockets.getCountInRoom(`class:room:${tid}`));
	socket.in(`class:room:${tid}`).emit('event:class.thought.selection', thought);
	
};
SocketSdlms.class.polls.announce = async function (socket, data,callback) {

	if (!socket.uid) throw new Error('You must be logged in to start a class');
	if (!data) throw new Error('Invalid data');
	if (!data.tid) throw new Error('Invalid tid');

	let tid = data.tid;

	let polls = await classes.announcePoll(data);

	socket.in(`class:room:${tid}`).emit('event:class.polls.announce', polls);

};

SocketSdlms.class.thought.get = async function (socket, data,callback) {

	if (!socket.uid) throw new Error('You must be logged in to start a class');
	if (!data) throw new Error('Invalid data');
	if (!data.tid) throw new Error('Invalid tid');
	let thoughts = await classes.getThoughts(data);

	return thoughts;

};
SocketSdlms.class.thought.vote = async function (socket, data,callback) {

	if (!socket.uid) throw new Error('You must be logged in to start a class');
	if (!data) throw new Error('Invalid data');
	if (!data.tid) throw new Error('Invalid tid');
	if (!data.pid) throw new Error('Invalid pid');
	if (!data.group) throw new Error('Invalid group');

	data.uid  = socket.uid;
	let thoughts = await classes.voteForThought(data);

	socket.in(`class:room:${data.tid}`).emit('event:class.thought.vote', thoughts);

};

module.exports = SocketSdlms;
