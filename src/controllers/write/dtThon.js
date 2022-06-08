'use strict';

const api = require('../../api');
const helpers = require('../helpers');

const dtthon = module.exports;

/**
* @description Eaglebuilder operations (GET, CREATE, UPDATE)
* @key req, res
*/

dtthon.createProject = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.createProject(req));
}
dtthon.editProject = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.editProject(req));
}
dtthon.getProjects = async (req, res) => {
	if(req.query.requirments)
	helpers.formatApiResponse(200, res, await api.dtthon.getCustomProjects(req));
	else
	helpers.formatApiResponse(200, res, await api.dtthon.getProjects(req));
	// helpers.formatApiResponse(200, res, await api.dtthon.getProjects(req));
}
dtthon.deleteProject = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.deleteProject(req));
}


dtthon.addTask = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.addTask(req));
}
dtthon.editTask = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.editTask(req));
}
dtthon.deleteTask = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.deleteTask(req));
}



dtthon.addAsset = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.addAsset(req));
}
dtthon.editAsset = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.editAsset(req));
}
dtthon.deleteAsset = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.deleteAsset(req));
}

dtthon.createSubmission = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.createSubmission(req))
}
dtthon.updateSubmission = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.updateSubmission(req))
}
dtthon.getSubmissions = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.getSubmissions(req))
}
dtthon.submitSubmission = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.submitSubmission(req))
}
dtthon.reviewSubmission = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.reviewSubmission(req))
}


dtthon.submissionInfo = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.submissionInfo(req));
}

dtthon.getSubmissions = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.getSubmissions(req));
}
dtthon.makeSubmission = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.makeSubmission(req));
}
dtthon.reviewSubmission = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.dtthon.reviewSubmission(req));
}