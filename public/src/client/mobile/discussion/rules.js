"use strict";

/* globals define */

define("forum/mobile/discussion/rules", function () {
	var rules = {};

	rules.init = function () {
		console.log("new rules function");

		let urlParams = new URLSearchParams(window.location.search),
			roomTid = urlParams.get('tid');

		// appending rules
		doAjax({
			type: 'POST',
			url: "/app/getroom",
			method: "POST",
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				roomId: [roomTid],
			}),
		}).then(function (res) {
			console.log(res);

			$(".dr-title").each((index, titleSpace) => {
				$(titleSpace).text(res.response.name);
			})

			$(".header-img").each((index, imgSpace) => {
				$(imgSpace).attr("src", res.response.image)
			})

			res.response.rules
				.split("\n")
				.map((rule) => $("#rules-list").append(`<li>${rule}</li>`));
		})

		urlParams.has('mod') && $("#edit-rules-btn").removeClass("d-none");

		$("body").on("click", ".back-btn", () => ajaxify.go(`/mobile/discussion/${roomTid}`));

		$("#edit-rules-btn").on("click", () => editRules());

		$("#save-rules-btn").on("click", () => saveRules());

		function editRules() {
			document.querySelector("#rules-list").contentEditable = "true";
			document.querySelector("#rules-list").classList.add("primary-border");
			document.querySelector("#rules-list").classList.add("rounded-10-px");
			document.querySelector("#rules-list").classList.add("p-1");
			document.querySelector("#edit-rules-btn").classList.add("d-none");
			document.querySelector("#save-rules-btn").classList.remove("d-none");
		}

		function saveRules() {
			document.querySelector("#rules-list").contentEditable = "false";
			document.querySelector("#rules-list").classList.remove("primary-border");
			document.querySelector("#rules-list").classList.remove("p-1");
			document.querySelector("#save-rules-btn").classList.add("d-none");
			document.querySelector("#edit-rules-btn").classList.remove("d-none");
		}
	};

	return rules;
});
