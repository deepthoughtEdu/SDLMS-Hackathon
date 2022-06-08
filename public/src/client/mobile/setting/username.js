"use strict";

/* globals define */

define("forum/mobile/setting/username", function () {
	var username = {};

	username.init = function () {
        $("#back-btn").on("click", () => ajaxify.go("/mobile/setting/account"))

        function userUnavailable() {
            $("#username-check").append("<p class='text-danger font-12'>Username already exists</p>");
            setTimeout(() => $("#username-check").empty(), 3000)
        }

        function passwordMismatch(error) {
            $("#password-check").append(`<p class='text-danger font-12'>${error}</p>`);
            setTimeout(() => $("#password-check").empty(), 3000)
        }

        $("body").on("submit", "form", function(event) {
            event.preventDefault();

            let formData = new FormData(this);
            
            doAjax({
                type: 'GET',
                url: `/app/users?username=${formData.get("username")}`,
                data: {},
            }).then(function (response) {
                if (response.response.userExists)   userUnavailable();
                else {
                    formData.append("uid", app.user.uid);

                    doAjax({
                        type: 'PUT',
                        url: `/users/${formData.get("uid")}`,
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                    }).then(function (res) {
                        console.log("Username changed successfully");
                    }).catch(function (error) {
                        passwordMismatch(error);
                    })
                }
            })
        })
    };

	return username;
});
