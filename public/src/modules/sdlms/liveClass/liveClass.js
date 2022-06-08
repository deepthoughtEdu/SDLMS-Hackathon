'use strict';

define("sdlms/liveClass/liveClass", [
	'api', "sdlms/eaglebuilder", "sdlms/threadbuilder", "sdlms/feedbacks", "sdlms/spreadsheet", "sdlms/sharer","sdlms/polls"
], function (api, eb, threadbuilder, feedbacks, spreadsheet) {
	var LIVE_CLASS = {};
	window.students = [];
	console.log('liveClass.js loaded');
	const session = ajaxify.data.Sessions[0];
	session.attendance = session.attendance || [];
	var tid = session.tid;
	var topic = session.topic;
	var uid = ajaxify.data.user[0].uid;
	LIVE_CLASS.init = (data) => {
		if (!data.tid) {
			throw new Error('No topic present');
		}
		socket.emit('sdlms.class.enter', {
			tid: tid,
		});

		LIVE_CLASS.tid = data.tid;
		LIVE_CLASS.data = data;
		LIVE_CLASS.syncDuration = 60;

		var b = document.documentElement;
		b.setAttribute('data-useragent', navigator.userAgent);
		b.setAttribute('data-platform', navigator.platform);

		$('.session-microscope-nav').attr('data-microscope-tid', tid);
		$('[data-microscope-tid]').on('click', function () {
			var tid = $(this).data('microscope-tid');
			ajaxify.go('/session/microscope/' + tid);
		})

		LIVE_CLASS.initMembers();
		LIVE_CLASS.initSessionSpeedDial();
		LIVE_CLASS.track();
		// LIVE_CLASS.initEagleBuilder();
		LIVE_CLASS.initThreadBuilder();
		LIVE_CLASS.initSpreadSheet();
		LIVE_CLASS.reactions();
		LIVE_CLASS.initPolls();
		LIVE_CLASS.events();
		new Sharer({
			target: '.live-class-share',
			sharer: session.sharer,
			tid: tid
		})
		
		app.addSessionDetails(session.schedule, "sdlms-session-schedule", session.ended_on);
		$('.sdlms-container').find(".sdlms-calender-date").append(`${moment(session.schedule).format('DD')}`)
		$('.sdlms-container').find(".sdlms-calender-month").append(`${moment(session.schedule).format('MMM')}`)

		let checkLoading = setInterval(() => {
			if ( LIVE_CLASS.memberLoaded) {
				app.loader(0);
				clearInterval(checkLoading);
			}
		}, 1000);
	};
	LIVE_CLASS.initMembers = () => {
		api.get(`/sdlms/${tid}/attendance`, {
			limit: 50,
		})
			.then((r) => {
				$('body').find('.sdlms-asset-selection-user-body').append(LIVE_CLASS._template('studentSearch', $.extend({}, session.teacher, {
					role: 'teacher',
					isTeacher: ajaxify.data.isTeacher,
				})));
				r.data = r.data.filter(e => e.uid != session.teacher.uid);
				$.each(r.data, function (index, student) {
				
					$("body").find(".sdlms-section-list").append(LIVE_CLASS._template('student', $.extend({}, student, {
						role: session.teacher.uid == student.uid ? "teacher" : "student",
						isTeacher: session.teacher.uid == student.uid
					})));
					if (Array.isArray(window.students) && window.students.indexOf(student.uid) === -1) window.students.push(student);
					$('body').find('.sdlms-asset-selection-user-body').append(app._template('studentSearch', student));
				});

				$("body").find(".sdlms-asset-selection-user-body").off('click').on('click', '[data-students-search]', function (e) {
					var member = $(this).data();
					const labels = {
						sp: 'Spread Sheet',
						eb: 'Eagle Builder',
						tb: 'Thread Builder',
					};
					if (member.uid) {
						$('#studentAssetView').empty();
						$('[sdlms-toggle-members-list]').toggle();
						$('#studentAssetView').removeClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');
						$('[sdlms-members-asset-view],[sdlms-search]').toggleClass('w-100 sdlms-w-0');
						$('[asset-selection-label]').text(`${member.fullname || member.displayname || member.username}'s Eagle Builder`);
						$('[asset-selection-label]').addClass('active');
						$('[asset-selection-label]').attr('data-uid', member.uid);
						$(window).trigger('sdlms.asset.selection.change');
						clearInterval(window.tbRereshInterval);
						clearInterval(window.ebRereshInterval);
						if ((!ajaxify.data.tracker && member.role == "teacher") || member.role != "teacher") {
							$('[asset-selection-label].active').off('click').on('click', function () {
								$('.assetSelectionDropDown').slideToggle();
								$(this).toggleClass('visibility-shown');
								const $this = $(this);
								$('.assetSelectionDropDown').find('[get-asset]').off('click').on('click', function () {
									$('#studentAssetView').empty().removeClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');
									$('[asset-selection-label]').text(`${member.fullname || member.displayname || member.username}'s ${labels[$(this).data('type')]}`);
									$('.assetSelectionDropDown').slideToggle();
									$('.assetSelectionDropDown').find('[get-asset]').removeClass('active');
									$('.assetSelectionDropDown').find('[get-asset]').attr('uid', 0);
									$(this).addClass('active');
									$(this).attr('uid', member.uid);
									clearInterval(window.tbRereshInterval);
									clearInterval(window.ebRereshInterval);
									$(window).trigger('sdlms.asset.selection.change');
									LIVE_CLASS.getAsset(member.uid, $(this).data('type'));
								});
							});
							api.get(`/sdlms/${tid}/eaglebuilder?uid=${member.uid}`, {}).then((r) => {
								const data = {
									meta: r.meta,
									tracks: r.tracks,
									conclusion: r.conclusion || {},
								};
								if (!r.tracks || !r.tracks.length) {
									$('#studentAssetView').html('No Eagle Builder found').addClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');
									return;
								}
								$('[members-assets]').data('id', r.id);
								new eagleBuilder({
									target: '#studentAssetView',
									action: 'reader',
									tid: tid,
									id: r.pid || r.id,
									with: data,
									addFeedbacks: true,
									uid: member.uid,
									syncDuration: LIVE_CLASS.syncDuration,
									topic: topic,
								});
							});
						} else if (member.role == "teacher") {
							try {
								api.get(`/sdlms/${tid}/tracker`, {}).then((r) => {
									const data = {
										meta: r.meta,
										tracks: r.tracks,
										conclusion: r.conclusion || {},
									};
									$('[members-assets]').data('id', r.id);
									new eagleBuilder({
										target: '#studentAssetView',
										action: 'reader',
										tid: tid,
										with: data,
										tracking: true,
										control: member.isTeacher || false,
										id: r.pid || r.id,
										addFeedbacks: true,
										uid: member.uid,
										topic: topic,
									});
								});
							} catch (error) {
								console.log('Error while fetching Tracker:', error);
							}
						}
					}
				});
				LIVE_CLASS.memberLoaded = true;
			})
			.catch((e) => {
				//
				console.log('Error while fetching members:', e);
			});
	};
	LIVE_CLASS._template = (part, data = {}) => {
		const components = {
			student: () => {
				data.stats = data.stats || {};
				data.stats.eb = (data.stats.eb || ({
					count: {
						characters: 0,
						words: 0,
					}
				}));
				data.stats.tb = (data.stats.tb || ({
					count: {
						characters: 0,
						words: 0,
					}
				}));
				console.log(data.stats);
				return ` 
                <li class="d-flex align-items-center" user-data user-uid="${data.uid}" data-title="${data.fullname || data.displayname || data.username}"  title-bottom>
                <div class="col-8 d-flex pl-0" user-info>
                    <div class="user-img position-relative" data-reacted="${data.uid}">
                        <img onerror="${app.IMG_ERROR()}" src="${data.picture}" alt="" />
                    </div>
                    <div class="user-info pl-2 d-flex flex-column">
                        <div class="user-name sdlms-text-tertiary-16px text-ellipse font-weight-medium text-left" >
                        ${data.fullname || data.displayname || data.username}
                        </div>
                        <div class="user-last-activity hidden-on-collapsed sdlms-sub-text-primary-12px font-weight-500" auto-update-time-ago="${(data.stats ? data.stats.eb.timestamp : 0)}">${moment(data.stats ? data.stats.eb.timestamp : 0).fromNow()}</div>
                    </div>
                </div>
                <div class="col-2 hidden-on-collapsed text-center">
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.49008 0L2.34506 5.75697H8.6351L5.49008 0Z" fill="#323232"/>
                        <path d="M8.63502 12.7932C10.0588 12.7932 11.2082 11.5043 11.2082 9.91474C11.2082 8.32518 10.0588 7.03625 8.63502 7.03625C7.2112 7.03625 6.06186 8.32518 6.06186 9.91474C6.06186 11.5043 7.2112 12.7932 8.63502 12.7932Z" fill="#323232"/>
                        <path d="M0.34375 7.35608H4.9183V12.4734H0.34375V7.35608Z" fill="#323232"/>
                    </svg>
                </div>
                <div class="col-2 hidden-on-collapsed px-0 d-flex justify-content-end align-items-center text-right">
                    <div class="user-progress position-relative" data-uid="${data.uid}">
					<span eb>${data.stats && data.stats.eb.count && (data.stats.eb.count.characters > 0) ? data.stats.eb.count.characters : 0} L</span>&nbsp;|&nbsp;<span tb>${data.stats && data.stats.tb.count && (data.stats.tb.count.characters > 0) ? data.stats.tb.count.characters : 0} L</span>
                    </div>
                </div>
            </li>`;
			},
			studentSearch: () => ` <div class="sdlms-assets-selection-user-list" data-students-search data-fullname="${data.fullname}" data-displayname="${data.displayname}" data-username="${data.username}" data-uid="${data.uid}" data-is-teacher="${data.isTeacher}" data-role="${data.role}" >
				<div class="col-11 mx-auto">
					<div class="d-flex align-items-center py-2 justify-content-start">
						<img onerror="${app.IMG_ERROR()}" src="${data.picture}" class="rounded-circle" alt="" /><span class="sdlms-text-tertiary-16px text-ellipse font-weight-medium ml-3">${data.fullname || data.displayname || data.username} ${data.uid == uid ? (`(${(data.isTeacher ? 'Teacher, ' : '')}Me)`) : ''}</span>
					</div>
				</div>
			</div>`,
		};
		return components[part]();
	};

	LIVE_CLASS.initEagleBuilder = () => {
		try {
			api.get(`/sdlms/${tid}/eaglebuilder?uid=${uid}`, {}).then((r) => {
				const data = {
					meta: r.meta,
					tracks: r.tracks,
					conclusion: r.conclusion || {},
				};
				new eagleBuilder({
					target: '#SDLMSEagleBuilder',
					action: 'builder',
					tid: tid,
					uid: uid,
					id: r.pid || r.id,
					// enableDuration: true,
					with: data,
					addFeedbacks: true,
					topic: topic,
					autosave: 120
				});
				LIVE_CLASS.ebLoaded = true;
			});
		} catch (error) {
			console.log('Error while fetching Student Eagle Builder:', error);
		}
		if (ajaxify.data.isTeacher) {
			try {
				api.get(`/sdlms/${tid}/tracker`, {}).then((r) => {
					const data = {
						meta: r.meta,
						tracks: r.tracks,
						conclusion: r.conclusion || {},
					};
					new eagleBuilder({
						target: '#SDLMSPlanner',
						action: 'reader',
						tid: tid,
						with: data,
						tracking: true,
						id: r.pid || r.id,
						control: true,
						addFeedbacks: true,
						uid: uid,
						topic: topic,
					});
				});
			} catch (error) {
				console.log('Error while fetching Tracker:', error);
			}
		}
	};
	LIVE_CLASS.track = () => {
		/**
		 * @author: @Deepansu
		 * @description: This function is used to track/update the state of the session
		 * */

		var $container = $('[sdlms-component="session"]');
		var start = session.schedule;
		var end = start + 1000 * 60 * 60;

		const sessionInterval = setInterval(() => {
			var now = Date.now();
			var percentage = ((Math.abs(now - start) / Math.abs(end - start)) * 100).toFixed(2);
			$container.find('[sdlms-session="tracker"]').css({
				width: `${percentage >= 100 ? 100 : percentage}%`,
				background: `linear-gradient(to right, var(--secondary-background-color) ${(percentage <= 100 ? percentage : 0)}%, ${percentage > 100 ? 'var(--primary-danger-color)' : 'transparent'} ${(percentage > 100 ? 0 : 0)}%)`,
				borderRadius: `calc(var(--primary-border-radius)/1.8) ${percentage >= 100 ? 'calc(var(--primary-border-radius)/1.8)' : 0}  ${percentage >= 100 ? 'calc(var(--primary-border-radius)/1.8)' : 0} calc(var(--primary-border-radius)/1.8)`,
			});
			$container.find('[sdlms-session="timer"]').text(`${percentage}`);
			$container.find('.session-tracker-completion')[percentage >= 100 ? 'addClass' : 'removeClass']('sdlms-session-tracker-completion-warning');
		}, 1000);

		function updateState(elem) {
			$container.find('.tracker-state').removeClass('active');
			$(`[sdlms-session="${elem}"]`).parents('.tracker-state').first().addClass('active');
			$container.find('.tracker-state').each(function () {
				const $label = $(this).find('.tracker-state-label');
				const data = $label.data();
				$label.text(data[$(this).hasClass('active') ? 'textActive' : 'text']);
			});

			if (elem == 'stop') {
				clearInterval(sessionInterval);
				$(window).trigger('session:stopped');
				api.put(`/sdlms/monitor/${tid}`, {
					isLive: false,
				});
				notify('Session has been Stopped', 'info');
				notify('You\'ll be redirected to post Session in 30sec', 'info', 5000);

				setTimeout(() => {
					notify('You\'ll be redirected to post Session in 20sec', 'info', 5000);
				}, 10000);

				setTimeout(() => {
					notify('You\'ll be redirected to post Session in 10sec', 'info', 5000);
				}, 20000);

				setTimeout(() => {
					location.pathname = `postclass/${tid}`;
				}, 30000);
			}
		}
		/**
		 * @author Deepansu
		 * @date 09-02-2022
		 * @todo Need to add the functionality to update the state of the session
		 * line 214 api need to create  to update the state of the session _id is object id
		 */
		const state = session.state || 'start';
		const session_id = session._id;
		updateState(state);

		if (ajaxify.data.isTeacher) {
			$container.find('[sdlms-session]').prop('disabled', !true);
			$container.find('[sdlms-session]').off('click').on('click', function () {
				if ($(this).attr('sdlms-session') != 'stop' || confirm('Stop Current Session?')) {
					const state = $(this).attr('sdlms-session');
					updateState(state);
					socket.emit('meta.live.stateChange', $.extend({}, {}, {
						event: state,
						tid: tid,
					}));
					/**
					 * @author imshawan
					 * @date 10-02-2022
					 * @description API call for updating a particular by its Id
					 * @status [IMPLEMENTED AND INTEGRATED]
					 */
					api.put(`/sdlms/session/update`, {
						id: session_id,
						state: state,
					});
				}
			});
		} else {
			socket.on('meta.live.stateChange', (data) => {
				if (data.tid == tid) {
					notify(`Session has been ${$(`[sdlms-session="${data.event}"]`).parents('.tracker-state').find('.tracker-state-label').data('textActive')}`, 'info', 5000);
					updateState(data.event);
				}
			});
		}
	};
	LIVE_CLASS.initThreadBuilder = () => {
		try {
			api.get(`/sdlms/${tid}/threadbuilder?uid=${uid}`, {}).then((r) => {
				const data = {
					meta: r.meta,
					threads: r.threads,
					conclusion: r.conclusion || {},
				};
				new threadBuilder({
					target: '#SDLMSThreadBuilder',
					action: 'builder',
					tid: tid,
					id: r.pid || r.id,
					students: session.attendance,
					uid: uid,
					with: data,
					addFeedbacks: true,
					topic: topic,
					autosave: 120
				});
				LIVE_CLASS.tbLoaded = true;
			});
		} catch (error) {
			console.log('Error while fetching Student Eagle Builder:', error);
		}
	};
	LIVE_CLASS.getAsset = async (uid, type) => {
		if (type == 'tb') {
			api.get(`/sdlms/${tid}/threadbuilder?uid=${uid}`, {}).then((r) => {
				const data = {
					threads: r.threads,
				};
				if (!r.threads || !r.threads.length) {
					$('#studentAssetView').html('No Thread Builder found').addClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');
					return;
				}
				$('[members-assets]').data('id', r.id);
				new threadBuilder({
					target: '#studentAssetView',
					action: 'reader',
					tid: tid,
					with: data,
					addFeedbacks: true,
					uid: uid,
					syncDuration: LIVE_CLASS.syncDuration,
					id: r.pid || r.id,
					topic: topic,
				});
			});
		} else if (type == 'eb') {
			api.get(`/sdlms/${tid}/eaglebuilder?uid=${uid}`, {}).then((r) => {
				const data = {
					meta: r.meta,
					tracks: r.tracks,
					conclusion: r.conclusion || {},
				};
				if (!r.tracks || !r.tracks.length) {
					$('#studentAssetView').html('No Eagle Builder found').addClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');
					return;
				}
				$('[members-assets]').data('id', r.id);
				new eagleBuilder({
					target: '#studentAssetView',
					action: 'reader',
					tid: tid,
					with: data,
					addFeedbacks: true,
					syncDuration: LIVE_CLASS.syncDuration,
					uid: uid,
					id: r.pid || r.id,
					topic: topic,
				});
			});
		} else if (type == 'sp') {
			let teacherSP = {
				data: {
					data: [],
					readonly: '[]',
					widths: '[]',
				},
			};
			const userSP = await api.get(`/sdlms/spreadsheet?tid=${tid}&uid=${uid}`, {});
			const pid = userSP.pid;
			userSP.data = userSP.data || {};
			let readonly = (userSP.data || {}).readonly;
			if (!ajaxify.data.isTeacher && ajaxify.data.isStudent) {
				teacherSP = await api.get(`/sdlms/spreadsheet?tid=${tid}&uid=${session.teacher.uid}`, {});
				teacherSP.data = teacherSP.data || {};
				readonly = teacherSP.data.readonly;
			}
			const SPdata = {
				data: $.extend([], teacherSP.data.data, userSP.data.data),
				readonly: readonly,
				widths: userSP.data.widths,
				styles: teacherSP.data.styles,
			};
			new spreadSheet({
				target: '#studentAssetView',
				action: 'reader',
				tid: tid,
				with: SPdata,
				addFeedbacks: true,
				uid: uid,
				id: pid,
				topic: topic,
				isBrodcaster: ajaxify.data.isTeacher,
				isListener: ajaxify.data.isStudent,
			});
		}
	};
	LIVE_CLASS.reactions = () => {
		function react(data) {
			$(`[data-reacted="${data.uid}"]`).append(`<img onerror="${app.IMG_ERROR()}" class="user-reacted" src="${data.icon}" alt="">`);
			setTimeout(() => {
				$(`[data-reacted="${data.uid}"]`).find('.user-reacted').remove();
			}, 5000);
		}
		$('[sdlms-reaction]').find('> li').on('click', function () {
			let data = $(this).find('> img').data();
			data = $.extend({}, data, {
				icon: $(this).find('> img').attr('src'),
				tid: tid,
				...ajaxify.data.user.at(),
			});
			socket.emit('meta.live.reaction', data);
			react(data);
			api.put(`/sdlms/reactions/${tid}/${data.id}`, data);
		});
		socket.on('meta.live.reaction', (data) => {
			// if it's triggered for current class then react
			if (tid == data.tid) {
				react(data);
				if (ajaxify.data.isTeacher) {
					notify(`${data.fullname || data.displayname || data.username} reacted <img onerror="${app.IMG_ERROR()}" style="width:24px;height:24px;border-radius:50%" class="ml-2" src="${data.icon}">`, 'info', 5000);
				}
			}
		});
	};
	LIVE_CLASS.initSpreadSheet = async () => {
		let teacherSP = {
			data: {
				data: [],
				readonly: '[]',
				widths: '[]',
			},
		};
		const userSP = await api.get(`/sdlms/spreadsheet?tid=${tid}`, {});
		const pid = userSP.pid;
		userSP.data = userSP.data || {};
		let readonly = (userSP.data || {}).readonly;
		if (!ajaxify.data.isTeacher && ajaxify.data.isStudent) {
			teacherSP = await api.get(`/sdlms/spreadsheet?tid=${tid}&uid=${session.teacher.uid}`, {});
			teacherSP.data = teacherSP.data || {};
			readonly = teacherSP.data.readonly;
		}
		const SPdata = {
			data: $.extend([], teacherSP.data.data, userSP.data.data),
			readonly: readonly,
			widths: userSP.data.widths,
			styles: teacherSP.data.styles,
		};
		new spreadSheet({
			target: '#SDLMSSpreadSheet',
			action: 'builder',
			tid: tid,
			with: SPdata,
			addFeedbacks: true,
			uid: uid,
			id: pid,
			topic: topic,
			isBrodcaster: ajaxify.data.isTeacher,
			isListener: ajaxify.data.isStudent,
		});
	};
	LIVE_CLASS.events = () => {
		try {
			if (location.search.includes('share_redirect')) {
				const data = ajaxify.data.user.at();
				data.tid = tid;
				socket.emit('meta.live.joined', data, (err) => {
					console.log(err);
				});
				app.eraseCookie('share_redirect');
				history.pushState(null, '', location.href.replaceAll('share_redirect', ''));
				history.pushState(null, '', location.href.replaceAll('url', ''));
			}
		} catch (error) {

		}

		socket.on('event:class.assets.update', (data) => {
			if (data.latest) {
				$(`[user-data][user-uid="${data.uid}"]`).find('.user-last-activity ').html(`Last Minute`);
				$(`[user-data][user-uid="${data.uid}"]`).find(`[${data.asset_type}]`).html(`${(data.latest.count && (data.latest.count.characters > 0)) ? data.latest.count.characters : 0} L`);
			}

			if (!Number(data.force_refresh) && data.value) {
				$('[members-assets]').find(`[sdlms-id="${data.value.parent_id}"]`).find(`[sdlms-id="${data.value.thread}"]`).html(`${app.processString(data.value.value)}`)
			} else if (Number(data.force_refresh) && $('[asset-selection-label].active').data('uid') == data.uid) {
				LIVE_CLASS.getAsset(data.uid, data.asset_type);
			}
		});
		socket.on('meta.live.ebRefresh', (data) => {
			if (data.tid == tid) {
				if (data.name != 'completed' || !localStorage.getItem('notified')) {
					localStorage.setItem('notified', 1);
					if (data.message) {
						notify(data.message, 'info', 5000);
					}
				}
			}
		});
		socket.on('meta.live.feedback', (data) => {
			if (data.asset_owner_uid == uid && data.tid == tid) {
				const d = $('[data-students-search][data-uid="' + data.creator + '"]').data();
				notify(`${d.name || d.displayname || d.username} has given feedback on ${data.type == 'eb' ? 'Eagle Builder' : 'Thread Builder'}`, 'info', 5000);
			}
		});
		socket.on('event:class.joined', (data) => {
			notify(`${data.fullname || data.displayname || data.username} has joined the class`, 'info', 5000);

			if (Array.isArray(window.students) && window.students.indexOf(data.uid) === -1) window.students.push(data);
			if (!$(`[user-data][user-uid="${data.uid}"]`).length) {
				$("body").find(".sdlms-section-list").append(LIVE_CLASS._template('student', $.extend({}, data, {
					role: session.teacher.uid == data.uid ? "teacher" : "student",
					isTeacher: session.teacher.uid == data.uid
				})));
			}
			if (!$(".sdlms-asset-selection-user-body").find(`[data-students-search][data-uid="${data.uid}"]`).length) {
				$("body").find(".sdlms-asset-selection-user-body").append(app._template('studentSearch', data));
			}
		});
		socket.on('event:class.thought.vote',function(data){
			let $count = $('[thought-vote-count="'+data.pid+'"]');
			$count.html(data.count);
		});
	}
	LIVE_CLASS.initPolls = () =>{
		if(ajaxify.data.isTeacher){
			new Polls({
				target: '#SDLMSEagleBuilder',
				tid: tid,
				groups:['eureka','answer','question','root']
			});
		}else{
			socket.on('event:class.polls.announce',function(data){
				Polls.thoughts(data,tid);
			})
		}
	}

	LIVE_CLASS.initSessionSpeedDial = function() {
		var speedDialContainer = document.querySelector(".session-speed-dial");
		var primaryButton = speedDialContainer.querySelector(
			".speed-dial__button--primary"
		);
	  
		document.addEventListener("click", function (e) {
			var classList = "session-speed-dial";
			var primaryButtonClicked = e.target === primaryButton || primaryButton.contains(e.target);
			var speedDialIsActive = speedDialContainer
					.getAttribute("class")
					.indexOf("speed-dial--active") !== -1;

			if (primaryButtonClicked && !speedDialIsActive) {
				classList += " speed-dial--active";
			}

			speedDialContainer.setAttribute("class", classList);
			$('#speed-dial-toggle').toggleClass('fa-chevron-down fa-chevron-up');
		});
	};
	return LIVE_CLASS
});
