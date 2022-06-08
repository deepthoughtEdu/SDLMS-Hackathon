"use strict";

const winston = require("winston");
const db = require("../../database");
const user = require("../../user");
const helpers = require('../helpers');
const groups = require('../../groups');
const privileges = require('../../privileges');
const paymentsAPI = require('../../api/payments.api');

const home_page = module.exports;

home_page.get = async function (req, res, next) {
    const uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect(`/login`);
	}
    var home_page = {};


    home_page.title = 'Home Page';

	[home_page.cocredOrders, home_page.moduleOrders, home_page.cocredDetail,home_page.allCocredProducts,home_page.priceList, home_page.user] = await Promise.all([
		paymentsAPI.getUserInfo.cocredOrders(req),
		paymentsAPI.getUserInfo.modulePurchases(req),
		paymentsAPI.getUserInfo.cocredDetails(req),
		paymentsAPI.marketPlace.getAllCocredProducts(req),
		paymentsAPI.marketPlace.getAllPriceLists(req),
		user.getUserFields([uid],['picture','username','fullname'])
	])

    
    res.render('sdlms/payments_pages/home_page', home_page);
};