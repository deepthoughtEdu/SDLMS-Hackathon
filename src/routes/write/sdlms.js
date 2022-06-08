'use strict';

const router = require('express').Router();
const middleware = require('../../middleware');
const controllers = require('../../controllers');
const routeHelpers = require('../helpers');

const setupApiRoute = routeHelpers.setupApiRoute;

/**
 * @author imshawan
 * @description This file handles all the custom routes that are required for the SDLMS to function.
 */

module.exports = function () {
	const middlewares = [middleware.authenticate];
	var multipart = require('connect-multiparty');
	var multipartMiddleware = multipart();
	const fileUploadMiddleware = [middleware.maintenanceMode, multipartMiddleware];

	setupApiRoute(router, 'post', '/monitor', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['classCategoryId', 'batchCategoryId', 'schedule', 'members'])], controllers.monitor.create);
	setupApiRoute(router, 'put', '/monitor', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['tid'])], controllers.monitor.update);
	setupApiRoute(router, 'put', '/monitor/:tid', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['isLive'])], controllers.monitor.updateClassStatus);
	setupApiRoute(router, 'delete', '/monitor/:tid', [...middlewares, middleware.authenticateOrGuest], controllers.monitor.deleteSession);

	setupApiRoute(router, 'get', '/getsessions', [middleware.authenticateOrGuest], controllers.write.sdlms.getSessions);
	setupApiRoute(router, 'post', '/sharer', [middleware.authenticateOrGuest], controllers.write.sdlms.getShareLink);

	setupApiRoute(router, 'put', '/sessions/:tid/join', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.joinClass);
	setupApiRoute(router, 'put', '/session/update', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['id', 'state'])], controllers.write.sdlms.updateSessionState);
	setupApiRoute(router, 'get', '/attendance/:tid', [middleware.authenticateOrGuest], controllers.live.getAttendance);
	setupApiRoute(router, 'get', '/members/:tid', [middleware.authenticateOrGuest], controllers.live.getMembers);

	setupApiRoute(router, 'get', '/:tid/eaglebuilder', [middleware.authenticateOrGuest], controllers.write.sdlms.getEB);
	setupApiRoute(router, 'post', '/:tid/eaglebuilder', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['meta', 'tracks'])], controllers.write.sdlms.createEB);
	setupApiRoute(router, 'put', '/:tid/eaglebuilder/:id', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['meta', 'tracks'])], controllers.write.sdlms.updateEB);

	setupApiRoute(router, 'get', '/:tid/tracker', [middleware.authenticateOrGuest], controllers.write.sdlms.sessionTracker);

	setupApiRoute(router, 'get', '/:tid/threadbuilder', [middleware.authenticateOrGuest], controllers.write.sdlms.getTB_ByUid);
	setupApiRoute(router, 'get', '/:tid/threadbuilder/(:id)?', [middleware.authenticateOrGuest], controllers.write.sdlms.getTB);
	setupApiRoute(router, 'post', '/:tid/threadbuilder', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['threads'])], controllers.write.sdlms.createTB);
	setupApiRoute(router, 'put', '/:tid/threadbuilder/:id', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['threads'])], controllers.write.sdlms.updateTB);

	setupApiRoute(router, 'put', '/:tid/public/:id', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.markPublic);

	setupApiRoute(router, 'get', '/:tid/quiz/(:id)?', [middleware.authenticateOrGuest], controllers.write.sdlms.getQZ);
	setupApiRoute(router, 'post', '/:tid/quiz', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['data'])], controllers.write.sdlms.createQZ);
	setupApiRoute(router, 'put', '/:tid/quiz/:id', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['data'])], controllers.write.sdlms.updateQZ);

	setupApiRoute(router, 'get', '/:tid/assets/:uid', [middleware.authenticateOrGuest], controllers.write.sdlms.getAllAssets);

	setupApiRoute(router, 'put', '/groups/:slug/membership/:uid', [...middlewares, middleware.assert.group], controllers.write.groups.join);
	setupApiRoute(router, 'delete', '/groups/:slug/membership/:uid', [...middlewares, middleware.assert.group], controllers.write.groups.leave);

	setupApiRoute(router, 'get', '/reactions', [middleware.authenticateOrGuest], controllers.reaction.getAllReactions);
	setupApiRoute(router, 'get', '/reactions/:tid', [middleware.authenticateOrGuest], controllers.reaction.getReactions);
	setupApiRoute(router, 'put', '/reactions/:tid/:rid', [...middlewares, middleware.authenticateOrGuest], controllers.reaction.react);

	setupApiRoute(router, 'delete', '/categories/:cid', [...middlewares], controllers.write.sdlms.deleteCategoryWithTypeClass);

	setupApiRoute(router, 'get', '/feedbacks', [middleware.authenticateOrGuest], controllers.write.sdlms.getFeedbacks);
	setupApiRoute(router, 'post', '/feedbacks', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.createFeedback);
	setupApiRoute(router, 'put', '/feedbacks/:id', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.updateFeedback);
	setupApiRoute(router, 'delete', '/feedbacks/:id', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.deleteFeedback);

	setupApiRoute(router, 'put', '/feedbacks/:id/vote', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.vote);

	setupApiRoute(router, 'get', '/batch', [middleware.authenticateOrGuest], controllers.write.sdlms.getBatches);
	setupApiRoute(router, 'post', '/batch', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['classCategoryId', 'batchName'])], controllers.write.sdlms.createBatch);
	setupApiRoute(router, 'put', '/batch/:cid', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['batchName'])], controllers.write.sdlms.updateBatch);
	setupApiRoute(router, 'delete', '/batch/:cid', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.deleteBatch);

	setupApiRoute(router, 'get', '/spreadsheet', [middleware.authenticateOrGuest], controllers.write.sdlms.getSpreadSheets);
	setupApiRoute(router, 'post', '/spreadsheet', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['data'])], controllers.write.sdlms.createSpreadSheet);
	setupApiRoute(router, 'put', '/spreadsheet/:pid', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.updateSpreadSheet);
	setupApiRoute(router, 'delete', '/spreadsheet/:pid', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.deleteSpreadSheet);

	setupApiRoute(router, 'get', '/:tid/attendance', [middleware.authenticateOrGuest], controllers.write.sdlms.getAttendance);

	setupApiRoute(router, 'post', '/cohorts', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['name'])], controllers.cohort.createCohort);
	setupApiRoute(router, 'put', '/cohorts/:slug', [multipartMiddleware, ...middlewares, middleware.authenticateOrGuest], controllers.cohort.updateCohort);
	setupApiRoute(router, 'delete', '/cohorts/:name', [...middlewares, middleware.authenticateOrGuest], controllers.cohort.deleteCohort);
	setupApiRoute(router, 'put', '/cohorts/:name/leave', [...middlewares, middleware.authenticateOrGuest], controllers.cohort.removeMembers);

	setupApiRoute(router, 'get', '/comment', [middleware.authenticateOrGuest], controllers.write.sdlms.getComments);
	setupApiRoute(router, 'post', '/comment', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.createComment);
	setupApiRoute(router, 'put', '/comment', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.updateComment);
	setupApiRoute(router, 'delete', '/comment/:pid', [...middlewares, middleware.authenticateOrGuest], controllers.write.sdlms.deleteComment);

	setupApiRoute(router, 'get', '/curriculums', [...middlewares, middleware.authenticateOrGuest], controllers.curriculum.getCurriculums);
	setupApiRoute(router, 'post', '/curriculums', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['name'])], controllers.curriculum.create);
	setupApiRoute(router, 'put', '/curriculums/:id', [...middlewares, middleware.authenticateOrGuest], controllers.curriculum.update);
	setupApiRoute(router, 'delete', '/curriculums/:id', [...middlewares, middleware.authenticateOrGuest], controllers.curriculum.delete);

	setupApiRoute(router, 'post', '/error', [middleware.checkRequired.bind(null, ['errorStack', 'plateform'])], controllers.logger.log);

	setupApiRoute(router, 'get', '/teachingstyles', [...middlewares, middleware.authenticateOrGuest], controllers.teaching_style.getTeachingStyles);
	setupApiRoute(router, 'post', '/teachingstyles', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['name'])], controllers.teaching_style.create);
	setupApiRoute(router, 'put', '/teachingstyles/:id', [...middlewares, middleware.authenticateOrGuest], controllers.teaching_style.update);
	setupApiRoute(router, 'delete', '/teachingstyles/:id', [...middlewares, middleware.authenticateOrGuest], controllers.teaching_style.delete);

	return router;
};
