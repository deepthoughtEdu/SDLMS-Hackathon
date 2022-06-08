"use strict";

const winston = require("winston");
const db = require("../../database");
const user = require("../../user");
const helpers = require('../helpers');
const groups = require('../../groups');
const privileges = require('../../privileges');
const paymentsAPI = require('../../api/payments.api');

const subscription_page = module.exports;

subscription_page.get = async function (req, res, next) {
    const uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect(`/login`);
	}
    var subscription_page = {};

    subscription_page.title = 'Your Subscriptions';
    [subscription_page.cocredOrders, subscription_page.moduleOrders, subscription_page.cocredDetail,subscription_page.allCocredProducts,subscription_page.priceList, subscription_page.user] = await Promise.all([
		paymentsAPI.getUserInfo.cocredOrders(req),
		paymentsAPI.getUserInfo.modulePurchases(req),
		paymentsAPI.getUserInfo.cocredDetails(req),
		paymentsAPI.marketPlace.getAllCocredProducts(req),
		paymentsAPI.marketPlace.getAllPriceLists(req),
		user.getUserFields([uid],['picture','username','fullname'])
	])
    res.render('sdlms/payments_pages/subscription_page', subscription_page);
};