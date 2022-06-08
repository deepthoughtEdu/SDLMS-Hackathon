"use strict";

define("forum/sdlms/assets/articles/manage", [
	"api", "sdlms/article",
	'https://cdn.tiny.cloud/1/edmnvohc18gntwb9upy6g9m8s1u0blu4kqij2acxxdgghk1r/tinymce/6/tinymce.min.js', 
	'https://cdn.jsdelivr.net/npm/@tinymce/tinymce-jquery@1/dist/tinymce-jquery.min.js'
], function (api) {

	var ARTICLES = {};


	ARTICLES.init = () => {
		var $tabs = $("#assets li");
        console.log("ARTICLES.manage");

		$tabs.removeClass("active");
		$tabs.filter("[asset-type='arc']").addClass("active");
		const articleData = ajaxify.data.data;

		new Article({
			uid: app.user ? app.user.uid : 0,
			target: '#SDLMSArticle',
			tid: articleData.tid,
			with: articleData,
			richTextMenubar: true,
			action: (app.user.uid == articleData.uid) ? 'builder' : 'reader'
		});
	};

	return ARTICLES;
})