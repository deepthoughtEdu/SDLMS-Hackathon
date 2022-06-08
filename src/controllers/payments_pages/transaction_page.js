"use strict";

const winston = require("winston");
const db = require("../../database");
const user = require("../../user");
const helpers = require('../helpers');
const groups = require('../../groups');
const privileges = require('../../privileges');
const paymentsAPI = require('../../api/payments.api');

const transaction_page = module.exports;

transaction_page.get = async function (req, res, next) {
    const uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect(`/login`);
	}
    var transaction_page = {};

    transaction_page.title = 'Your Transactions';
    [transaction_page.cocredOrders, transaction_page.moduleOrders, transaction_page.cocredDetail,transaction_page.allCocredProducts,transaction_page.priceList, transaction_page.user] = await Promise.all([
		paymentsAPI.getUserInfo.cocredOrders(req),
		paymentsAPI.getUserInfo.modulePurchases(req),
		paymentsAPI.getUserInfo.cocredDetails(req),
		paymentsAPI.marketPlace.getAllCocredProducts(req),
		paymentsAPI.marketPlace.getAllPriceLists(req),
		user.getUserFields([uid],['picture','username','fullname'])
	])
    res.render('sdlms/payments_pages/transaction_page', transaction_page);
};