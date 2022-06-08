const articleController = module.exports;

articleController.getCreate = async function (req, res, next) {
	res.render("mobile/article/create", {
		title: "Create Article",
		message: "hello this is working",
	});
};

articleController.getView = async function (req, res, next) {
	res.render("mobile/article/view", {
		title: "View Article",
		message: "hello this is working",
	});
};
