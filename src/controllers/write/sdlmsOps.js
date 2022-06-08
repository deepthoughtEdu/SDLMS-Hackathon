'use strict';

const api = require('../../api');
const categories = require('../../categories');
const helpers = require('../helpers');

const sdlms = module.exports;

/**
* @description Eaglebuilder operations (GET, CREATE, UPDATE)
* @key req, res
*/

sdlms.getEB = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.getEagleBuilder(req));
	//res.status(200).json(await api.topics.getEagleBuilderData(req.params));
}

sdlms.createEB = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.createEagleBuilder(req));
}

sdlms.updateEB = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.updateEagleBuilder(req));
}

/**
* @description Get the session trcker - Eaglebuilder
*/

sdlms.sessionTracker = async (req, res) => {

	helpers.formatApiResponse(200, res, await api.sdlms.getSessionTracker(req));
}
sdlms.updateSessionState = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.updateSessionState(req));
}

/**
* @description Threadbuilder operations (GET, CREATE, UPDATE)
* @key req, res
*/

sdlms.getTB = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.getThreadBuilder(req));
}

sdlms.getTB_ByUid = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.getThreadBuilderByUid(req));
}

sdlms.createTB = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.createThreadBuilder(req));
}

sdlms.updateTB = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.updateThreadBuilder(req));
}

/**
* @description Quizzes operations (GET, CREATE, UPDATE)
* @key req, res
*/

sdlms.getQZ = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.getQuiz(req));
}

sdlms.createQZ = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.createQuiz(req));
}

sdlms.updateQZ = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.updateQuiz(req));
}

/**
* @description DELETE the category and also the group associated with that category if the category type is "class"
* @key req, res
*/

sdlms.deleteCategoryWithTypeClass = async (req, res) => {
    const categorydata = await categories.getCategoryData(req.params.cid);

	await api.categories.delete(req, { cid: req.params.cid });
	await api.sdlms.deleteGroupBySlug(req, categorydata.associatedGroup);

	helpers.formatApiResponse(200, res);
};

/**
* @description For joining the class
*/

sdlms.joinClass = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.joinClass(req));
}

sdlms.getAllAssets = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.getAllAssetsBasedOnUser(req));
}
sdlms.markPublic = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.markPublicBasedOnUser(req));
}
/**
 * @author imshawan
 * @description Feedback API controllers for managing feedbacks based on profile, assets, sessions
 * @param {object} req 
 * @param {object} res 
 */
sdlms.getFeedbacks = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.getFeedbackData(req));
}

sdlms.createFeedback = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.createFeedback(req));
}

sdlms.updateFeedback = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.updateFeedback(req));
}

sdlms.deleteFeedback = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.deleteFeedback(req));
}
/**
 * @author imshawan
 * @description Voting API controllers for voting on feedbacks
 * @param {object} req 
 * @param {object} res 
 */
sdlms.vote = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.vote(req));
}
/**
 * @date 14-02-2022
 * @function getSessions
 * @description Gets the lists of session in a pagination order
 * @param {Object} req 
 * @param {Object} res 
 */
sdlms.getSessions = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.getSessions(req));
}


sdlms.getBatches = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.getBatches(req));
}
sdlms.createBatch = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.createBatch(req));
}
sdlms.updateBatch = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.updateBatch(req));
}
sdlms.deleteBatch = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.deleteBatch(req));
}

sdlms.getShareLink = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.getShareLink(req));
}

/**
 * @author imshawan
 * @date 30-02-2022
 * @description CRUD methods for SpreadSheet
 */

sdlms.getSpreadSheets = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.getSpreadSheets(req));
}

sdlms.createSpreadSheet = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.createSpreadSheet(req));
}

sdlms.updateSpreadSheet = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.updateSpreadSheet(req));
}

sdlms.deleteSpreadSheet = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.sdlms.deleteSpreadSheet(req));
}

sdlms.getAttendance = async (req, res) => { 
	helpers.formatApiResponse(200, res, await api.sdlms.getAttendance(req));
}
 

/**
 * @author Shubham Bawner
 * @date 4/26/22
 * @description CRUD methods for comment
 */


sdlms.getComments = async (req, res) => { 
	 helpers.formatApiResponse(200, res, await api.sdlms.getComments(req));
 }
 sdlms.createComment = async (req, res) => { 
	 helpers.formatApiResponse(200, res, await api.sdlms.comment(req));
 }
 sdlms.updateComment = async (req, res) => { 
	 helpers.formatApiResponse(200, res, await api.sdlms.editComment(req));
 }
 sdlms.deleteComment = async (req, res) => { 
	 helpers.formatApiResponse(200, res, await api.sdlms.deleteComment(req));
 }