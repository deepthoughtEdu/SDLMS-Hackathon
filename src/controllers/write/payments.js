'use strict';

const api = require('../../api');
const helpers = require('../helpers');

const payments = module.exports;



payments.onPaymentCapturedWebhook = async function (req, res) {
	helpers.formatApiResponse(200, res, await api.payments.onPaymentCapturedWebhook(req));
};

payments.onPaymentFailureWebhook = async function (req, res) {
	helpers.formatApiResponse(200, res, await api.payments.onPaymentFailureWebhook(req));
};

payments.generateOrder = async function (req, res) {
	helpers.formatApiResponse(200, res, await api.payments.generateOrder(req));
};

payments.purchaseModule = async function (req, res) {
	helpers.formatApiResponse(200, res, await api.payments.purchaseModule(req));
};
