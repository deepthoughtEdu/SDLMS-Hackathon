"use strict";

/* globals define */

define("forum/mobile/setting/account", function () {
	var account = {};

	account.init = function () {
        console.log("logging from account.js");

        $("#edit-profile").on("click", () => ajaxify.go("/mobile/profile/edit"))
        $("#change-username").on("click", () => ajaxify.go("/mobile/setting/username"))
        $("#change-email").on("click", () => ajaxify.go("/mobile/setting/email"))
        $("#change-pass").on("click", () => ajaxify.go("/mobile/setting/pwd"))
    };

	return account;
});
