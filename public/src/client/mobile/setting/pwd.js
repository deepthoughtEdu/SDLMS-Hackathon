"use strict";

/* globals define */

define("forum/mobile/setting/pwd", function () {
	var pwd = {};

	pwd.init = function () {
        $("#back-btn").on("click", () => window.location.href = "account")

        $("body").on("submit", "form", function (e) {
			e.preventDefault();

			let formData = new FormData(this);

            if (formData.get("newPassword") == formData.get("confirmpwd")) {
                
                const payload = {
                    "newPassword": formData.get("newPassword"),
                    "currentPassword": formData.get("currentPassword"),
                }

                doAjax({
                    type: "PUT",
                    url: `/users/${app.user.uid}/password`,
                    method: "PUT",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                }).then(function (res) {
                    console.log(res);
                });

            } else {
                $("#match-check").append(`<p class="mb-0 font-12">New password does not match the confirmation, Please Try again</p>`)
            }
        });
    };

	return pwd;
});
