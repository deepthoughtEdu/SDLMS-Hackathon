"use strict";

/* globals define */

define("forum/mobile/setting/del", function () {
	var del = {};

	del.init = function () {
		$("button").on("click", (e) => e.preventDefault());
	};

	return del;
});
