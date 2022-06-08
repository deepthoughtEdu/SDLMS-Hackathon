'use strict';

const winston = require('winston');
const api = require('../../api');
const registration = require('../registeration');
const categories = require('../../categories');
const helpers = require('../helpers');
const Uploader = require('../FIleUpload');
const User = require('../../user');

const App = module.exports;

App.checkUser = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.checkUsername(req));
};

App.getHome = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getHome(req));
};

App.getUser = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getUserData(req));
};

App.createJoke = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createJoke(req));
};
App.getJoke = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getJoke(req));
};

App.createAnnecdote = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createAnnecdote(req));
};
App.getAnnecdote = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getAnnecdote(req));
};
App.updateAnnecdote = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateAnnecdote(req));
};
App.deleteAnnecdote = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteAnnecdote(req));
};

App.createMascot = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createMascot(req));
};
App.getMascot = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getMascot(req));
};
App.updateMascot = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateMascot(req));
};
App.deleteMascot = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getNudge(req));
};

/**
 * @description CRUD methods for Nudges
 */
App.getNudge = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getNudge(req));
};
App.createNudge = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createNudge(req));
};
App.updateNudge = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateNudge(req));
};
App.deleteNudge = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteNudge(req));
};

/**
 * @description CRUD methods for Events
 */
App.getEvents = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getEvents(req));
};
App.createEvent = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createEvent(req));
};
App.updateEvent = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateEvent(req));
};
App.deleteEvent = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteEvent(req));
};
App.registerEvent = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.eventRegisteration(req, true));
};
App.unregisterEvent = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.eventRegisteration(req, false));
};

/**
 * @description CRUD methods for Posts
 */
App.createPost = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.create_Post(req));
};
App.getPosts = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getPosts(req));
};
App.updatePost = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updatePost(req));
};
App.deletePost = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deletePost(req));
};

// Articles

App.getArticles = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getArticles(req));
};
App.createArticle = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createArticle(req));
};
App.updateArticle = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateArticle(req));
};
App.deleteArticle = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteArticle(req));
};

/**
 * @date 20-05-2022
 * @author imshawan
 * @function getRankList
 * @description Responds the client with the rigor_rank list CSV file
 * @param {Object} req 
 * @param {Object} res 
 */
App.getRankList = async (req, res) => {
	const path = require('path');
	const { baseDir } = require('../../constants').paths;

	const luid = parseInt(req.uid);
	if (!req.uid || luid < 1) {
		throw new Error("Unauthorized");
	}
	const isAdmin = await User.isAdministrator(luid);
	if (!isAdmin) throw new Error("Unauthorized! Only admins has access to rigor_rank");

	await api.appApi.exportRigorRankListAsCSV(req, res);

	res.sendFile('rigorRankList.csv', {
		root: path.join(baseDir, 'build/export'),
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': 'attachment; filename=rigorRankList.csv',
		},
	}, function (err) {
		if (err) {
			if (err.code === 'ENOENT') {
				throw new Error(err.message);
			}
		}
	});
}

App.getRanks = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getRankList(req))
}

App.updateRank = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateRank(req));
};

App.deleteRank = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteRank(req));
};


/**
 * @description CRUD methods for Discussion rooms
 */

App.getDiscussionRoom = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getDiscussionRoom(req));
};
App.createDiscussionRoom = async (req, res) => {
	await api.appApi.createDiscussionRoom(req);
	helpers.formatApiResponse(200, res, await api.appApi.createDiscussionRoom(req));
};
App.updateDiscussionRoom = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateDiscussionRoom(req));
};
App.deleteDiscussionRoom = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteDiscussionRoom(req));
};

/**
 * @description CRUD methods for Tags
 */

App.getTags = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getTag(req));
};
App.createTag = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createTag(req));
};
App.updateTag = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateTag(req));
};
App.deleteTag = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteTag(req));
};
/**
 * @description CRUD methods for a Reflection
 * @author Shubham Bawner
 * @date 7 March 22
 */
App.createReflection = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createReflection(req));
};
App.getReflections = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getReflections(req));
};
App.updateReflection = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateReflection(req));
};
App.deleteReflection = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteReflection(req));
};

/**
 * @description CRUD methods for Saving a particular article/post/nudge and other activities for a particular user
 */
App.save = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.saveItems(req));
};
App.getSavedItems = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getSavedItems(req));
};

App.upload = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.upload(req));
};
App.raiseTicket = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createTicket(req));
};
App.searchTickets = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.searchTickets(req));
};
App.deleteTickets = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteTickets(req));
};

App.getPreferences = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getPreferences(req));
};
App.savePreferences = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.savePreferences(req));
};
// App.removePreferences = async (req, res) => {
// 	helpers.formatApiResponse(200, res, await api.appApi.removePreferences(req))
// }

App.getCategory = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getCategory(req));
};


App.createRoom = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.createRoom(req));
};

App.getRoom = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getRoom(req));
};

App.sendMessage = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.sendMessage(req));
};

App.addUsers = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.addUsers(req));
};

App.removeUsers = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.removeUsers(req));
};

App.deleteMessage = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteMessage(req));
};

App.getMessages = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.getMessages(req));
};

App.loadRoom = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.loadRoom(req));
};

App.updateRoom = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateRoom(req));
};

App.deleteRoom = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.deleteRoom(req))
}

App.changeOwner = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.updateOwner(req))
}
App.uploadFile = async (req, res) => {
	helpers.formatApiResponse(200, res, await api.appApi.uploadFiles(req))
}
