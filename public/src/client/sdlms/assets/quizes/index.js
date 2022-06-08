"use strict";

define("forum/sdlms/assets/quizes/index", [
	"api",
], function (api) {

	var QUIZES = {};
	var $tabs = $("#assets li");


	QUIZES.init = () => {
        console.log("QUIZES.init");
		$tabs.removeClass("active");
		$tabs.filter("[asset-type='qz']").addClass("active");
	};

	return QUIZES;
})