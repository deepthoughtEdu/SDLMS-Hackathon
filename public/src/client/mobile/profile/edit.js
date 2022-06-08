'use strict';

/* globals define */

define('forum/mobile/profile/edit', ['api'], function (api) {
	var edit = {};
	edit.user = ajaxify.data.user;

	edit.init = function () {
		(() => {
			const $location = document.getElementById('location');

			fetch('https://restcountries.com/v3.1/all')
				.then(response => response.json())
				.then((data) => {
					let str = `<option selected>${app.user.location}</option>`;

					data = data.sort((a, b) => a.name.common.localeCompare(b.name.common)
					);
					data.forEach((country) => {
						str += `<option value="${country.cca3}" >${country.name.common}</option>`;
					});
					$location.innerHTML = str;
				});
		})();

		$('body').find('#profilePicture').attr('src', `${config.relative_path}${edit.user.picture || edit.user.uploadedpicture}?${Date.now()}`);
		$('body').on('submit', '#profileEdit', function (e) {
			e.preventDefault();
			var userInfo = {
				fullname: $('#fullname').val(),
				pronoun: $('#pronoun').val(),
				birthday: $('#birthday').val(),
				location: $('#location').val(),
				social_designation: $('#social_designation').val(),
				signature: $('#signature').val(),
				aboutme: $('#aboutMe').val(),
			};
			doAjax({
				type: 'PUT',
				url: '/users/' + app.user.uid,
				dataType: 'xml/html/script/json',
				contentType: 'application/json',
				data: JSON.stringify(userInfo),
			})
				.then(function (res) {
					console.log('updated the user information', res);
				})
				.catch(function (error) {
					console.log(error);
				}).finally(function () {
	            window.location = '/mobile/profile/view';
				});

			const formData = new FormData(this);
			doAjax(
				{
					type: 'POST',
					url: '/api/user/' + app.user.userslug + '/uploadpicture',
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
					isCustom: true,
				}

			)
				.then(function (res) {
					console.log('updated profile picture');
				})
				.catch(function (error) {
					console.log(error);
				});
		});

		$.each(app.user, function (i, e) {
			$(`[name="${i}"]`).val(e);
		});
	};

	return edit;
});
