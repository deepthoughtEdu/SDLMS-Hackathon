'use strict';


define('forum/login', ['jquery-form'], function () {
	var Login = {};

	Login.init = function () {
		var errorEl = $('#login-error-notify');
		var submitEl = $('#login');
		var formEl = $('#login-form');

		submitEl.on('click', function (e) {
			e.preventDefault();

			if (!$('#username').val() || !$('#password').val()) {
				errorEl.find('p').translateText('[[error:invalid-username-or-password]]');
				errorEl.show();
			} else {
				errorEl.hide();

				if (submitEl.hasClass('disabled')) {
					return;
				}

				submitEl.addClass('disabled');

				$(window).trigger('action:app.login');
				formEl.ajaxSubmit({
					headers: {
						'x-csrf-token': config.csrf_token,
					},
					beforeSend: function () {
						app.flags._login = true;
					},
					success: function (data) {
						$(window).trigger('action:app.loggedIn', data);
						var pathname = utils.urlToLocation(data.next).pathname;
						var params = utils.params({
							url: data.next
						});
						params.loggedin = true;
						var qs = decodeURIComponent($.param(params));
						try {
							/**
							 * @author Deepansu [19-03-2022]
							 * @description Added Redirect to the page after registration from url
							 */
							var queryString = app.getQueryParams();
							// if(qs)
							if (queryString.url) {
								window.location.href = config.relative_path + queryString.url;
							} else {
								window.location.href = config.relative_path + '/monitor';
							}

						} catch (error) {
							window.location.href = config.relative_path + '/monitor';
						}
					},
					error: function (data) {
						if (data.status === 403 && data.responseText === 'Forbidden') {
							window.location.href = config.relative_path + '/login?error=csrf-invalid';
						} else {
							errorEl.find('p').translateText(data.responseText);
							errorEl.show();
							submitEl.removeClass('disabled');

							// Select the entire password if that field has focus
							if ($('#password:focus').length) {
								$('#password').select();
							}
						}
					},
				});
			}
		});

		$('#login-error-notify button').on('click', function (e) {
			e.preventDefault();
			errorEl.hide();
			return false;
		});

		if ($('#content #username').val()) {
			$('#content #password').val('').focus();
		} else {
			$('#content #username').focus();
		}
		$('#content #noscript').val('false');
	};

	return Login;
});