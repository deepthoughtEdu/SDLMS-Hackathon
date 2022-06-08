const userProfileController = module.exports;
//const privileges = require('../privileges');
const db = require('../../database');
const user = require('../../user');
const helpers = require('../helpers');
const api = require("../../api")

userProfileController.get = async function (req, res, next) {
    helpers.formatApiResponse(200, res, await api.profilePage.get(req));
};
userProfileController.getAssets = async (req, res) => {
    helpers.formatApiResponse(200, res, await api.profilePage.getAssets(req))
}