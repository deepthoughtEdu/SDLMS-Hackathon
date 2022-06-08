'use strict';

define('tmb/monitorBoard', ['api', 'sdlms/eaglebuilder', 'sdlms/spreadsheet'], function (api, eb) {
	const $monitorBoard = {};
	if (!ajaxify.data.loggedIn) {
		location.pathname = '/login';
		return;
	}
	$monitorBoard.init = (data) => {
		if (!data.tid) {
			throw new Error('Invalid tid supplied');
		}
		$monitorBoard.data = data;
		$monitorBoard.exists = ajaxify.data.ebMapped;
		var uid = ajaxify.data.user[0].uid;
		$monitorBoard.uid = uid;
		$monitorBoard.create();
		if (!ajaxify.data.Sessions.tid) {
			$('[upcoming-session]').addClass('h-100 w-100 align-items-center justify-content-center').html('No upcoming sessions');
		} else {
			$monitorBoard.renderupcomingClass();
		}

		// Loader
		const checkLoading = setInterval(() => {
			if (($monitorBoard.rfeedbacksLoaded)) {
				app.loader(0);
				clearInterval(checkLoading);
			}
		}, 1000);
		$('[asset-selection-label].active').off('click').on('click', function () {
			$('.assetSelectionDropDown').slideToggle();
			$(this).toggleClass('visibility-shown');
			const $this = $(this);
			$('.assetSelectionDropDown').find('[get-asset]').off('click').on('click', function () {
				$('#studentAssetView').empty().removeClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');
				$('[asset-selection-label]').text(`${$(this).data('type') == 'fr' ? 'Feedback Received' : 'Feedback Given'}`);
				$('[asset-selection-label]').data('fbType', $(this).data('type'));
				$('.assetSelectionDropDown').slideToggle();
				$('.assetSelectionDropDown').find('[get-asset]').removeClass('active');
				$(this).addClass('active');
				// LIVE_CLASS.getAsset($this.data('uid'), $(this).data('type'));
				$(this).data('type') == 'fr' ? $monitorBoard.paginateFeedback(`/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}`, {
					parent: 'sdlms-mb-feedback-section',
				}) : $monitorBoard.paginateFeedback(`/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}&type=given`, {
					parent: 'sdlms-mb-feedback-section',
				});
			});
		});
	};
	$monitorBoard.unique = (prefix = '') => {
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
		});
		return prefix + uuid;
	};
	$monitorBoard.log = (log) => {
		!$monitorBoard.data.log || console.log(log);
	};
	$monitorBoard.renderupcomingClass = () => {
		const session = ajaxify.data.Sessions;
		app.addSessionDetails(session.schedule, 'sdlms-session-schedule', session.ended_on);
		$('.sdlms-container').find('.sdlms-upcoming-session-topic').append(`${session.topic ? session.topic : 'session'}`);
		$('.sdlms-container').find('.sdlms-upcoming-session-sub-category').append(`${session.sub_category ? session.sub_category : 'batch'}`);
		$('.sdlms-container').find('.sdlms-upcoming-session-category').append(`${session.category || 'class'}<br/>by ${session.teacher ? (session.teacher.fullname ? session.teacher.fullname : 'Senior Learner') : 'Senior Learner'}`);
		$('.sdlms-container').find('.sdlms-calender-date').append(`${moment(session.schedule).format('DD')}`);
		$('.sdlms-container').find('.sdlms-calender-month').append(`${moment(session.schedule).format('MMM')}`);


		if (ajaxify.data.isTeacher) {
			$('.sdlms-container').find('.sdlms-edit-session-topic').off('click').on('click', () => {
				$('.sdlms-container').find('.sdlms-upcoming-session-topic').attr('contenteditable', true);
				$('.sdlms-container').find('.sdlms-save-session-topic').css({
					display: 'block',
				});
			});

			$('.sdlms-container').find('.sdlms-save-session-topic').off('click').on('click', function () {
				api.put('/sdlms/monitor', {
					topic: $('.sdlms-upcoming-session-topic').text(),
					tid: session.tid,
					schedule: session.schedule,
				}).then((res) => {
					$('.sdlms-container').find('.sdlms-upcoming-session-topic').attr('contenteditable', false);
					$('.sdlms-container').find('.sdlms-save-session-topic').css({
						display: 'none',
					});
				});
			});
			$monitorBoard.checkClassStart(session, 'sdlms-start-class-button');
		} else {
			$monitorBoard.checkClassStart(session, 'sdlms-join-class-button');
		}

		$('.sdlms-start-class-button').off('click').on('click', function () {
			if ($monitorBoard.exists || (!$monitorBoard.exists && confirm('Tracker is not mapped with this class. Do you want to continue it?'))) {
				socket.emit('sdlms.class.start', {
					classId: session.tid,
				}).then((response) => {
					console.log(response);
				}).catch((error) => {
					notify(error.message, 'error');
				}).finally(() => {
					$(this).removeClass('spintorefresh fa-sync-alt');
				});
			}
		});
		$('.sdlms-join-class-button').off('click').on('click', function () {
			socket.emit('sdlms.class.join', {
				classId: session.tid,
			}).then((response) => {
				console.log(response);
			}).catch((error) => {
				notify(error.message, 'error');
			}).finally(() => {
				$(this).removeClass('spintorefresh fa-sync-alt');
			});
		});
	};
	$monitorBoard.create = () => {
		var b = document.documentElement;
		b.setAttribute('data-useragent', navigator.userAgent);
		b.setAttribute('data-platform', navigator.platform);
		$('.tmb').append(`<div></div>`);
		const $board = $('.tmb');
		$monitorBoard.$board = $board;
		var $that = $monitorBoard;


		$monitorBoard.paginateFeedback(`/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}`, {
			parent: 'sdlms-mb-feedback-section',
		});


		$monitorBoard.paginateSessions('/sdlms/getsessions?limitBy=5&page=0&type=upcoming', {
			parent: 'sdlms-my-upcoming-session-table-body',
		});

		$("[data-type = 'navigation']").off('click').on('click', function () {
			const navigate = $(this).data('navigate') || 0;
			$('body').find('.sdlms-my-upcoming-session-table-body').empty();
			return $monitorBoard.paginateSessions(`/sdlms/getsessions?limitBy=5&page=0&type=${navigate == -1 ? 'previous' : 'upcoming'}`, {
				parent: 'sdlms-my-upcoming-session-table-body',
			});
		});
		$('.sdlms-container').find('.page-navigator').off('click').on('click', function () {
			const url = $(this).data('url');
			if (url) {
				$monitorBoard.paginateSessions(url, {
					parent: 'sdlms-my-upcoming-session-table-body',
				});
			}
			// data-sdlms-type ==> .data("sdlmsType")
		});
		$('.sdlms-container').find('.sessions-page').blur(function () {
			var pos = $('.sdlms-sessions-control').find('[data-type].active').data().navigate;
			$monitorBoard.paginateSessions(`/sdlms/getsessions?limitBy=5&page=${$('.sdlms-container').find('.sessions-page').val() - 1}&type=${pos === 1 ? 'upcoming' : 'previous'}`, {
				parent: 'sdlms-my-upcoming-session-table-body',
			});
		});
		$('.sdlms-container').find('.fb-navigator').off('click').on('click', function () {
			const url = $(this).data('url');
			if (url) {
				$monitorBoard.paginateFeedback(url, {
					parent: 'sdlms-mb-feedback-section',
				});
			}
			// data-sdlms-type ==> .data("sdlmsType")
		});
		$('.sdlms-container').find('.feedbacks-page').blur(function () {
			var pos = $('[asset-selection-label]').data('fbType');
			// &type=${pos == fr ? "recieved" : "previous"}
			$monitorBoard.paginateFeedback(`/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}&limitBy=5&page=${$('.sdlms-container').find('.feedbacks-page').val() - 1}&type=${pos == 'fr' ? 'recieved' : 'given'}`, {
				parent: 'sdlms-mb-feedback-section',
			});
		});

		socket.on('meta.live.stateChange', (data) => {
			if (data.event == 'stop') {
				$('[data-state="upcoming"]').trigger('click');
			}
		});
	};
	$monitorBoard.checkClassStart = (session, className) => {
		if (!session) {
			console.log('No session found against uid:' + ajaxify.data.user[0].uid);
			return false;
		}
		$('.sdlms-container').find(`.${className}`).attr('disabled', false);
		$('.sdlms-container').find(`.sdlms-join-class-button`).attr('disabled', false);
	};
	$monitorBoard.paginateSessions = (url = '/sdlms/getsessions?limitBy=5&page=0&type=upcoming', data = {}) => {
		$('.sdlms-container').find(`.${data.parent}`).empty();
		$('.sdlms-my-upcoming-session-table').addClass('rounded-0');
		api.get(url, {}).then((res) => {
			if (!res.data.length) {
				$('.sdlms-container').find(`.${data.parent}`).html('&nbsp;<div class="absolute-center">No Session</div>');
			}
			const isPrevious = url.includes('previous');
			$('.sdlms-my-upcoming-session-table').removeClass('rounded-0');
			res.data.map((ev, index) => {
				$('.sdlms-container').find(`.${data.parent}`).append(`<tr data-id="${ev.tid}" redirect="${isPrevious ? 'postclass' : ''}" class="sdlms-my-upcoming-session-table-row">
				<td
					class="sdlms-my-upcoming-session-table-Sno font-weight-500 sdlms-text-black-18px">
					${(index + 1 + res.from).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })} </td>
				<td
					class="sdlms-my-upcoming-session-table-Session-topic font-weight-500 sdlms-text-black-18px">
					${ev.topic} </td>
				<td
					class="sdlms-my-upcoming-session-table-date font-weight-500 sdlms-text-black-18px">
					${moment(ev.schedule).format('ddd, DD MMM, YYYY')} <br />
					<span
						class="sdlms-my-upcoming-session-table-time font-weight-500 sdlms-text-black-18px"></span>
					${moment(ev.schedule).format('hh:mm A')}
				</td>
				<td
					class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px">
					${ajaxify.data.isTeacher ? (isPrevious ? '' : `<i   get-session-link="${ev.sharer ? ev.sharer.link : false}" data-expiry="${ev.sharer ? ev.sharer.expireAt : 0}"  data-id="${ev.tid}" class="fas fa-link mr-2"></i> <i data-id="${ev.tid}" start-session-now class="fas mr-2 ${ev.isLive ? 'd-none' : ''} fa-play"></i> <span class="${(ev.isLive || ev.state == 'stop') ? 'd-none' : ''} mr-2" data-id="${ev.tid}" map-eagle-builder>E</span><span class="${(ev.isLive || ev.state == 'stop') ? 'd-none' : ''}" data-id="${ev.tid}" map-spreadsheet-builder>SP</span>`) : ''} ${(ev.isLive && ev.state != 'stop') ? `<i class="fas fa-sign-in-alt" data-id="${ev.tid}" join-now data-href="/live/${ev.tid}"></i>` : ''} </td>
			</tr>`);
			});
			$('.sdlms-container').find('.sessions-page').val(res.current_page + 1);
			$('.sdlms-container').find('.sessions-page-count').text(res.last_page + 1);
			$('.sdlms-container').find('.page-navigator.next').data('url', res.next_page_url);
			$('.sdlms-container').find('.page-navigator.prev').data('url', res.prev_page_url);
			$('[redirect="postclass"]').off('click').on('click', function () {
				const sessionId = $(this).data('id');
				if (sessionId) {
					window.location.href = `/postclass/${sessionId}`;
				}
			});
			$('[get-session-link]').off('click').on('click', '', function () {
				let link = $(this).attr('get-session-link');
				const $this = $(this);
				const expiry = $(this).data('expiry');

				if (link && Date.now() < expiry) {
					link = `${window.location.origin}${link}`;
					app.copyText(link);
					return;
				}
				$(this).addClass('spintorefresh fa-sync-alt');
				api.post('/sdlms/sharer', {
					id: $(this).data('id'),
					type: 'class',
					expireAt: Date.now() + (1000 * 60 * 60 * 24 * 1),
				}).then((response) => {
					const link = `${window.location.origin}${response.link}`;
					$this.attr('get-session-link', response.link);
					$this.attr('data-expiry', response.expireAt);
					app.copyText(link);
				}).catch((error) => {
					if (error.message) notify(error.message, 'error');
				}).finally(() => {
					$this.removeClass('spintorefresh fa-sync-alt');
				});
			});
			$('[start-session-now]:not(.spintorefresh)').off('click').on('click', function () {
				const sessionId = $(this).data('id');
				if ($('[start-session-now].spintorefresh').length) {
					notify('Please wait for the session to start', 'error');
					return false;
				}
				$(this).addClass('spintorefresh fa-sync-alt');
				socket.emit('sdlms.class.start', {
					classId: sessionId,
				}).then((response) => {
					console.log(response);
					window.open(`${location.origin}/live/${sessionId}`, '_blank');
					$('[data-state="upcoming"]').trigger('click');
				}).catch((error) => {
					notify(error.message, 'error');
				}).finally(() => {
					$(this).removeClass('spintorefresh fa-sync-alt');
				});
			});
			$('[join-now]').off('click').on('click', function () {
				const link = $(this).data('href');
				if (ajaxify.data.isTeacher) {
					window.open(link, '_blank');
					return;
				}
				if (ajaxify.data.isStudent) {
					const sessionId = $(this).data('id');

					$(this).addClass('spintorefresh fa-sync-alt');

					socket.emit('sdlms.class.join', {
						classId: sessionId,
					}).then((response) => {
						window.open(link, '_blank');
					}).catch((error) => {
						notify(error.message, 'error');
					}).finally(() => {
						$(this).removeClass('spintorefresh fa-sync-alt');
					});
				}
			});
			$('[map-eagle-builder]').off('click').on('click', function () {
				window.session = $(this).data('id');
				const uid = $monitorBoard.uid;
				const $this = $(this);
				$(this).html('<i class="fas spintorefresh fa-sync-alt"></i>');
				api.get(`/sdlms/${window.session}/tracker`, {}).then((r) => {
					const data = {
						meta: r.meta,
						tracks: r.tracks,
						conclusion: r.conclusion || {},
					};
					new eagleBuilder({
						target: '#sdlms-teacher-eaglebuilder',
						action: 'builder',
						tid: window.session,
						uid: uid,
						id: r.pid || r.id,
						enableDuration: true,
						sessionTracker: true,
						autosave: 6000000,
						noDraft: true,
						with: data,
					});
					$('#information_modal').removeClass('sheet');
					$('#information_modal').modal('show');
					$('#information_modal .modal-content').off('click');
				}).catch((e) => {
					console.log(e);
				}).finally(() => {
					$this.html('E');
				});
			});
			$('[map-spreadsheet-builder]').off('click').on('click', function () {
				window.session = $(this).data('id');
				const uid = $monitorBoard.uid;
				const $this = $(this);
				$(this).html('<i class="fas spintorefresh fa-sync-alt"></i>');
				api.get(`/sdlms/spreadsheet?tid=${window.session}&uid=${uid}`, {}).then((r) => {
					const teacherSP = r;
					teacherSP.data = teacherSP.data || {};

					new spreadSheet({
						target: '#sdlms-teacher-eaglebuilder',
						action: 'builder',
						tid: window.session,
						with: {
							data: teacherSP.data.data,
							readonly: teacherSP.data.readonly || [],
							widths: teacherSP.data.widths || [],
							styles: teacherSP.data.styles,
						},
						addFeedbacks: true,
						uid: uid,
						id: teacherSP.pid,
						topic: 'Live Class',
						reload: true,
						noEvents: true,
						noDraft: true,
						isBrodcaster: ajaxify.data.isTeacher,
						isListener: ajaxify.data.isStudent,
					});
					$('#information_modal').addClass('sheet');
					$('#information_modal').modal('show');
					$('#information_modal .modal-content').off('click').on('click', function (e) {
						if ($(e.target).hasClass('modal-content')) {
							$('#information_modal').modal('hide');
						}
						// $('#information_modal').modal('hide');
					});
				}).catch((e) => {
					console.log(e);
				}).finally(() => {
					$this.html('SP');
				});
			});
		});
	};

	$monitorBoard.paginateFeedback = (url = `/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}`, data = {}) => {
		$('.sdlms-container').find(`.${data.parent}`).empty().removeClass('d-flex justify-content-center align-items-center');
		api.get(url, {}).then((res) => {
			if (!res.data.length) {
				$('.sdlms-container').find(`.${data.parent}`).html('No Feedbacks').addClass('d-flex justify-content-center align-items-center');
			}
			res.data.map((ev) => {
				const user_name = ev.feedback_to && ev.feedback_to.fullname ? ev.feedback_to.fullname : ev.feedback_to.username;
				$('.sdlms-container').find(`.${data.parent}`).append(`
				<li class="d-flex align-items-center">
                                <div class="col-10 d-flex pl-0">
                                    <div class="user-img d-flex align-items-center">
                                        <img src=${ev.feedback_to ? ev.feedback_to.picture : 'https://sdlms.deepthought.education/assets/uploads/files/files/files/default_profile.png'}
                                            alt = ""  onerror="${app.IMG_ERROR()}" />
                                    </div >
					<div class="user-info d-flex flex-column w-100 pl-3">
						<div class="user-name sdlms-text-black-17px text-ellipse font-weight-700">
							${user_name || 'Learner'}
						</div>
						<div class="user-session-info para-ellipse">
							<p class="sdlms-text-tertiary-14px sdlms-font-open-sans text-justify">${ev.content.replaceAll('-_-', ' ')}</p>
						</div>
						<div class="user-for-topic d-flex pt-1 justify-content-between">
							<div class="user-for sdlms-text-tertiary-12px">For: <span
								class="sdlms-sub-text-primary-12px text-capitalize">${ev.feedback_for ? ev.feedback_for : 'SDLMS Asset'}</span> </div>
							<div class="user-topic sdlms-text-tertiary-12px">Topic: <span
								class="sdlms-sub-text-primary-12px text-capitalize">${ev.topic ? ev.topic : 'Topic'}</span></div>
						</div>
					</div>
                                </div >

					<div class="col-2 pr-0 d-flex  justify-content-end align-items-center text-right">
						${app.timeFormatter(ev.modified, `<div class="user-last-activity text-center">
								<div
									class="user-last-activity-time-number font-weight-700 sdlms-sub-text-primary-12px">
									#time#</div>

								<div
									class="user-last-activity-time-minutes text-capitalize font-weight-400 sdlms-sub-text-tertiary-10px">
									#Mins#</div>
								<div
									class="user-last-activity-time-ago text-capitalize font-weight-400 sdlms-sub-text-tertiary-10px">
									ago</div>
							</div>`)}
					</div>
                            </li >
					`);
			});
			$('.sdlms-container').find('.feedbacks-page').val(res.current_page + 1);
			$('.sdlms-container').find('.feedback-page-count').text(res.last_page + 1);
			$('.sdlms-container').find('.fb-navigator.next').data('url', res.next_page_url);
			$('.sdlms-container').find('.fb-navigator.prev').data('url', res.prev_page_url);
			$monitorBoard.rfeedbacksLoaded = true;
		});
	};

	return $monitorBoard;
});
