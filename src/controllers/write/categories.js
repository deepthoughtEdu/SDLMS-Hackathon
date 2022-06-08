"use strict";

const privileges = require("../../privileges");
const categories = require("../../categories");
const api = require("../../api");

const helpers = require("../helpers");
const winston = require("winston");

const Categories = module.exports;

const hasAdminPrivilege = async (uid) => {
	const ok = await privileges.admin.can(`admin:categories`, uid);
	if (!ok) {
		throw new Error("[[error:no-privileges]]");
	}
};

Categories.get = async (req, res) => {
	helpers.formatApiResponse(
		200,
		res,
		await api.categories.get(req, req.params)
	);
};

Categories.create = async (req, res) => {
	if (req.body.parentCid != 41) {
		await hasAdminPrivilege(req.uid);
	}

	const response = await api.categories.create(req, req.body);
	helpers.formatApiResponse(200, res, response);
};

Categories.update = async (req, res) => {
	await hasAdminPrivilege(req.uid);

	const payload = {};
	payload[req.params.cid] = req.body;
	await api.categories.update(req, payload);
	const categoryObjs = await categories.getCategories([req.params.cid]);
	helpers.formatApiResponse(200, res, categoryObjs[0]);
};

Categories.delete = async (req, res) => {
	var catdata = await categories.getCategoryData(req.params.cid);
	if (catdata.parentCid != 41) {
		await hasAdminPrivilege(req.uid);
	}

	await api.categories.delete(req, { cid: req.params.cid });
	helpers.formatApiResponse(200, res);
};
