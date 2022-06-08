'use strict';

const winston = require('winston');
const db = require('../../database');
const User = require('../../user');

const rigorRankController = module.exports;

rigorRankController.get = async function (req, res) {
	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) {
		throw new Error("Unauthorized");
	}
	const isAdmin = await User.isAdministrator(luid);
	if (!isAdmin) throw new Error("Unauthorized! Only admins has access to rigor_rank");
	const collectionName = db.collections.DEFAULT;
	const csvFileFields = ['email','username','uid', 'rigor_rank']; 

	const RigorRank = {}
	RigorRank.title = "Manage rigor ranks";
	/**
	 * @description Checking rss_token because, only a user can have this property. 
	 * The 'rigor_rank' property exists in other documents too, but 'rss_token' is only limited to users
	 */
	let rankedUsers = await db.findFields(collectionName, {rigor_rank: { $exists: true, $ne: null }, joindate: { $exists: true, $ne: null } });
	
	RigorRank.rankedUsers = rankedUsers.map(user => {
		let fields = {}
		csvFileFields.forEach(field => {
			fields[field] = user[field];
		})
		return fields;
	});

	res.render('admin/manage/rigorRank', RigorRank);
};

