const eventsController = module.exports;

eventsController.get = async function (req, res, next) {
	res.render("mobile/events/create", {
		title: "Create Event",
		message: "hello this is working",
	});
};

eventsController.getDetails = async function (req, res, next) {
	res.render("mobile/events/details", {
		title: "Event Details",
		message: "hello this is working",
	});
};

eventsController.getSaved = async function (req, res, next) {
	res.render("mobile/events/saved", {
		title: "Event Saved",
		message: "hello this is working",
	});
};
