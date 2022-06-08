"use strict";

/* globals define */

define("forum/mobile/support/authentication", ["api"], function (api) {
	var authentication = {};

	authentication.init = function () {
		$("body").on("submit", "#create-ticket", function (e) {
			e.preventDefault();

			let formData = new FormData(this);

			let contact = {
				firstName: formData.get("firstName"),
				lastName: formData.get("lastName"),
				email: formData.get("email"),
				phone: formData.get("phone"),
			};

			formData.append("contact", JSON.stringify(contact));

			let payload = {
				subject: formData.get("subject"),
				contact: contact,
				category: formData.get("category"),
				description: formData.get("description"),
			} 

			doAjax({
				type: 'POST',
				url: `/app/tickets`,
				method: "POST",
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(payload),
			}).then(function (response) {
				console.log(response);
			})
		});
	};

	return authentication;
});
