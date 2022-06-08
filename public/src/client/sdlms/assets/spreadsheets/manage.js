"use strict";

define("forum/sdlms/assets/spreadsheets/manage", ["sdlms/spreadsheet"], function () {

	var SPREADSHEETS = {};
	
	
	SPREADSHEETS.init = () => {
		var $tabs = $("#assets li");
	    let sp = ajaxify.data.data;
        console.log("SPREADSHEETS.manage");
		$tabs.removeClass("active");
		$tabs.filter("[asset-type='sp']").addClass("active");
		let SPdata = {
			data:sp.data.data,
			readonly: sp.data.readonly,
			widths:sp.data.widths,
			styles:sp.data.styles
		};
		new spreadSheet({
			target: '#SDLMSSpreadSheet',
			action: (app.user.uid == sp.uid) ? "builder" : 'reader',
			tid: (sp.tid || sp.topicId),
			with: SPdata,
			addFeedbacks: !true,
			uid: sp.uid,
			id: sp.pid,
			noDraft: true,
			noEvents: true,
			noTracking:true,
			contextMenu:true
		})
	};

	return SPREADSHEETS;
})