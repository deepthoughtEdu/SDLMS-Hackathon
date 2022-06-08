const postController = module.exports;

postController.getCreate = async function (req, res, next) {
	res.render("mobile/post/create", {
		title: "Create post",
		message: "hello this is working",
	});
};

postController.getView = async function (req, res, next) {
	res.render("mobile/post/view", {
		title: "View post",
		message: "hello this is working",
	});
};

postController.getSaved = async function (req, res, next) {
	res.render("mobile/post/saved", {
		title: "Saved post",
		message: "hello this is working",
	});
};
