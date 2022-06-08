const supportController = module.exports;

supportController.getCreate = async function (req, res, next) {
	res.render("mobile/support/create_ticket", {
		title: "Create ticket",
		message: "hello this is working",
	});
};

supportController.getContact = async function (req, res, next) {
	res.render("mobile/support/authentication", {
		title: "Create ticket",
		message: "hello this is working",
	});
};

supportController.getFAQ = async function (req, res, next) {
	res.render("mobile/support/faq", {
		title: "FAQ",
		message: "hello this is working",
	});
};

supportController.getMyTickets = async function (req, res, next) {
	res.render("mobile/support/my_tickets", {
		title: "My Tickets",
		message: "hello this is working",
	});
};
