"use strict";

/* globals define */

define("forum/mobile/discussion/rules_mod", function () {
	var rules = {};

	rules.init = function () {
		document
			.querySelector("#edit-rules-btn")
			.addEventListener("click", () => editRules());
		document
			.querySelector("#save-rules-btn")
			.addEventListener("click", () => saveRules());

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
