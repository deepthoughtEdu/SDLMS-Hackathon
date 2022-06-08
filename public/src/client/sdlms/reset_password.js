'use strict';


define('forum/sdlms/reset_password', ['zxcvbn', 'translator'], function (zxcvbn, translator) {
	var ResetCode = {};

	ResetCode.init = function () {
		//var reset_code = ajaxify.data.code;

		var resetEl = $('#reset');
		var otp = $('#otp');
		var password = $('#password');
		var repeat = $('#repeat');

		/**
		 * @author imshawan
		 * @date 25-02-2022
		 * @description Added OTP based password reset
		 */

		resetEl.on('click', function () {
			var strength = zxcvbn(password.val());

			if (!otp.val() && otp.val().length < 6) {
				// $('#notice').removeClass('hidden');
				// $('#notice strong').translateText('Please enter a valid OTP');
				notify('Please enter a valid OTP', 'error');

			} else if (password.val().length < ajaxify.data.minimumPasswordLength) {
				// $('#notice').removeClass('hidden');
				// $('#notice strong').translateText('[[reset_password:password_too_short]]');
				translator.translate('[[reset_password:password_too_short]]').then((msg) => notify(msg, 'error'));
			} else if (password.val().length > 512) {
				// $('#notice').removeClass('hidden');
				// $('#notice strong').translateText('[[error:password-too-long]]');
				translator.translate('[[error:password-too-long]]').then((msg) => notify(msg, 'error'));
			} else if (password.val() !== repeat.val()) {
				// $('#notice').removeClass('hidden');
				// $('#notice strong').translateText('[[reset_password:passwords_do_not_match]]');
				translator.translate('[[reset_password:passwords_do_not_match]]').then((msg) => notify(msg, 'error'));
			} else if (strength.score < ajaxify.data.minimumPasswordStrength) {
				// $('#notice').removeClass('hidden');
				// $('#notice strong').translateText('[[user:weak_password]]');
				translator.translate('[[user:weak_password]]').then((msg) => notify(msg, 'error'));
			} else {
				resetEl.prop('disabled', true).translateHtml('<i class="fa fa-spin fa-refresh"></i> [[reset_password:changing_password]]');
				socket.emit('user.reset.commit', {
					code: otp.val(),
					password: password.val(),
				}, function (err) {
					if (err) {
						ajaxify.refresh();
						// $('#errors').removeClass('hidden');
						// $('#errors strong').translateText(err.message);
						translator.translate(err.message).then((msg) => notify(msg, 'error'));
						return app.alertError(err.message);
					}

					window.location.href = config.relative_path + '/login';
				});
			}
			return false;
		});
	};

	return ResetCode;
});
