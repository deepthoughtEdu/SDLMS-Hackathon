'use strict';

define('sdlms/postClass/postClass', [
	'api', 'sdlms/eaglebuilder', 'sdlms/threadbuilder', 'sdlms/feedbacks', 'sdlms/spreadsheet',
], function (api, eb, threadbuilder, feedbacks) {
	var POST_CLASS = {};
	window.students = [];

	var session = ajaxify.data.Sessions;
	var topic = session.topic;
	if (!ajaxify.data.loggedIn) {
		location.pathname = '/login';
		return;
	}
	if (!session) {
		alert('This session is not Ended yet');
		app.loader(1, 'Session');
		location.pathname = '/monitor';
		return;
	}
	var tid = session.tid;
	var uid = ajaxify.data.user[0].uid;
	POST_CLASS.syncDuration = 60;
	POST_CLASS.init = (data) => {
		if (!data.tid) {
			throw new Error('No topic present');
		}
		socket.emit('sdlms.class.enter', {
			tid: tid,
		});
		POST_CLASS.tid = data.tid;
		POST_CLASS.data = data;

		var b = document.documentElement;
		b.setAttribute('data-useragent', navigator.userAgent);
		b.setAttribute('data-platform', navigator.platform);

		$('.session-microscope-nav').attr('data-microscope-tid', tid);
		$('[data-microscope-tid]').on('click', function () {
			var tid = $(this).data('microscope-tid');
			ajaxify.go('/session/microscope/' + tid);
		})

        POST_CLASS.initMembers();
        POST_CLASS.initEagleBuilder();
        POST_CLASS.initThreadBuilder();
        POST_CLASS.initSpreadSheet();
        POST_CLASS.events();
        app.addSessionDetails(session.schedule, "sdlms-session-schedule",session.ended_on);
        $('.sdlms-container').find(".sdlms-calender-date").append(`${moment(session.schedule).format('DD')}`)
        $('.sdlms-container').find(".sdlms-calender-month").append(`${moment(session.schedule).format('MMM')}`)

		const checkLoading = setInterval(() => {
			if ((POST_CLASS.tbLoaded || ajaxify.data.isTeacher) && POST_CLASS.ebLoaded && POST_CLASS.memberLoaded) {
				app.loader(0);
				clearInterval(checkLoading);
			}
		}, 1000);
	};

    POST_CLASS.initMembers = () => {
        api.get(`/sdlms/${tid}/attendance`, {
            limit: 50
        })
            .then((r) => {
                $("body").find(".sdlms-asset-selection-user-body").append(POST_CLASS._template('studentSearch', $.extend({}, session.teacher, {
                    role: "teacher",
                    isTeacher: ajaxify.data.isTeacher
                })));
				r.data = r.data.filter(e => e.uid != session.teacher.uid);
                $.each(r.data, function (index, student) {
					
					$("body").find(".sdlms-section-list").append(POST_CLASS._template('student', $.extend({},student,{
						role:session.teacher.uid == student.uid ? "teacher" : "student",
						isTeacher: session.teacher.uid == student.uid
					})));
                    if (Array.isArray(window.students) && window.students.indexOf(student.uid) === -1) window.students.push(student);
					$("body").find(".sdlms-asset-selection-user-body").append(app._template('studentSearch', student));
                });
                $("body").find(".sdlms-asset-selection-user-body").off('click').on('click', '[data-students-search]', function (e) {
                    var member = $(this).data();
                    let labels = {
						sp:'Spread Sheet',
						eb:'Eagle Builder',
						tb:'Thread Builder'
					}
                    if (member.uid) {
                        $('#studentAssetView').empty();
                        $('[sdlms-toggle-members-list]').toggle();
                        $('#studentAssetView').removeClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');;
                        $('[sdlms-members-asset-view],[sdlms-search]').toggleClass('w-100 sdlms-w-0');
                        $('[asset-selection-label]').text(`${member.fullname || member.displayname || member.username}'s Eagle Builder`);
                        $('[asset-selection-label]').addClass('active');
                        $('[asset-selection-label]').data('uid', member.uid);
						if ((!ajaxify.data.tracker && member.role == "teacher") || member.role != "teacher") {
                            $('[asset-selection-label].active').off('click').on('click', function () {
                                $('.assetSelectionDropDown').slideToggle();
                                $(this).toggleClass('visibility-shown');
                                let $this = $(this);
                                $('.assetSelectionDropDown').find('[get-asset]').off('click').on('click', function () {
                                    $('#studentAssetView').empty().removeClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');;
									$('[asset-selection-label]').text(`${member.fullname || member.displayname || member.username}'s ${labels[$(this).data('type')]}`);
									$('.assetSelectionDropDown').slideToggle();
									$('.assetSelectionDropDown').find('[get-asset]').removeClass('active');
									$('.assetSelectionDropDown').find('[get-asset]').attr('uid', 0);
									$(this).attr('uid', member.uid);
                                    $(this).addClass('active');
                                    POST_CLASS.getAsset(member.uid, $(this).data('type'));
                                });
                            });
                            api.get(`/sdlms/${tid}/eaglebuilder?uid=${member.uid}`, {}).then((r) => {
                                let data = {
                                    meta: r.meta,
                                    tracks: r.tracks,
                                    conclusion: r.conclusion || {},
                                };
                                if (!r.tracks || !r.tracks.length) {
									$('#studentAssetView').html('No Eagle Builder found').addClass('h-100 w-100 text-center d-flex justify-content-center align-items-center');;
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
                                    syncDuration: POST_CLASS.syncDuration,
                                    uid: member.uid
                                });
                            });
						} else if(member.role == "teacher") {
                            try {
                                api.get(`/sdlms/${tid}/tracker`, {}).then((r) => {
                                    let data = {
                                        meta: r.meta,
                                        tracks: r.tracks,
                                        conclusion: r.conclusion || {},
                                    };
                                    $('[members-assets]').data('id', r.id)
                                    new eagleBuilder({
                                        target: '#studentAssetView',
                                        action: "reader",
                                        tid: tid,
                                        with: data,
                                        tracking: false,
                                        control: member.isTeacher || false,
										id: r.pid || r.id,
										addFeedbacks: true,
										uid: member.uid,
									});
								});
							} catch (error) {
								console.log('Error while fetching Tracker:', error);
							}
						}
					}
				});
				POST_CLASS.memberLoaded = true;
			})
			.catch((e) => {
				//
			});
	};
	POST_CLASS._template = (part, data = {}) => {
		const components = {
			student: () => {
				data.stats = data.stats || {
					eb: {
						count: {
							characters: 0,
							words: 0,
						},
					},
					tb: {
						count: {
							characters: 0,
							words: 0,
						},
					},
				};
				return ` 
                <li class="d-flex align-items-center" user-data user-uid="${data.uid}" data-title="${data.fullname || data.displayname || data.username}"  title-bottom>
                <div class="col-8 d-flex pl-0" user-info>
                    <div class="user-img position-relative" data-reacted="${data.uid}">
                        <img  onerror="${app.IMG_ERROR()}" src="${data.picture}" alt="" />
                    </div>
                    <div class="user-info pl-2 d-flex flex-column">
                        <div class="user-name sdlms-text-tertiary-16px text-ellipse font-weight-medium text-left" >
                        ${data.fullname || data.displayname || data.username}
                        </div>
                        <div class="user-last-activity hidden-on-collapsed sdlms-sub-text-primary-12px font-weight-500">${moment(data.stats.eb.timestamp).fromNow()}</div>
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
					 <span eb>${data.stats.eb.count && (data.stats.eb.count.characters > 0) ? data.stats.eb.count.characters : 0} L</span>&nbsp;|&nbsp;<span tb>${data.stats.tb.count && (data.stats.tb.count.characters > 0) ? data.stats.tb.count.characters : 0} L</span>
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
	POST_CLASS.initEagleBuilder = () => {
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
				POST_CLASS.ebLoaded = true;
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

	POST_CLASS.initThreadBuilder = () => {
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
					uid: uid,
					topic: topic,
					autosave: 120
				});
				POST_CLASS.tbLoaded = true;
			});
		} catch (error) {
			console.log('Error while fetching Student Eagle Builder:', error);
		}
	};
	POST_CLASS.initSpreadSheet = async () => {
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
	POST_CLASS.getAsset = async (uid, type) => {
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
					syncDuration: POST_CLASS.syncDuration,
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
					syncDuration: POST_CLASS.syncDuration,
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
	POST_CLASS.events = () => {
		socket.on('event:class.assets.update', (data) => {
			if (data.latest) {
				$(`[user-data][user-uid="${data.uid}"]`).find('.user-last-activity ').html(`Last Minute`);
				$(`[user-data][user-uid="${data.uid}"]`).find(`[${data.asset_type}]`).html(`${(data.latest.count && (data.latest.count.characters > 0)) ? data.latest.count.characters : 0} L`);
			}

			if (!Number(data.force_refresh) && data.value) {
				$('[members-assets]').find(`[sdlms-id="${data.value.parent_id}"]`).find(`[sdlms-id="${data.value.thread}"]`).html(`${data.value.value}`);
			} else if (Number(data.force_refresh) && $('[asset-selection-label].active').data('uid') == data.uid) {
				POST_CLASS.getAsset(data.uid, data.asset_type);
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
			console.log(data);
			if (data.asset_owner_uid == uid && data.tid == tid) {
				const d = $('[data-students-search][data-uid="' + data.creator + '"]').data();
				console.log(d);
				notify(`${d.name || d.displayname || d.username} has given feedback on ${data.type == 'eb' ? 'Eagle Builder' : 'Thread Builder'}`, 'info', 5000);
			}
		});
		socket.on('event:class.joined', (data) => {
			if (Array.isArray(window.students) && window.students.indexOf(data.uid) === -1) window.students.push(data);
			notify(`${data.fullname || data.displayname || data.username} has joined the class`, 'info', 5000);
			if (!$(`[user-data][user-uid="${data.uid}"]`).length) {
				$("body").find(".sdlms-section-list").append(POST_CLASS._template('student', $.extend({}, data, {
					role: session.teacher.uid == data.uid ? "teacher" : "student",
					isTeacher: session.teacher.uid == data.uid
				})));
			}
			if (!$(".sdlms-asset-selection-user-body").find(`[data-students-search][data-uid="${data.uid}"]`).length) {
				$("body").find(".sdlms-asset-selection-user-body").append(app._template('studentSearch', data));
			}
		})
	}
    return POST_CLASS
});
