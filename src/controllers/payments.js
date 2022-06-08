"use strict";

const paymentsAPI = require('../api/payments.api.js');

const paymentsController = module.exports;

paymentsController.getRecords = async function (req, res, next) {
	const uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect(`/login`);
	}
    
    var records = {}
	records.cocredOrders = await paymentsAPI.getUserInfo.cocredOrders(req);
	records.moduleOrders = await paymentsAPI.getUserInfo.modulePurchases(req);
	records.cocredDetail = await paymentsAPI.getUserInfo.cocredDetails(req);

	records.allCocredProducts = await paymentsAPI.marketPlace.getAllCocredProducts(req);
	records.priceList = await paymentsAPI.marketPlace.getAllPriceLists(req);
    res.render('payments/paymentsModule',{records})
};