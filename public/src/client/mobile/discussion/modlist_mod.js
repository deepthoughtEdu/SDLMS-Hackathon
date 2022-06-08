'use strict';

/* globals define */

define('forum/mobile/discussion_room/modlist', function () {
	var modlist = {};

	modlist.init = function () {
		function modsEditable() {
			const modCards = document.querySelectorAll('.mod-card');
			for (let i = 0; i < modCards.length; i++) {
				modCards[i].querySelector('#send-mod-message').classList.add('d-none');
				modCards[i].querySelector('#view-mod-profile').classList.add('d-none');
				modCards[i].querySelector('#rm-mod').classList.remove('d-none');
			}
		}

		function modsSaved() {
			const modCards = document.querySelectorAll('.mod-card');
			for (let i = 0; i < modCards.length; i++) {
				modCards[i]
					.querySelector('#send-mod-message')
					.classList.remove('d-none');
				modCards[i]
					.querySelector('#view-mod-profile')
					.classList.remove('d-none');
				modCards[i].querySelector('#rm-mod').classList.add('d-none');
			}
		}

		function removeMod(btn) {
			$(btn).parent().parent().addClass('d-none');
		}

		function editMods() {
			$('#edit-mods-btn').addClass('d-none');
			$('#add-mods-btn').removeClass('d-none');
			$('#save-mods-btn').removeClass('d-none');

			modsEditable();
		}

		function saveModsEdit() {
			$('#edit-mods-btn').removeClass('d-none');
			$('#add-mods-btn').addClass('d-none');
			$('#save-mods-btn').addClass('d-none');

			modsSaved();
		}

		function addMods() {
			$('#add-mod-modal').modal('show');
		}

		function cancelAdd() {
			$('#add-mod-modal').modal('hide');
		}

		function selectParticipant() {
			$('.row').on('click', '.col-6', function () {
				$('.row .brand-text').removeClass('brand-text');
				$('.row .font-bold').removeClass('font-bold');
				$(this).addClass('brand-text');
				$(this).addClass('font-bold');
			});
		}
	};

	return modlist;
});
