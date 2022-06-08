"use strict";

define("forum/sdlms/assets/eaglebuilders/manage", ["sdlms/eaglebuilder"], function () {

	var EAGLEBUILDERS = {};
	
	EAGLEBUILDERS.init = () => {

		var $tabs = $("#assets li");
		let eb = ajaxify.data.data;
        console.log("EAGLEBUILDERS.manage");

		$tabs.removeClass("active");
		$tabs.filter("[asset-type='eb']").addClass("active");
		let data = {
			meta: eb.meta,
			tracks: eb.tracks,
			conclusion: eb.conclusion || {},
		};
		
		new eagleBuilder({
			target: '#SDLMSEagleBuilder',
			action:  (app.user.uid == ( eb.uid || eb.userId)) ? "builder" : 'reader',
			tid: eb.tid || eb.topicId,
			id: eb.pid || eb.id,
			with: data,
			addFeedbacks: !true,
			uid: eb.uid || eb.userId,
			noDraft: true,
			noEvents: true,
			noTracking:true
		});
	};

	return EAGLEBUILDERS;
})