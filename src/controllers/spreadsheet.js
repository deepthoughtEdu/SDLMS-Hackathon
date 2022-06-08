const winston = require("winston");
const db = require("../database");
const user = require("../user");
const helpers = require('../controllers/helpers');
const groups = require('../groups');
const privileges = require('../privileges');
const api  = require("../api");
const { length } = require("../cache");

const spreadsheetController = module.exports;

spreadsheetController.get = async function (req, res, next) {
	var spreadsheet={};
	let uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect('/');
	}
    spreadsheet.title='Spreadsheet';
	const sp = await db.findFields({ uid: uid, type: 'spreadsheet'});
	spreadsheet.spreadsheet=sp
	res.render("sdlms/spreadsheet", spreadsheet);
};

