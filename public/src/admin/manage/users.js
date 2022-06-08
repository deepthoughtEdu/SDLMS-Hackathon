'use strict';

define('admin/manage/users', [
	'translator', 'benchpress', 'autocomplete', 'api', 'slugify', 'bootbox', 'accounts/invite',
], function (translator, Benchpress, autocomplete, api, slugify, bootbox, AccountInvite) {
	var Users = {};

	Users.init = function () {
		$('#results-per-page').val(ajaxify.data.resultsPerPage).on('change', function () {
			var query = utils.params();
			query.resultsPerPage = $('#results-per-page').val();
			var qs = buildSearchQuery(query);
			ajaxify.go(window.location.pathname + '?' + qs);
		});

		$('.export-csv').on('click', function () {
			socket.once('event:export-users-csv', function () {
				app.removeAlert('export-users-start');
				app.alert({
					alert_id: 'export-users',
					type: 'success',
					title: '[[global:alert.success]]',
					message: '[[admin/manage/users:export-users-completed]]',
					clickfn: function () {
						window.location.href = config.relative_path + '/api/admin/users/csv';
					},
					timeout: 0,
				});
			});
			socket.emit('admin.user.exportUsersCSV', {}, function (err) {
				if (err) {
					return app.alertError(err);
				}
				app.alert({
					alert_id: 'export-users-start',
					message: '[[admin/manage/users:export-users-started]]',
					timeout: (ajaxify.data.userCount / 5000) * 500,
				});
			});

			return false;
		});

		function getSelectedUids() {
			var uids = [];

			$('.users-table [component="user/select/single"]').each(function () {
				if ($(this).is(':checked')) {
					uids.push($(this).attr('data-uid'));
				}
			});

			return uids;
		}

		function update(className, state) {
			$('.users-table [component="user/select/single"]:checked').parents('.user-row').find(className).each(function () {
				$(this).toggleClass('hidden', !state);
			});
		}

		function unselectAll() {
			$('.users-table [component="user/select/single"]').prop('checked', false);
			$('.users-table [component="user/select/all"]').prop('checked', false);
		}

		function removeRow(uid) {
			const checkboxEl = document.querySelector(`.users-table [component="user/select/single"][data-uid="${uid}"]`);
			if (checkboxEl) {
				const rowEl = checkboxEl.closest('.user-row');
				rowEl.parentNode.removeChild(rowEl);
			}
		}

		// use onSuccess instead
		function done(successMessage, className, flag) {
			return function (err) {
				if (err) {
					return app.alertError(err.message);
				}
				app.alertSuccess(successMessage);
				if (className) {
					update(className, flag);
				}
				unselectAll();
			};
		}

		function onSuccess(successMessage, className, flag) {
			app.alertSuccess(successMessage);
			if (className) {
				update(className, flag);
			}
			unselectAll();
		}

		$('[component="user/select/all"]').on('click', function () {
			$('.users-table [component="user/select/single"]').prop('checked', $(this).is(':checked'));
		});

		$('.manage-groups').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				app.alertError('[[error:no-users-selected]]');
				return false;
			}
			socket.emit('admin.user.loadGroups', uids, function (err, data) {
				if (err) {
					return app.alertError(err);
				}
				Benchpress.render('admin/partials/manage_user_groups', data).then(function (html) {
					var modal = bootbox.dialog({
						message: html,
						title: '[[admin/manage/users:manage-groups]]',
						onEscape: true,
					});
					modal.on('shown.bs.modal', function () {
						autocomplete.group(modal.find('.group-search'), function (ev, ui) {
							var uid = $(ev.target).attr('data-uid');
							api.put('/groups/' + ui.item.group.slug + '/membership/' + uid, undefined).then(() => {
								ui.item.group.nameEscaped = translator.escape(ui.item.group.displayName);
								app.parseAndTranslate('admin/partials/manage_user_groups', { users: [{ groups: [ui.item.group] }] }, function (html) {
									$('[data-uid=' + uid + '] .group-area').append(html.find('.group-area').html());
								});
							}).catch(app.alertError);
						});
					});
					modal.on('click', '.group-area a', function () {
						modal.modal('hide');
					});
					modal.on('click', '.remove-group-icon', function () {
						var groupCard = $(this).parents('[data-group-name]');
						var groupName = groupCard.attr('data-group-name');
						var uid = $(this).parents('[data-uid]').attr('data-uid');
						api.del('/groups/' + slugify(groupName) + '/membership/' + uid).then(() => {
							groupCard.remove();
						}).catch(app.alertError);
						return false;
					});
				});
			});
		});

		$('.ban-user').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				app.alertError('[[error:no-users-selected]]');
				return false;	// specifically to keep the menu open
			}

			bootbox.confirm((uids.length > 1 ? '[[admin/manage/users:alerts.confirm-ban-multi]]' : '[[admin/manage/users:alerts.confirm-ban]]'), function (confirm) {
				if (confirm) {
					Promise.all(uids.map(function (uid) {
						return api.put('/users/' + uid + '/ban');
					})).then(() => {
						onSuccess('[[admin/manage/users:alerts.ban-success]]', '.ban', true);
					}).catch(app.alertError);
				}
			});
		});

		$('.ban-user-temporary').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				app.alertError('[[error:no-users-selected]]');
				return false;	// specifically to keep the menu open
			}

			Benchpress.render('admin/partials/temporary-ban', {}).then(function (html) {
				bootbox.dialog({
					className: 'ban-modal',
					title: '[[user:ban_account]]',
					message: html,
					show: true,
					buttons: {
						close: {
							label: '[[global:close]]',
							className: 'btn-link',
						},
						submit: {
							label: '[[admin/manage/users:alerts.button-ban-x, ' + uids.length + ']]',
							callback: function () {
								var formData = $('.ban-modal form').serializeArray().reduce(function (data, cur) {
									data[cur.name] = cur.value;
									return data;
								}, {});
								var until = formData.length > 0 ? (Date.now() + (formData.length * 1000 * 60 * 60 * (parseInt(formData.unit, 10) ? 24 : 1))) : 0;

								Promise.all(uids.map(function (uid) {
									return api.put('/users/' + uid + '/ban', {
										until: until,
										reason: formData.reason,
									});
								})).then(() => {
									onSuccess('[[admin/manage/users:alerts.ban-success]]', '.ban', true);
								}).catch(app.alertError);
							},
						},
					},
				});
			});
		});

		$('.unban-user').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				app.alertError('[[error:no-users-selected]]');
				return false;	// specifically to keep the menu open
			}

			Promise.all(uids.map(function (uid) {
				return api.del('/users/' + uid + '/ban');
			})).then(() => {
				onSuccess('[[admin/manage/users:alerts.unban-success]]', '.ban', false);
			});
		});

		$('.reset-lockout').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				return;
			}

			socket.emit('admin.user.resetLockouts', uids, done('[[admin/manage/users:alerts.lockout-reset-success]]'));
		});

		$('.validate-email').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				return;
			}

			bootbox.confirm('[[admin/manage/users:alerts.confirm-validate-email]]', function (confirm) {
				if (!confirm) {
					return;
				}
				socket.emit('admin.user.validateEmail', uids, function (err) {
					if (err) {
						return app.alertError(err.message);
					}
					app.alertSuccess('[[admin/manage/users:alerts.validate-email-success]]');
					update('.notvalidated', false);
					update('.validated', true);
					unselectAll();
				});
			});
		});

		$('.send-validation-email').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				return;
			}
			socket.emit('admin.user.sendValidationEmail', uids, function (err) {
				if (err) {
					return app.alertError(err.message);
				}
				app.alertSuccess('[[notifications:email-confirm-sent]]');
			});
		});

		$('.password-reset-email').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				return;
			}

			bootbox.confirm('[[admin/manage/users:alerts.password-reset-confirm]]', function (confirm) {
				if (confirm) {
					socket.emit('admin.user.sendPasswordResetEmail', uids, done('[[notifications:email-confirm-sent]]'));
				}
			});
		});

		$('.force-password-reset').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				return;
			}

			bootbox.confirm('[[admin/manage/users:alerts.confirm-force-password-reset]]', function (confirm) {
				if (confirm) {
					socket.emit('admin.user.forcePasswordReset', uids, done('[[admin/manage/users:alerts.validate-force-password-reset-success]]'));
				}
			});
		});

		$('.delete-user').on('click', () => {
			handleDelete('[[admin/manage/users:alerts.confirm-delete]]', '/account');
		});

		$('.delete-user-content').on('click', () => {
			handleDelete('[[admin/manage/users:alerts.confirm-delete-content]]', '/content');
		});

		$('.delete-user-and-content').on('click', () => {
			handleDelete('[[admin/manage/users:alerts.confirm-purge]]', '');
		});

		$('.teacher').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				app.alertError('[[error:no-users-selected]]');
				return false;	// specifically to keep the menu open
			}

			bootbox.confirm((uids.length > 1 ? 'Assign roles to the selected users?' : 'Assign role to the user?'), function (confirm) {
				if (confirm) {
					Promise.all(uids.map(function (uid) {
						return api.put('/users/' + uid + '/role/teacher');
					})).then(() => {
						onSuccess('The role(s) were assigned successfully!', '.user-role', true);
					}).catch(app.alertError);
				}
			});
		});

		$('.student').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				app.alertError('[[error:no-users-selected]]');
				return false;	// specifically to keep the menu open
			}

			bootbox.confirm((uids.length > 1 ? 'Assign roles to the selected users?' : 'Assign role to the user?'), function (confirm) {
				if (confirm) {
					Promise.all(uids.map(function (uid) {
						return api.put('/users/' + uid + '/role/student');
					})).then(() => {
						onSuccess('The role(s) were assigned successfully!', '.user-role', true);
					}).catch(app.alertError);
				}
			});
		});

		$('.guest').on('click', function () {
			var uids = getSelectedUids();
			if (!uids.length) {
				app.alertError('[[error:no-users-selected]]');
				return false;	// specifically to keep the menu open
			}

			bootbox.confirm((uids.length > 1 ? 'Assign roles to the selected users?' : 'Assign role to the user?'), function (confirm) {
				if (confirm) {
					Promise.all(uids.map(function (uid) {
						return api.put('/users/' + uid + '/role/guest');
					})).then(() => {
						onSuccess('The role(s) were assigned successfully!', '.user-role', true);
					}).catch(app.alertError);
				}
			});
		});

		function handleDelete(confirmMsg, path) {
			var uids = getSelectedUids();
			if (!uids.length) {
				return;
			}

			bootbox.confirm(confirmMsg, function (confirm) {
				if (confirm) {
					Promise.all(uids.map(uid => api.del(`/users/${uid}${path}`, {})
						.then(() => {
							if (path !== '/content') {
								removeRow(uid);
							}
						})
					)).then(() => {
						if (path !== '/content') {
							app.alertSuccess('[[admin/manage/users:alerts.delete-success]]');
						} else {
							app.alertSuccess('[[admin/manage/users:alerts.delete-content-success]]');
						}
						unselectAll();
						if (!$('.users-table [component="user/select/single"]').length) {
							ajaxify.refresh();
						}
					}).catch(app.alertError);
				}
			});
		}

		function handleUserCreate() {
			$('[data-action="create"]').on('click', function () {
				Benchpress.render('admin/partials/create_user_modal', {}).then(function (html) {
					var modal = bootbox.dialog({
						message: html,
						title: '[[admin/manage/users:alerts.create]]',
						onEscape: true,
						buttons: {
							cancel: {
								label: '[[admin/manage/users:alerts.button-cancel]]',
								className: 'btn-link',
							},
							create: {
								label: '[[admin/manage/users:alerts.button-create]]',
								className: 'btn-primary',
								callback: function () {
									createUser.call(this);
									return false;
								},
							},
						},
					});
					modal.on('shown.bs.modal', function () {
						modal.find('#create-user-name').focus();
					});
				});
				return false;
			});
		}

		function createUser() {
			var modal = this;
			var username = document.getElementById('create-user-name').value;
			var email = document.getElementById('create-user-email').value;
			var password = document.getElementById('create-user-password').value;
			var passwordAgain = document.getElementById('create-user-password-again').value;

			var errorEl = $('#create-modal-error');

			if (password !== passwordAgain) {
				return errorEl.translateHtml('[[admin/manage/users:alerts.error-x, [[admin/manage/users:alerts.error-passwords-different]]]]').removeClass('hide');
			}

			var user = {
				username: username,
				email: email,
				password: password,
			};

			api.post('/users', user)
				.then(() => {
					modal.modal('hide');
					modal.on('hidden.bs.modal', function () {
						ajaxify.refresh();
					});
					app.alertSuccess('[[admin/manage/users:alerts.create-success]]');
				})
				.catch(err => errorEl.translateHtml('[[admin/manage/users:alerts.error-x, ' + err.status.message + ']]').removeClass('hidden'));
		}

		handleSearch();
		handleUserCreate();
		handleSort();
		handleFilter();
		AccountInvite.handle();
	};

	function handleSearch() {
		var timeoutId = 0;
		function doSearch() {
			$('.fa-spinner').removeClass('hidden');
			loadSearchPage({
				searchBy: $('#user-search-by').val(),
				query: $('#user-search').val(),
				page: 1,
			});
		}
		$('#user-search').on('keyup', function () {
			if (timeoutId !== 0) {
				clearTimeout(timeoutId);
				timeoutId = 0;
			}
			timeoutId = setTimeout(doSearch, 250);
		});
		$('#user-search-by').on('change', function () {
			doSearch();
		});
	}

	function loadSearchPage(query) {
		var params = utils.params();
		params.searchBy = query.searchBy;
		params.query = query.query;
		params.page = query.page;
		params.sortBy = params.sortBy || 'lastonline';
		var qs = decodeURIComponent($.param(params));
		$.get(config.relative_path + '/api/admin/manage/users?' + qs, renderSearchResults).fail(function (xhrErr) {
			if (xhrErr && xhrErr.responseJSON && xhrErr.responseJSON.error) {
				app.alertError(xhrErr.responseJSON.error);
			}
		});
	}

	function renderSearchResults(data) {
		Benchpress.render('partials/paginator', { pagination: data.pagination }).then(function (html) {
			$('.pagination-container').replaceWith(html);
		});

		app.parseAndTranslate('admin/manage/users', 'users', data, function (html) {
			$('.users-table tbody tr').remove();
			$('.users-table tbody').append(html);
			html.find('.timeago').timeago();
			$('.fa-spinner').addClass('hidden');
			if (!$('#user-search').val()) {
				$('#user-found-notify').addClass('hidden');
				$('#user-notfound-notify').addClass('hidden');
				return;
			}
			if (data && data.users.length === 0) {
				$('#user-notfound-notify').translateHtml('[[admin/manage/users:search.not-found]]')
					.removeClass('hidden');
				$('#user-found-notify').addClass('hidden');
			} else {
				$('#user-found-notify').translateHtml(
					translator.compile('admin/manage/users:alerts.x-users-found', data.matchCount, data.timing)
				).removeClass('hidden');
				$('#user-notfound-notify').addClass('hidden');
			}
		});
	}

	function buildSearchQuery(params) {
		if ($('#user-search').val()) {
			params.query = $('#user-search').val();
			params.searchBy = $('#user-search-by').val();
		} else {
			delete params.query;
			delete params.searchBy;
		}

		return decodeURIComponent($.param(params));
	}

	function handleSort() {
		$('.users-table thead th').on('click', function () {
			var $this = $(this);
			var sortBy = $this.attr('data-sort');
			if (!sortBy) {
				return;
			}
			var params = utils.params();
			params.sortBy = sortBy;
			if (ajaxify.data.sortBy === sortBy) {
				params.sortDirection = ajaxify.data.reverse ? 'asc' : 'desc';
			} else {
				params.sortDirection = 'desc';
			}

			var qs = buildSearchQuery(params);
			ajaxify.go('admin/manage/users?' + qs);
		});
	}

	function getFilters() {
		var filters = [];
		$('#filter-by').find('[data-filter-by]').each(function () {
			if ($(this).find('.fa-check').length) {
				filters.push($(this).attr('data-filter-by'));
			}
		});
		return filters;
	}

	function handleFilter() {
		var currentFilters = getFilters();
		$('#filter-by').on('click', 'li', function () {
			var $this = $(this);
			$this.find('i').toggleClass('fa-check', !$this.find('i').hasClass('fa-check'));
			return false;
		});

		$('#filter-by').on('hidden.bs.dropdown', function () {
			var filters = getFilters();
			var changed = filters.length !== currentFilters.length;
			if (filters.length === currentFilters.length) {
				filters.forEach(function (filter, i) {
					if (filter !== currentFilters[i]) {
						changed = true;
					}
				});
			}
			currentFilters = getFilters();
			if (changed) {
				var params = utils.params();
				params.filters = filters;
				var qs = buildSearchQuery(params);
				ajaxify.go('admin/manage/users?' + qs);
			}
		});
	}

	return Users;
});
