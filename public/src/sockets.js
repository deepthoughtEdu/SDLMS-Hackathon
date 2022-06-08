'use strict';


app = window.app || {};
socket = window.socket;

(function () {
	var reconnecting = false;

	var ioParams = {
		reconnectionAttempts: config.maxReconnectionAttempts,
		reconnectionDelay: config.reconnectionDelay,
		transports: config.socketioTransports,
		path: config.relative_path + '/socket.io',
	};

	socket = io(config.websocketAddress, ioParams);

	var oEmit = socket.emit;
	socket.emit = function (event, data, callback) {
		if (typeof data === 'function') {
			callback = data;
			data = null;
		}
		if (typeof callback === 'function') {
			oEmit.apply(socket, [event, data, callback]);
			return;
		}

		return new Promise(function (resolve, reject) {
			oEmit.apply(socket, [event, data, function (err, result) {
				if (err) reject(err);
				else resolve(result);
			}]);
		});
	};

	if (parseInt(app.user.uid, 10) >= 0) {
		addHandlers();
	}

	window.app.reconnect = () => {
		if (socket.connected) {
			return;
		}

		var reconnectEl = $('#reconnect');
		$('#reconnect-alert')
			.removeClass('alert-danger pointer')
			.addClass('alert-warning')
			.find('p')
			.translateText(`[[global:reconnecting-message, ${config.siteTitle}]]`);

		reconnectEl.html('<i class="fa fa-spinner fa-spin"></i>');
		socket.connect();
	};

	function addHandlers() {
		socket.on('connect', onConnect);

		socket.on('disconnect', onDisconnect);

		socket.io.on('reconnect_failed', function () {
			var reconnectEl = $('#reconnect');
			reconnectEl.html('<i class="fa fa-plug text-danger"></i>');

			$('#reconnect-alert')
				.removeClass('alert-warning')
				.addClass('alert-danger pointer')
				.find('p')
				.translateText('[[error:socket-reconnect-failed]]')
				.one('click', app.reconnect);
		});

		socket.on('checkSession', function (uid) {
			if (parseInt(uid, 10) !== parseInt(app.user.uid, 10)) {
				app.handleInvalidSession();
			}
		});

		socket.on('setHostname', function (hostname) {
			app.upstreamHost = hostname;
		});

		socket.on('event:banned', onEventBanned);
		socket.on('event:logout', function () {
			app.logout();
		});
		socket.on('event:alert', function (params) {
			app.alert(params);
		});
		socket.on('event:deprecated_call', function (data) {
			console.warn('[socket.io] ', data.eventName, 'is now deprecated in favour of', data.replacement);
		});

		socket.removeAllListeners('event:nodebb.ready');
		socket.on('event:nodebb.ready', function (data) {
			if ((data.hostname === app.upstreamHost) && (!app.cacheBuster || app.cacheBuster !== data['cache-buster'])) {
				app.cacheBuster = data['cache-buster'];

				app.alert({
					alert_id: 'forum_updated',
					title: '[[global:updated.title]]',
					message: '[[global:updated.message]]',
					clickfn: function () {
						window.location.reload();
					},
					type: 'warning',
				});
			}
		});
		socket.on('event:livereload', function () {
			if (app.user.isAdmin && !ajaxify.currentPage.match(/admin/)) {
				window.location.reload();
			}
		});
	}

	function onConnect() {
		if (!reconnecting) {
			$(window).trigger('action:connected');
		}
		console.log('[socket.io] reconnecting', reconnecting);
		if (reconnecting) {
			var reconnectEl = $('#reconnect');
			var reconnectAlert = $('#reconnect-alert');

			// reconnectEl.tooltip('destroy');
			reconnectEl.html('<i class="fa fa-check text-success"></i>');
			reconnectAlert.fadeOut(500);
			reconnecting = false;

			reJoinCurrentRoom();

			socket.emit('meta.reconnected');

			$(window).trigger('action:reconnected');

			setTimeout(function () {
				reconnectEl.removeClass('active').addClass('hide');
			}, 3000);
		}
	}

	function reJoinCurrentRoom() {
		var url_parts = window.location.pathname.slice(config.relative_path.length).split('/').slice(1);
		var room;
		console.log(url_parts);

		switch (url_parts[0]) {
		case 'user':
			room = 'user/' + (ajaxify.data ? ajaxify.data.theirid : 0);
			break;
		case 'topic':
			room = 'topic_' + url_parts[1];
			break;
		case 'category':
			room = 'category_' + url_parts[1];
			break;
		case 'recent':
			room = 'recent_topics';
			break;
		case 'unread':
			room = 'unread_topics';
			break;
		case 'popular':
			room = 'popular_topics';
			break;
		case 'admin':
			room = 'admin';
			break;
		case 'categories':
			room = 'categories';
			break;
		case 'live':
			if (!isNaN(Number(url_parts[1]))) {
				socket.emit('sdlms.class.enter', {
					classId: Number(url_parts[1]),
				});
			}
		}
		app.currentRoom = '';
		if (room) app.enterRoom(room);


	}

	function onReconnecting() {
		reconnecting = true;
		var reconnectEl = $('#reconnect');
		var reconnectAlert = $('#reconnect-alert');

		if (!reconnectEl.hasClass('active')) {
			reconnectEl.html('<i class="fa fa-spinner fa-spin"></i>');
			reconnectAlert.fadeIn(500).removeClass('hide');
		}

		reconnectEl.addClass('active').removeClass('hide');
	}

	function onDisconnect() {
		setTimeout(function () {
			if (socket.disconnected) {
				onReconnecting();
			}
		}, 2000);

		$(window).trigger('action:disconnected');
	}

	function onEventBanned(data) {
		var message = data.until ? '[[error:user-banned-reason-until, ' + utils.toISOString(data.until) + ', ' + data.reason + ']]' : '[[error:user-banned-reason, ' + data.reason + ']]';

		bootbox.alert({
			title: '[[error:user-banned]]',
			message: message,
			closeButton: false,
			callback: function () {
				window.location.href = config.relative_path + '/';
			},
		});
	}

	if (
		config.socketioOrigins &&
		config.socketioOrigins !== '*:*' &&
		config.socketioOrigins.indexOf(location.hostname) === -1
	) {
		console.error(
			'You are accessing the forum from an unknown origin. This will likely result in websockets failing to connect. \n' +
			'To fix this, set the `"url"` value in `config.json` to the URL at which you access the site. \n' +
			'For more information, see this FAQ topic: https://community.nodebb.org/topic/13388'
		);
	}
}());