'use strict';


define('forum/sdlms/classes', ['api'], function (api) {
	var Sessions = {};
	let $tbody = $('[component="sessions"]').find(".session-table").find("tbody");

	Sessions.init = async function () {

		console.log("[CLASSES] Initializing");

		let sessions = [];
		let classes = [];
		let $modal = $('#CreateSession');
		let processing = 0;
		let scores;
		let highestCategory = 0;
		let highestBatchCategory = 0;

		try {

			scores = await api.get('/sdlms/getsessions?limitBy=10&page=0&type=previous', {});
			let count = Sessions.groupByKeys(scores.data, ['classCategoryId', 'batchCategoryId']);
			highestCategory = count.classCategoryId.sort((a, b) => b.count - a.count)[0]['value'];
			highestBatchCategory = count.batchCategoryId.sort((a, b) => b.count - a.count)[0]['value'];

		} catch (error) {
			console.log(error);
		}

		api.get('/sdlms/getsessions?limitBy=100&page=0&type=upcoming', {}).then((response) => {
			sessions = response.data;
			$('[component="sessions"] .add-row').prop('disabled', false);
			sessions = sessions.filter(e => e.schedule > Date.now());
			$.each(sessions, function (i, e) {
				$tbody.append(Sessions.template('session', e));
			});
			initial();
		});

		api.get('/api/users', {
			paginate: false,
		}).then((response) => {
			let users = response.users;
			$modal.find('#users').empty();
			$.each(users, function (i, e) {
				$modal.find('#users').append(`
				<div class="form-group form-check rendered mb-2 col-6">
					<input type="checkbox" name="members" class="form-check-input custom-sdlms-checkbox" value="${e.uid}" id="student_${e.uid}">
					<label class="form-check-label" for="student_${e.uid}">${e.fullname|| e.displayname || e.username}</label>
				</div>`);
			});
			var options = $modal.find('#users option');
			var arr = options.map(function (_, o) {
				return {
					t: $(o).text(),
					v: o.value
				};
			}).get();
			arr.sort(function (o1, o2) {
				return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
			});
			options.each(function (i, o) {
				o.value = arr[i].v;
				$(o).text(arr[i].t);
			});
		});
		$modal.on('keyup', '#search', function () {
			let search = $(this).val();
			$modal.find('#users .form-check').removeClass('rendered').hide();

			if (!$(this).data('searching')) {
				$(this).data('searching', 1);
				api.get('/api/users', {
					query: search,
					paginate: false,
				}).then((response) => {
					let users = response.users;
					$.each(users, function (i, e) {
						if ($modal.find('#users').find(`#student_${e.uid}`).length) {
							$modal.find('#users').find(`#student_${e.uid}`).parent('.form-check').addClass('.rendered').show();
						} else {
							$modal.find('#users').append(`
							<div class="form-group form-check rendered mb-2  col-6">
								<input type="checkbox" name="members" class="form-check-input custom-sdlms-checkbox" value="${e.uid}" id="student_${e.uid}">
								<label class="form-check-label" for="student_${e.uid}">${e.fullname|| e.displayname || e.username}</label>
						    </div>
							`);
						}

					});
					$(this).data('searching', 0);
				})
			}

		});
		$modal.on('click', '#date-picker', function () {
			let input = $('[name="schedule"]');

			if (input.attr('type') == 'text') {
				input.attr('type', 'datetime-local');
				$(this).html('<i class="fas fa-times"></i>');
				input.prop('readonly', false)
			} else {
				input.attr('type', 'text');
				input.val('Instant')
				$(this).html('<i class="fas fa-calendar-alt"></i>');
				input.prop('readonly', true)
			}
		});
		api.get('/app/category', {}).then((response) => {
			classes = response.filter(e => String(e.categoryType).toLocaleLowerCase() == 'class');
			$.each(classes, function (i, e_) {
				$modal.find('select[name="classCategoryId"]').append(`<option value="${e_.cid}">${e_.name}</option>`);
			});

			$modal.find('select[name="classCategoryId"]').on('change', function () {
				let cid = $(this).val();
				if (!cid) return;
				let $batch = $modal.find('select[name="batchCategoryId"]');
				$batch.html('<option value="">Select Batch</option>');
				$.each(classes.find(e => e.cid == cid).sub_categories, function (i, e_) {
					$batch.append(`<option value="${e_.cid}">${e_.name}</option>`);
				});
				$batch.prop('disabled', false);
				$batch.removeAttr('readonly')
			});

			$modal.find('select[name="classCategoryId"]').val(highestCategory).trigger('change');
			$modal.find('select[name="batchCategoryId"]').val(highestBatchCategory);
		});
		$modal.find('[name="link_expiry"]').val(moment().add(1, 'days').format('YYYY-MM-DDThh:mm'));
		$modal.on('submit', '#createSessionForm', function (e) {
			e.preventDefault();
			let $form = $(this);
			let payload = {};
			var selectedValues = [];

			$("#createSessionForm [name='members']:checked").each(function () {
				if ($(this).val() != '') {
					selectedValues.push(Number($(this).val()));
				}
			});
			payload.classCategoryId = $form.find('select[name="classCategoryId"]').val();
			payload.batchCategoryId = $form.find('select[name="batchCategoryId"]').val();
			payload.topic = $form.find('input[name="topic"]').val();
			payload.teaser = $form.find('input[name="teaser"]').val();
			payload.schedule = $form.find('input[name="schedule"]').val();
			payload.mode = $form.find('input[name="mode"]:checked').val();
			payload.link_expiry = (new Date($form.find('input[name="link_expiry"]').val())).getTime();
			payload.members = JSON.stringify(selectedValues);
			if (payload.schedule == 'Instant') {
				payload.schedule = moment().add(1, 'minutes').valueOf();;
			} else {
				payload.schedule = (new Date(payload.schedule)).getTime();
			}
			if (payload.schedule < Date.now()) {
				return notify('Schedule date should be greater than current date', 'error');
			}
			if(payload.link_expiry < Date.now()) {
				return notify('Link expiry date should be greater than current date', 'error');	
			}
			if(payload.mode == 'restricted' && !selectedValues.length){
				return notify('Please select atleast one member', 'error');
			}
			$(this).find('button[type="submit"]').prop('disabled', true);
			payload.ended_on = moment(payload.schedule).add(1, 'hour').valueOf();
			api.post('/sdlms/monitor', payload).then((response) => {
				if (response.tid) notify('Session created successfully', 'success');
				location.reload();
			}).catch((e) => {
				$form.find('button[type="submit"]').prop('disabled', !true);
			})
		});
		$('body').on('click', '[delete-batch]', function () {
			let $id = $(this).attr('delete-batch');
			let $that = this;
			if ($id && prompt('Type DELETE to delete') == 'DELETE') {
				$(this).find('i').toggleClass('fa-spin fa-trash fa-sync-alt');
				api.del('/sdlms/monitor/' + $id).then((response) => {
					if (response.tid) notify('Session deleted successfully', 'success');
					location.reload();
				}).catch((error) => {
					$that.find('i').toggleClass('fa-spin fa-trash fa-sync-alt');
				})
			}
		});
		$('body').on('click', '[sharer-link]', function (e) {
			let $id = $(this).attr('sharer-link');
			let data = {
				type: 'class',
				id: $id
			}
			let session = sessions.find(e => e.tid == $id);
			session.sharer = session.sharer || {};
			// data.id = session.sharer.id;
			if (session && session.sharer && Date.now() < session.sharer.expireAt) {
				let link = `${window.location.origin}${session.sharer.link}`;
				app.copyText(link);
				e.stopPropagation();
				e.preventDefault();
				return;
			}

			$('#generateLink').off('submit').on('submit', function (e) {
				e.preventDefault();
				let $this = $(this);
				let expireAt = $(this).find('[name="expiry"]').val();
				if (expireAt && expireAt != '' && (expireAt < Date.now())) {
					notify('Expiry date should be greater than current date', 'error');
					return false;
				}
				data.expireAt = (expireAt && expireAt != '') ? ((new Date(expireAt)).getTime()) : undefined;
				$(this).find('button[type="submit"]').prop('disabled', true);
				api.post('/sdlms/sharer', data).then((response) => {
					let link = `${window.location.origin}${response.link}`;
					app.copyText(link);
					setTimeout(() => {
						location.reload();
					}, 1000);
				}).catch((error) => {
					if (error.message) notify(error.message, 'error');
					$this.find('button[type="submit"]').prop('disabled', true);
				});

			});

		})

		function initial() {
			$('[component="sessions"] .session-table tr').editable({
				dropdowns: {},
				edit: function (values) {
					$(".edit i", this)
						.removeClass('fa-pencil')
						.addClass('fa-save')
						.attr('title', 'Save');
					console.log(values);
				},
				save: function (payload) {

					if (!processing) {
						let tid = $(this).data('id');
						payload.schedule = (new Date(payload.schedule)).getTime();
						if (payload.schedule < Date.now()) {
							return notify('Schedule date should be greater than current date', 'error');
						}
						notify('Please wait..', 'info');
						payload.tid = tid;
						processing = 1;
						api.put('/sdlms/monitor', payload).then((response) => {
							console.log(response)
							$(".edit i", this)
								.removeClass('fa-save')
								.addClass('fa-pencil')
								.attr('title', 'Edit');

							if (response.updated) {
								notify('Session updated successfully', 'success');
							}
							processing = 0;
						})
					}


				},
				cancel: function (values) {
					$(".edit i", this)
						.removeClass('fa-save')
						.addClass('fa-pencil')
						.attr('title', 'Edit');
					console.log(values)
				}
			});
		}


	}
	Sessions.groupByKeys = (e, u) => {
		let result = {};
		u.map(u => {
			return result[u] = Object.values(e.reduce((e, t) => {
				let n = t[u];
				return e[n] = e[n] || {
					key: u,
					count: 0,
					value: n
				}, e[n].count += 1, e
			}, {}))
		});
		return result;
	}
	Sessions.template = function (part, data) {
		let components = {
			session: `<tr data-id="${data.tid}">
                <td ><index>${($tbody.find('tr').length + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</index></td>
                <td data-field="topic">${data.topic}</td>
                <td >${data.category}</td>
				<td data-field="schedule" data-value="${moment(data.schedule).format('yyyy-MM-DDThh:mm')}">${moment(data.schedule).format('ddd, DD MMM, YYYY hh:mm A')}</td>
                <td >${data.members.length}</td>
                <td > <a href="javascript:void(0)"><i class="fas fa-link mr-1" data-toggle="modal" data-target="#generateLink" sharer-link="${data.tid}"></i></a> <a class='button edit' title='Edit' ><i class='fa fa-pencil'></i></a> 
                    <a class='button' delete-batch="${data.tid}"  title='Delete'><i class='fa fa-trash'></i></a>
                </td>
             </tr>`
		}

		return components[part];
	}
	return Sessions;
})