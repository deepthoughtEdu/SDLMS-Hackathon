'use strict';

const router = require('express').Router();
const middleware = require('../../middleware');
const controllers = require('../../controllers');
const routeHelpers = require('../helpers');

const setupApiRoute = routeHelpers.setupApiRoute;

/**
 * @author imshawan
 * @description This file handles all the custom routes that are required for the Mobile App to function.
 */

module.exports = function () {
	const middlewares = [middleware.authenticate];
	var multipart = require('connect-multiparty');
	var multipartMiddleware = multipart();
	const fileUpload_middlewares = [middleware.maintenanceMode, multipartMiddleware];

	setupApiRoute(router, 'get', '/users', [], controllers.write.app.checkUser)

	setupApiRoute(router, 'get', '/rigorrank', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.getRanks)
	setupApiRoute(router, 'get', '/csv/rigorrank', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.getRankList)
	setupApiRoute(router, 'put', '/rigorrank', [...middlewares, middleware.authenticateOrGuest, fileUpload_middlewares], controllers.write.app.updateRank)
	setupApiRoute(router, 'delete', '/rigorrank', [middleware.authenticateOrGuest], controllers.write.app.deleteRank)

	setupApiRoute(router, 'put', '/rank', [middleware.authenticateOrGuest], controllers.write.app.updateRank);
	setupApiRoute(router, 'delete', '/rank', [middleware.authenticateOrGuest], controllers.write.app.deleteRank);

	setupApiRoute(router, 'post', '/reset', [], controllers.otp.sendOtp);
	setupApiRoute(router, 'post', '/verify', [], controllers.otp.verifyOtp);
	setupApiRoute(router, 'post', '/resetpassword', [], controllers.otp.resetPassword);

	setupApiRoute(router, 'get', '/user', [middleware.authenticateOrGuest], controllers.write.app.getUser);
	setupApiRoute(router, 'get', '/home', [middleware.authenticateOrGuest], controllers.write.app.getHome);

	setupApiRoute(router, 'get', '/joke', [], controllers.write.app.getJoke);
	setupApiRoute(router, 'post', '/joke', [], controllers.write.app.createJoke);

	setupApiRoute(router, 'get', '/annecdote', [middleware.authenticateOrGuest], controllers.write.app.getAnnecdote)
	setupApiRoute(router, 'post', '/annecdote', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ["title", "content", "author_uid"])], controllers.write.app.createAnnecdote)
	setupApiRoute(router, 'put', '/annecdote/:tid', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.updateAnnecdote)
	setupApiRoute(router, 'delete', '/annecdote/:tid', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.deleteAnnecdote)

	// setupApiRoute(router, 'get', '/nudge', [middleware.authenticateOrGuest], controllers.write.app.getNudge)
	setupApiRoute(router, 'post', '/getnudge', [middleware.authenticateOrGuest], controllers.write.app.getNudge);
	setupApiRoute(router, 'post', '/nudge', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest, middleware.checkRequiredFiles.bind(null, ['image', 'favicon']),
	middleware.checkRequired.bind(null, ['asset_type', 'assetId', 'title', 'schedule', 'end_time', 'description', 'invitation_text'])], controllers.write.app.createNudge);
	setupApiRoute(router, 'put', '/nudge/:id', [...middlewares, middleware.authenticateOrGuest, fileUpload_middlewares], controllers.write.app.updateNudge);
	setupApiRoute(router, 'delete', '/nudge/:id', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.deleteNudge);

	setupApiRoute(router, 'get', '/mascot', [middleware.authenticateOrGuest], controllers.write.app.getMascot);
	setupApiRoute(router, 'post', '/register/mascot', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['email', 'username', 'password', 'personality_traits', 'favourite_authors', 'favourite_movies', 'followed']), middleware.checkRequiredFiles.bind(null, ['picture'])], controllers.write.app.createMascot);
	setupApiRoute(router, 'put', '/mascot/:uid', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.updateMascot);
	setupApiRoute(router, 'delete', '/mascot/:uid', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.deleteMascot);

	// setupApiRoute(router, 'get', '/events', [middleware.authenticateOrGuest], controllers.write.app.getEvents)
	setupApiRoute(router, 'post', '/getevents', [middleware.authenticateOrGuest], controllers.write.app.getEvents);
	setupApiRoute(router, 'post', '/events', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['category', 'sub_category']), middleware.checkRequiredFiles.bind(null, ['image'])], controllers.write.app.createEvent);
	setupApiRoute(router, 'put', '/events/:tid', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.updateEvent);
	setupApiRoute(router, 'delete', '/events/:tid', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.deleteEvent);
	setupApiRoute(router, 'put', '/events/register/:id', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.registerEvent);
	setupApiRoute(router, 'put', '/events/unregister/:id', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.unregisterEvent);

	// setupApiRoute(router, 'get', '/posts', [middleware.authenticateOrGuest], controllers.write.app.getPosts)
	setupApiRoute(router, 'post', '/getposts', [middleware.authenticateOrGuest], controllers.write.app.getPosts);
	setupApiRoute(router, 'post', '/posts', [...middlewares, middleware.authenticateOrGuest, fileUpload_middlewares, middleware.checkRequired.bind(null, ['cid', 'content', 'attachment_id']), middleware.checkRequiredFiles.bind(null, ['image'])], controllers.write.app.createPost);
	setupApiRoute(router, 'put', '/posts/:tid', [...middlewares, middleware.authenticateOrGuest, fileUpload_middlewares], controllers.write.app.updatePost);
	setupApiRoute(router, 'delete', '/posts/:tid', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.deletePost);

	// setupApiRoute(router, 'get', '/articles', [middleware.authenticateOrGuest], controllers.write.app.getArticles)
	setupApiRoute(router, 'post', '/getarticles', [middleware.authenticateOrGuest], controllers.write.app.getArticles)
	setupApiRoute(router, 'post', '/articles', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.createArticle)
	setupApiRoute(router, 'put', '/articles/:pid', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.updateArticle)
	setupApiRoute(router, 'delete', '/articles/:pid', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.deleteArticle)

	// setupApiRoute(router, 'get', '/discussion_room', [...middlewares], controllers.write.app.getDiscussionRoom)
	setupApiRoute(router, 'post', '/getdiscussion_room', [...middlewares], controllers.write.app.getDiscussionRoom);
	setupApiRoute(router, 'post', '/discussion_room', [...middlewares, middleware.authenticateOrGuest, fileUpload_middlewares], controllers.write.app.createDiscussionRoom);
	setupApiRoute(router, 'put', '/discussion_room/:tid', [...middlewares, fileUpload_middlewares], controllers.write.app.updateDiscussionRoom);
	setupApiRoute(router, 'delete', '/discussion_room/:tid', [...middlewares], controllers.write.app.deleteDiscussionRoom);

	setupApiRoute(router, 'get', '/tag', [middleware.authenticateOrGuest], controllers.write.app.getTags);
	setupApiRoute(router, 'post', '/tag', [...middlewares, middleware.checkRequired.bind(null, ['tag'])], controllers.write.app.createTag);
	setupApiRoute(router, 'put', '/tag/:tag', [...middlewares], controllers.write.app.updateTag);
	setupApiRoute(router, 'delete', '/tag/:tag', [...middlewares], controllers.write.app.deleteTag);

	setupApiRoute(router, 'get', '/reflections', [middleware.authenticateOrGuest], controllers.write.app.getReflections);
	setupApiRoute(router, 'post', '/reflections', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.createReflection); // to check iff the parameters are passed, we need to verify iff some parameters are there , by: middleware.checkRequired.bind(null, ["cid", "content", "attachment_id"])
	setupApiRoute(router, 'put', '/reflections/:tid', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.updateReflection);
	setupApiRoute(router, 'delete', '/reflections/:tid', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.deleteReflection);

	setupApiRoute(router, 'post', '/save/:item_name', [...middlewares, middleware.authenticateOrGuest, middleware.checkRequired.bind(null, ['id'])], controllers.write.app.save);
	setupApiRoute(router, 'get', '/saved/:item_name', [middleware.authenticateOrGuest], controllers.write.app.getSavedItems);

	setupApiRoute(router, 'post', '/tickets', [middleware.checkRequired.bind(null, ['subject', 'contact', 'category', 'description'])], controllers.write.app.raiseTicket);
	setupApiRoute(router, 'get', '/tickets', [], controllers.write.app.searchTickets);
	setupApiRoute(router, 'post', '/tickets', [], controllers.write.app.deleteTickets);

	setupApiRoute(router, 'get', '/preferences', [middleware.authenticateOrGuest], controllers.write.app.getPreferences);
	setupApiRoute(router, 'put', '/preferences', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.savePreferences);
	// setupApiRoute(router, 'delete', '/preferences', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.removePreferences)
	// setupApiRoute(router, 'put', '/preferences', [...middlewares, middleware.authenticateOrGuest], controllers.write.app.savePreferences)

	setupApiRoute(router, 'get', '/category', [middleware.authenticateOrGuest], controllers.write.app.getCategory);
	setupApiRoute(router, 'post', '/upload/:id', [fileUpload_middlewares], controllers.write.app.upload);

	setupApiRoute(router, 'post', '/createroom', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.createRoom);
	setupApiRoute(router, 'post', '/getroom', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.getRoom);
	setupApiRoute(router, 'post', '/sendmessage', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.sendMessage);
	setupApiRoute(router, 'post', '/adduser', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.addUsers);
	setupApiRoute(router, 'post', '/removeuser', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.removeUsers);
	setupApiRoute(router, 'post', '/deletemessage', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.deleteMessage);
	setupApiRoute(router, 'post', '/getmessages', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.getMessages);
	setupApiRoute(router, 'post', '/loadroom', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.loadRoom);
	setupApiRoute(router, 'put', '/room/:roomId', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.updateRoom);
	setupApiRoute(router, 'delete', '/room/:roomId', [middleware.authenticateOrGuest], controllers.write.app.deleteRoom);

	setupApiRoute(router, 'post', '/createroom', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.createRoom)
	setupApiRoute(router, 'post', '/getroom', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.getRoom)
	setupApiRoute(router, 'post', '/sendmessage', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.sendMessage)
	setupApiRoute(router, 'post', '/adduser', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.addUsers)
	setupApiRoute(router, 'post', '/removeuser', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.removeUsers)
	setupApiRoute(router, 'post', '/deletemessage', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.deleteMessage)
	setupApiRoute(router, 'post', '/getmessages', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.getMessages)
	setupApiRoute(router, 'post', '/loadroom', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.loadRoom)
	setupApiRoute(router, 'put', '/room/:roomId', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.updateRoom)
	setupApiRoute(router, 'delete', '/room/:roomId', [middleware.authenticateOrGuest], controllers.write.app.deleteRoom)
	setupApiRoute(router, 'post', '/changeowner', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.changeOwner)

	setupApiRoute(router, 'post', '/uploadfile', [...middlewares, fileUpload_middlewares, middleware.authenticateOrGuest], controllers.write.app.uploadFile)



	return router;
};
