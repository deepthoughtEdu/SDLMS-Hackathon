"use strict";

const winston = require("winston");
const db = require("../database");
const helpers = require('../controllers/helpers');
const api = require("../api");

const otpController = module.exports;

otpController.sendOtp = async function (req, res, next) {
	helpers.formatApiResponse(200, res, await api.otpApi.sendOtp(req))
}
otpController.verifyOtp = async function (req, res, next) {
	helpers.formatApiResponse(200, res, await api.otpApi.verifyOtp(req))
}
otpController.resetPassword = async function (req, res, next) {
	helpers.formatApiResponse(200, res, await api.otpApi.resetPassword(req))
}