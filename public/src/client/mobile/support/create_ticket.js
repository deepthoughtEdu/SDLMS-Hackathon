"use strict";

/* globals define */

define("forum/mobile/support/create_ticket", ["api"], function (api) {
	var create_ticket = {};

	create_ticket.init = function () {
		$("body").on("submit", "#create-ticket", function (e) {
			e.preventDefault();

			let formData = new FormData(this);

			var firstName = app.user.fullname.split(" ").slice(0, -1).join(" ");
			var lastName = app.user.fullname.split(" ").slice(-1).join(" ");

			let contact = {
				firstName: firstName,
				lastName: lastName,
				email: app.user.email,
				phone: formData.get("phone"),
			};

			// formData.delete("phone");
			// formData.delete("files[image]");
			formData.append("contact", JSON.stringify(contact));

			let payload = {
				subject: formData.get("subject"),
				contact: contact,
				category: formData.get("category"),
				description: formData.get("description"),
			}

			console.log(...formData);

			// api.post("/app/tickets", formData, null, true).then((res) => {
			// 		console.log("submitted");
			// 		console.log(res);
			// 	}).catch((e) => {
			// 		console.log(e.message);
			// 	});

			api.post(
				`/app/tickets`,
				payload,
				() => {
					console.log("submitted");
				}
			);
		});
	};

	return create_ticket;
});
