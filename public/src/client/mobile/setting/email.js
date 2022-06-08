"use strict";

/* globals define */

define("forum/mobile/setting/email", function () {
	var email = {};

	email.init = function () {
		$("#back-btn").on("click", () => window.location.href = "account")

		$("body").on("submit", "form", function (e) {
			e.preventDefault();

			let formData = new FormData(this);

			formData.append("uid", app.user.uid);

			doAjax({
				type: "PUT",
				url: `/users/${app.user.uid}`,
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
			}).then(function (response) {
				console.log(res);
				// location.reload();
			});
		});
	};

	return email;
});
