"use strict";

/* globals define */

define("forum/mobile/setting/index", function () {
	var index = {};

	index.init = function () {
		$("#account-settings").on(
			"click",
			() => ajaxify.go("/mobile/setting/account")
		);
	};

	return index;
});
