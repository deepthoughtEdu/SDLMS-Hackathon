'use strict';

const winston = require('winston');
const helpers = require('./helpers');

const errorController = module.exports;

errorController.log = async function (req, res) {
	// winston.info(JSON.stringify(req.body))
	helpers.formatApiResponse(200, res, { message: 'Logs saved!' });
};
