'use strict';

/* globals define */

define('forum/mobile/message/request', function () {
	var request = {};

	request.init = function () {
		const dropDown = document.querySelector('#dropdown');
		const dropDownAction = document.querySelectorAll('.dropdown-content__action');
		const dropDownHold = document.querySelectorAll('.dropdown-content__hold');
		const settingsIcon = document.querySelector('.settings-icon');

		const showDropDown = function () {
			dropDown.classList.add('d-flex');
		};
		const hideDropDown = function () {
			dropDown.classList.remove('d-flex');
		};
		if (settingsIcon) {
			const toggleSettings = function (event) {
				if (settingsIcon.contains(event.target)) {
					showDropDown();
				} else {
					hideDropDown();
				}
			};
			window.addEventListener('click', toggleSettings);
		}

		$('.back-icon').on('click', () => window.location.pathname = '/mobile/message/list');
	};

	return request;
});
