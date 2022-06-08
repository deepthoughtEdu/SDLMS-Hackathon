"use strict";

const router = require("express").Router();
const middleware = require("../../middleware");
const controllers = require("../../controllers");
const routeHelpers = require("../helpers");
const {
    $createProject,
    $editProject,
    $getProjects,
    $deleteProject,
    $addTask,
    $editTask,
    $deleteTask,
    $addAsset,
    $editAsset,
    $deleteAsset,
    $reviewSubmission,
    $createSubmission,
    $updateSubmission,
    $submitSubmission,
    $getSubmissions
} = require("../../schema/write/dt_thon")

const setupApiRoute = routeHelpers.setupApiRoute;

/**
 * @author Shubham Bawner
 * @description This file handles all the custom routes that are required for the DtThon to function. 
 */

module.exports = function () {
	const middlewares = [middleware.authenticate];
    const {typedFieldValidation} = middleware.typedValidation

    setupApiRoute(router, 'post', '/project', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($createProject)], controllers.write.dtThon.createProject);
    setupApiRoute(router, 'put', '/project', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($editProject)], controllers.write.dtThon.editProject);
    setupApiRoute(router, 'get', '/project', [typedFieldValidation($getProjects)], controllers.dtThon.getProjects);
    setupApiRoute(router, 'delete', '/project', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($deleteProject)], controllers.write.dtThon.deleteProject);
    
    setupApiRoute(router, 'post', '/task', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($addTask)], controllers.write.dtThon.addTask);
    setupApiRoute(router, 'put', '/task', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($editTask)], controllers.write.dtThon.editTask);
    setupApiRoute(router, 'delete', '/task', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($deleteTask)], controllers.write.dtThon.deleteTask);

    setupApiRoute(router, 'post', '/asset', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($addAsset)], controllers.write.dtThon.addAsset);
    setupApiRoute(router, 'put', '/asset', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($editAsset)], controllers.write.dtThon.editAsset);
    setupApiRoute(router, 'delete', '/asset', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($deleteAsset)], controllers.write.dtThon.deleteAsset);
    
    setupApiRoute(router, "post", "/submission", [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($createSubmission)], controllers.write.dtThon.createSubmission)
    setupApiRoute(router, "put", "/submission", [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($updateSubmission)], controllers.write.dtThon.updateSubmission)
    setupApiRoute(router, "get", "/submission", [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($getSubmissions)], controllers.write.dtThon.getSubmissions)
    setupApiRoute(router, "post", "/submit", [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($submitSubmission)], controllers.write.dtThon.submitSubmission)
    setupApiRoute(router, "post", "/review", [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($reviewSubmission)], controllers.write.dtThon.reviewSubmission)
  
    // setupApiRoute(router, 'post', '/submit', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($submissionInfo)], controllers.write.dtThon.submissionInfo);
    // setupApiRoute(router, 'get', '/submit', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($getSubmissions)], controllers.write.dtThon.getSubmissions);
    // setupApiRoute(router, 'put', '/submit', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($makeSubmission)], controllers.write.dtThon.makeSubmission);
    // setupApiRoute(router, 'put', '/review', [...middlewares, middleware.authenticateOrGuest, typedFieldValidation($reviewSubmission)], controllers.write.dtThon.reviewSubmission);

    return router;
}