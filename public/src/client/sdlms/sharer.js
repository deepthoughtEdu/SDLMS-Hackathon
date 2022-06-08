'use strict';



define('forum/sdlms/sharer', [
	'https://cdn.tiny.cloud/1/edmnvohc18gntwb9upy6g9m8s1u0blu4kqij2acxxdgghk1r/tinymce/6/tinymce.min.js', 
	'https://cdn.jsdelivr.net/npm/@tinymce/tinymce-jquery@1/dist/tinymce-jquery.min.js'
], function () {
	var Share = {};

	Share.init = function () {
		let asset = ajaxify.data.data;
		console.log('share init');
		app.eraseCookie('share_redirect');
		if(!asset) return;
		switch (asset.type) {
		case "eaglebuilder":
			require(['sdlms/eaglebuilder'], function () {
				let data = {
					meta: asset.meta,
					tracks: asset.tracks,
					conclusion: asset.conclusion || {},
				};

				new eagleBuilder({
					target: '#sharableAsset',
					action: 'reader',
					tid: asset.tid || asset.topicId,
					id: asset.pid || asset.id,
					with: data,
					addFeedbacks: !true,
					uid: asset.uid || asset.userId
				});
			})
			break;
		case "threadbuilder":
			require(['sdlms/threadbuilder'], function () {
				let data = {
					meta: asset.meta,
					threads: asset.threads,
					conclusion: asset.conclusion || {},
				};
				new threadBuilder({
					target: '#sharableAsset',
					action: 'reader',
					tid: asset.tid || asset.topicId,
					id: asset.pid || asset.id,
					uid: asset.uid || asset.userId,
					with: data,
					addFeedbacks: !true
				});
			})
			break;
		case "spreadsheet":
			require(['sdlms/spreadsheet'], function () {
				let SPdata = {
					data: asset.data.data,
					readonly: asset.data.readonly,
					widths: asset.data.widths,
					styles:asset.data.styles,
				};
				new spreadSheet({
					target: '#SDLMSSpreadSheet',
					action: 'reader',
					tid: (asset.tid || asset.topicId),
					with: SPdata,
					addFeedbacks: !true,
					uid: asset.uid,
					id: asset.pid,
					noEvents: true,
				})
			})
			break;
		case "article":
			require(['sdlms/article'], function () {
				new Article({
					target: '#sdlms-asset-article',
					action: 'reader',
					tid: asset.tid,
					with: { ...asset, user: ajaxify.data.userData },
				})
			})
		default:
			break;
		}
	}
	return Share
})