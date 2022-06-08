'use strict';

/* globals define */

define('forum/mobile/nudge/create', ['api'], function (api) {
	var create = {};

	create.init = function () {
		$('body').on('submit', '#nudgeCreate', function (e) {
			e.preventDefault();

			const formData = new FormData(this);
			console.log(...formData);
			doAjax(
				{
					type: 'POST',
					url: '/app/nudge',
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
				}
			)
				.then(function (res) {
					console.log('created a nudge');
				})
				.catch(function (error) {
					console.log(error);
				});
		});
	};

	return create;
});
