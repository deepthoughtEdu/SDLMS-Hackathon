'use strict';


var user = require('../user');
var topics = require('../topics');
var fs = require('fs');

var SocketMeta = {
	rooms: {},
	live: {}
};

SocketMeta.reconnected = function (socket, data, callback) {
	callback = callback || function () {};
	// if (socket.uid) {
	// 	topics.pushUnreadCount(socket.uid);
	// 	user.notifications.pushCount(socket.uid);
	// }
	// if(classes.random.includes(socket.uid)){}else{}
	callback();
};

/* Rooms */

SocketMeta.rooms.enter = function (socket, data, callback) {
	if (!socket.uid) {
		return callback();
	}

	if (!data) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	if (data.enter) {
		data.enter = data.enter.toString();
	}

	if (data.enter && data.enter.startsWith('uid_') && data.enter !== 'uid_' + socket.uid) {
		return callback(new Error('[[error:not-allowed]]'));
	}

	leaveCurrentRoom(socket);

	if (data.enter) {
		socket.join(data.enter);
		socket.currentRoom = data.enter;
	}
	callback();
};

SocketMeta.rooms.leaveCurrent = function (socket, data, callback) {
	if (!socket.uid || !socket.currentRoom) {
		return callback();
	}
	leaveCurrentRoom(socket);
	callback();
};

function leaveCurrentRoom(socket) {
	if (socket.currentRoom) {
		socket.leave(socket.currentRoom);
		socket.currentRoom = '';
	}
}
/** 
 * @author @KRISHNA-git11 
 * @description Registering events on Eagle builder 
 *  */

SocketMeta.live.ebChange = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.ebChange", data)
};
SocketMeta.live.stateChange = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.stateChange", data)
};

SocketMeta.live.ebRefresh = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.ebRefresh", data)
};

SocketMeta.live.react = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.react", data)
};
SocketMeta.live.reaction = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.reaction", data)
};

SocketMeta.live.joined = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.joined", data)
};

SocketMeta.live.stopSession = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.stopSession", data)
}
SocketMeta.live.assetUpdate = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.assetUpdate", data)
}
SocketMeta.live.feedback = function (socket, data, callback) {
	socket.broadcast.emit("meta.live.feedback", data)
}

/**
 * @author imshawan
 * @date 18-02-2022
 * @description This listner logs the events based on key, event name
 * This logs can be retrived by key and event name
 * \n as the separator
 */
SocketMeta.live.track = function (socket, data, callback) {
	try {
		if (!data) return console.log('Invalid data!');
		if (!data.key || !data.event) return console.log(`Invalid key ${data.key} or event ${data.event}`);
		const KEY = data.key;
		const FILE = `logs/${data.event}_${KEY}.txt`;
		const SEPARATOR = 'SDLMS_LOG_SEPARATOR';
		fs.appendFile(FILE, (typeof data.data == 'object' ? JSON.stringify(data.data) : data.data) + SEPARATOR, (err) => {
			if (err) {
				console.log('Event cannot be tracked:: ', err)
			} else {
				console.log('Event tracked:: ', data.event)
			}
		})
		socket.broadcast.emit("meta.live.stats", data)
	

	} catch (err) {
		console.log(err)
	}
}

// SocketMeta.live.track.end = function (socket, data, callback) {
// 	try {
// 		if (!data) return console.log('Invalid data!');
// 		if (!data.key || !data.event) return console.log(`Invalid key ${data.key} or event ${data.event}`);
// 		const KEY = data.key;
// 		const FILE = `logs/${data.event}_${KEY}_end.txt`;
// 		const SEPARATOR = 'SDLMS_LOG_SEPARATOR';
// 		fs.appendFile(FILE, (typeof data.data == 'object' ? JSON.stringify(data.data) : data.data) + SEPARATOR, (err) => {
// 			if (err) {
// 				console.log('Event cannot be tracked:: ', err)
// 			} else {
// 				console.log('Event tracked:: ', data.event)
// 			}
// 		})

		
// 		// fs.readFile(FILE, 'utf8', function (err, data) {
// 		// 	console.log(data)
// 		// 	if (data) {
// 		// 		//get the data in form of json 
// 		// 		//save data in the database (update existing data with this new things)
// 		// 	}
// 		// });


// 	} catch (err) {
// 		console.log(err)
// 	}
// }

// SocketMeta.rooms.ebChange = function (socket, data, callback) {
// 	console.log(data)
// };

module.exports = SocketMeta;