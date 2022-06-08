"use strict";

define("forum/sdlms/assets/quizes/manage", [
	"api",
], function (api) {

	var QUIZES = {};

	QUIZES.init = () => {
		
	var $tabs = $("#assets li");
        console.log("QUIZES.manage");

		$tabs.removeClass("active");
		$tabs.filter("[asset-type='qz']").addClass("active");
	};

	return QUIZES;
})