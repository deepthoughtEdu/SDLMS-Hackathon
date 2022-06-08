"use strict";

define("forum/sdlms/assets/threadbuilders/manage", ["sdlms/threadbuilder"], function () {

	var THREADBUILDERS = {};

	

	THREADBUILDERS.init = () => {
		var $tabs = $("#assets li");
	let tb = ajaxify.data.data;
		console.log("THREADBUILDERS.init");
		$tabs.removeClass("active");
		$tabs.filter("[asset-type='tb']").addClass("active");
		let data = {
			meta: tb.meta,
			threads: tb.threads,
			conclusion: tb.conclusion || {},
		};
		new threadBuilder({
			target: '#SDLMSThreadBuilder',
			action: (app.user.uid == (tb.uid || tb.userId)) ? "builder" : 'reader',
			tid: tb.tid || tb.topicId,
			id: tb.pid || tb.id,
			uid: tb.uid || tb.userId,
			with: data,
			addFeedbacks: !true,
			noDraft: true,
			noEvents: true,
			noTracking:true
		});
	};

	return THREADBUILDERS;
})