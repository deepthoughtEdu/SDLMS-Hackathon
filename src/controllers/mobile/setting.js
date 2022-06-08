const settingController = module.exports;

settingController.get = async function (req, res, next) {
	res.render("mobile/setting/index", {
		title: "Create setting",
		message: "hello this is working",
	});
};

settingController.getAccount = async function (req, res, next) {
	res.render("mobile/setting/account", {
		title: "Create setting",
		message: "hello this is working",
	});
};

settingController.getEmail = async function (req, res, next) {
	res.render("mobile/setting/email", {
		title: "Create setting",
		message: "hello this is working",
	});
};

settingController.getPwd = async function (req, res, next) {
	res.render("mobile/setting/pwd", {
		title: "View setting",
		message: "hello this is working",
	});
};

settingController.getDelete = async function (req, res, next) {
	res.render("mobile/setting/del", {
		title: "View setting",
		message: "hello this is working",
	});
};

settingController.getUser = async function (req, res, next) {
	res.render("mobile/setting/username", {
		title: "View setting",
		message: "hello this is working",
	});
};
