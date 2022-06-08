'use strict';

/* globals define */

define('forum/mobile/profile/view', ['api'], function (api) {
	var view = {};
	view.user = ajaxify.data.user;

	view.init = function () {};
	$('body').find('#profilePicture').attr('src', `${config.relative_path}${view.user.picture || view.user.uploadedpicture}?${Date.now()}`);
	return view;
});
