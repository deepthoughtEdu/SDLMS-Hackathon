const discussionRoomController = module.exports;

discussionRoomController.getCreate = async function (req, res, next) {
	res.render("mobile/discussion/create", {
		title: "create discussion room",
		message: "hello this is working",
	});
};

discussionRoomController.getModListMV = async function (req, res, next) {
	res.render("mobile/discussion/modlist_mod", {
		title: "Moderator's list",
		message: "hello this is working",
	});
};

discussionRoomController.getModListPV = async function (req, res, next) {
	res.render("mobile/discussion/modlist", {
		title: "Moderator's list",
		message: "hello this is working",
	});
};

discussionRoomController.getReported = async function (req, res, next) {
	res.render("mobile/discussion/reported", {
		title: "Reported Threads",
		message: "hello this is working",
	});
};

discussionRoomController.getRulesMV = async function (req, res, next) {
	res.render("mobile/discussion/rules_mod", {
		title: "Room rules",
		message: "hello this is working",
	});
};

discussionRoomController.getRulesPV = async function (req, res, next) {
	res.render("mobile/discussion/rules", {
		title: "Room rules",
		message: "hello this is working",
	});
};

discussionRoomController.getViewMV = async function (req, res, next) {
	res.render("mobile/discussion/view_mod", {
		title: "Discussion room",
		message: "hello this is working",
	});
};

discussionRoomController.getViewPV = async function (req, res, next) {
	res.render("mobile/discussion/view", {
		title: "Discussion room",
		message: "hello this is working",
	});
};

discussionRoomController.getSaved = async function (req, res, next) {
	res.render("mobile/discussion/saved", {
		title: "Saved Threads",
		message: "hello this is working",
	});
};

discussionRoomController.getEnter = async function (req, res, next) {
	res.render("mobile/discussion/enter", {
		title: "enter discussion room",
		message: "hello this is working",
	});
};
