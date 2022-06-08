"use strict";

const router = require("express").Router();
const middleware = require("../../middleware");
const controllers = require("../../controllers");
const routeHelpers = require("../helpers");
const { $getAssets } = require("../../schema/write/profile");

const setupApiRoute = routeHelpers.setupApiRoute;

/**
 * @date 06-05-2022
 * @author imshawan
 * @description This file handles all the custom routes that are required for the SDLMS profile page to function.
 */

module.exports = function () {
	const middlewares = [middleware.authenticate];
	const multipart = require("connect-multiparty");
	const multipartMiddleware = multipart();
	const { typedFieldValidation } = middleware.typedValidation;
	const fileUploadMiddleware = [
		middleware.maintenanceMode,
		multipartMiddleware,
	];

    setupApiRoute(router, 'get', '/', [], controllers.write.userProfile.get);
	setupApiRoute(router, "get", "/assets", [...middlewares, typedFieldValidation($getAssets)], controllers.write.userProfile.getAssets)

    return router;
}
