"use strict";

const router = require("express").Router();
const middleware = require("../../middleware");
const controllers = require("../../controllers");
const routeHelpers = require("../helpers");

const setupApiRoute = routeHelpers.setupApiRoute;

/**
 * @author imshawan
 * @description This file handles all the API routes that are required for the Article's home to function. 
 */

module.exports = function () {
	const middlewares = [middleware.authenticate];

    setupApiRoute(router, 'put', '/featured/:pid', [...middlewares, middleware.authenticateOrGuest], controllers.articlesApi.addToFeatured);

    return router;
}