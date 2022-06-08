const userProfileController = module.exports;
//const privileges = require('../privileges');
const db = require('../database');
const user = require('../user');
const helpers = require('./helpers');
const Messaging = require('../messaging')

userProfileController.get = async function (req, res, next) {
    helpers.formatApiResponse(200, res, {
		message: 'User Profile page API in progress'
	});
};

userProfileController.isMemberOfRoom = async (req, res, next) => {
	const uid = req.uid;
	const roomIds = await Messaging.getRoomIds()
	const data = await Messaging.isMemberOfRoom(uid, roomIds )
	helpers.formatApiResponse(200, res, data);
}

userProfileController.isInBatch = async (req, res, next) => {
	const uid = parseInt(req.uid);
	const collectionName = db.collections.DEFAULT;
	const key = {
		uid : uid,
		type : 'batch'
	}

	const data = await db.findFields(collectionName, key)
	helpers.formatApiResponse(200, res, data);
}