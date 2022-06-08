'use strict';

app = window.app || {};
app.isFocused = true;
app.currentRoom = null;
app.widgets = {};
app.flags = {};
app.Storage = {};
app.Storage.Get = () => { };
app.Storage.Set = () => { };
app.Storage.remove = () => { };
app.user.personal_assets_id = 1;
app.asset_url = 'https://sdlms.deepthought.education/assets/uploads/files/files';
app.v1_asset_url = 'https://blog.deepthought.education/wp-content/uploads';
app.random = {
	// 100 random colors
	backgrounds: ['navy', 'white', 'black'],
	colors: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#d35400', '#c0392b', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'],
	images: ['https://cdn.pixabay.com/photo/2018/03/30/15/11/deer-3275594_960_720.jpg', 'https://cdn.pixabay.com/photo/2018/04/09/19/55/low-poly-3305284_960_720.jpg', 'https://cdn.pixabay.com/photo/2018/04/06/13/46/poly-3295856_960_720.png', 'https://cdn.pixabay.com/photo/2018/03/30/15/12/dog-3275593_960_720.jpg'],

};
app.common = {
	words: ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"]
}
app.attachMentTypes = {
	"image": ['png', 'jpg', 'jpeg', 'gif'],
	"video": ['mp4', 'avi', 'mov', 'm4v'],
	"audio": ['mp3', 'wav', 'ogg', 'flac'],
	"pdf": ['pdf'],
	"doc": ['doc', 'docx'],
	"ppt": ['ppt', 'pptx'],
	"xls": ['xls', 'xlsx'],
};

app.getFileTypeByURL = (url, skipURLValidation = false) => {
	if (!url) return false;
	if (!skipURLValidation) {
		let isValid = app.isValidURL(url);;
		if (!isValid) return false;
	}
	let ext = app.getFileExtension(url);
	let type = null;
	for (let key in app.attachMentTypes) {
		if (app.attachMentTypes[key].includes(ext)) {
			type = key;
			break;
		}
	}
	return type;
}
app.log = (logs, trace = 0) => {
	console[trace ? 'trace' : 'log'](logs);
};
Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

app.cacheBuster = null;

/**
 * @date 03-05-2022
 * @author imshawan
 * @description This function is used to get the current plateform details on which SDLMS is running
 * @returns Object
 */
app.getPlateformDetails = () => {
	var nAgt = navigator.userAgent;
	var browserName = navigator.appName;
	var fullVersion = '' + parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion, 10);
	var system = navigator.appVersion;
	var nameOffset; var verOffset; var
		ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset = nAgt.indexOf('Opera')) != -1) {
		browserName = 'Opera';
		fullVersion = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf('Version')) != -1) fullVersion = nAgt.substring(verOffset + 8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
		browserName = 'Microsoft Internet Explorer';
		fullVersion = nAgt.substring(verOffset + 5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
		browserName = 'Chrome';
		fullVersion = nAgt.substring(verOffset + 7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
		browserName = 'Safari';
		fullVersion = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf('Version')) != -1) fullVersion = nAgt.substring(verOffset + 8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
		browserName = 'Firefox';
		fullVersion = nAgt.substring(verOffset + 8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if (
		(nameOffset = nAgt.lastIndexOf(' ') + 1) <
		(verOffset = nAgt.lastIndexOf('/'))
	) {
		browserName = nAgt.substring(nameOffset, verOffset);
		fullVersion = nAgt.substring(verOffset + 1);
		if (browserName.toLowerCase() == browserName.toUpperCase()) {
			browserName = navigator.appName;
		}
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix = fullVersion.indexOf(';')) != -1) fullVersion = fullVersion.substring(0, ix);
	if ((ix = fullVersion.indexOf(' ')) != -1) fullVersion = fullVersion.substring(0, ix);

	majorVersion = parseInt('' + fullVersion, 10);
	if (isNaN(majorVersion)) {
		fullVersion = '' + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}

	return {
		system,
		browserName,
		browserVersion: fullVersion,
		majorVersion
	};
}

/**
 * @date 03-05-2022
 * @author imshawan
 * @description Adding event listner that will listen to every errors occcuring on the page and send it to the server
 */
window.addEventListener('error', function (event) {
	if (app.user.collectErrorLogs) {
		let {
			colno,
			lineno,
			message,
			error
		} = event;
		let {
			stack
		} = error;
		let payload = {
			errorStack: {
				colno,
				lineno,
				message,
				stack
			},
			plateform: app.getPlateformDetails()
		}
		require(["api"], function (api) {
			api['post'](`/sdlms/error`, payload)
				.then((resp) => {
					console.log(resp.message)
				})
				.catch((err) => console.log(err.message));
		});
	}
});

(function () {
	var appLoaded = false;
	var params = utils.params();
	var showWelcomeMessage = !!params.loggedin;
	var registerMessage = params.register;
	var isTouchDevice = utils.isTouchDevice();

	app.cacheBuster = config['cache-buster'];

	$(document).ready(function () {
		ajaxify.parseData();
		app.load();
		console.log("SDLMS is running on " + app.getPlateformDetails().browserName + " " + app.getPlateformDetails().browserVersion);
	});

	app.coldLoad = function () {
		if (appLoaded) {
			ajaxify.coldLoad();
		} else {
			$(window).on('action:app.load', function () {
				ajaxify.coldLoad();
			});
		}
	};

	/**
	 * @author imshawan
	 * @date 23-04-2022
	 * @function removeDuplicates
	 * @description Removes duplicates from an array of Objects
	 * @param {array} array - Array of Objects
	 * @param {string} key - Key to check for duplicates
	 * @returns {Array}
	 */
	app.removeDuplicates = function (array, key) {
		const newArr = [];
		const uniqueElems = [];
		array.forEach(function (item) {
			if (!uniqueElems.includes(item[key])) {
				newArr.push(item);
				uniqueElems.push(item[key]);
			}
		});
		return newArr;
	};

	app.handleEarlyClicks = function () {
		/**
		 * Occasionally, a button or anchor (not meant to be ajaxified) is clicked before
		 * ajaxify is ready. Capture that event and re-click it once NodeBB is ready.
		 *
		 * e.g. New Topic/Reply, post tools
		 */
		if (document.body) {
			var earlyQueue = []; // once we can ES6, use Set instead
			var earlyClick = function (ev) {
				var btnEl = ev.target.closest('button');
				var anchorEl = ev.target.closest('a');
				if (
					!btnEl &&
					anchorEl &&
					(anchorEl.getAttribute('data-ajaxify') === 'false' ||
						anchorEl.href === '#')
				) {
					btnEl = anchorEl;
				}
				if (btnEl && !earlyQueue.includes(btnEl)) {
					earlyQueue.push(btnEl);
					ev.stopImmediatePropagation();
					ev.preventDefault();
				}
			};
			document.body.addEventListener('click', earlyClick);
			$(window).on('action:ajaxify.end', function () {
				document.body.removeEventListener('click', earlyClick);
				earlyQueue.forEach(function (el) {
					el.click();
				});
				earlyQueue = [];
			});
		} else {
			setTimeout(app.handleEarlyClicks, 50);
		}
	};
	app.handleEarlyClicks();

	app.load = function () {
		handleStatusChange();

		/*
		 * @description Set Item to LocalStorage
		 * @type Number || String || Object
		 * @key  Key
		 * @data Value
		 *
		 */

		app.Storage.Set = function (type = 'string', key, data) {
			const _Storage = localStorage || window.localStorage;
			type = type.toLowerCase();
			if (type == 'string' || type == 'number') {
				_Storage.setItem(key, data);
			} else if (type == 'object') {
				if (typeof data !== 'object') {
					console.log({
						error: 'Type mismatch',
					});
					return false;
				}
				data = JSON.stringify(data);
				_Storage.setItem(key, data);
			}
			return true;
		};

		/* '
		 * @description Get Item From LocalStorage
		 * @key  Key
		 */

		app.Storage.Get = function (key) {
			const _Storage = localStorage || window.localStorage;
			if (_Storage.getItem(key) == null) {
				return false;
			}
			data = _Storage.getItem(key);
			try {
				data = JSON.parse(data);
			} catch (error) {
				//  Nothing to Do 🤔🤔🤔
			}
			return data;
		};

		app.Storage.GetKeys = function (key) {
			const keys = [];
			for (const key in localStorage) {
				keys.push(key);
			}
			return keys;
		};

		/* '
		 * @description remove Item From LocalStorage
		 * @key  Key
		 */
		app.Storage.remove = function (key) {
			const _Storage = localStorage || window.localStorage;
			if (_Storage.getItem(key) == null) {
				return false;
			}
			_Storage.removeItem(key);
			return true;
		};

		app.clearStorage = function () {
			// Clear localstorage data before logging out
			var _Storage = localStorage || window.localStorage;
			_Storage.clear();
			return true;
		}

		if (config.searchEnabled) {
			app.handleSearch();
		}

		$('body').on('click', '#new_topic', function (e) {
			e.preventDefault();
			app.newTopic();
		});

		// $("body").on("load", function (e) {
		// 	// e.preventDefault();
		// 	require(["admin/manage/categories"], function (newCat) {
		// 		newCat.init();
		// 	});
		// });

		$('body').on('click', '#new_category', function (e) {
			e.preventDefault();
			// require(["admin/manage/customCat"], function (newCat) {
			// 	newCat.init();
			// 	newCat.throwCreateModal();
			// 	// console.log(newCat);
			// });
		});


		$('body').on('click', '.catPurge', function (e) {
			e.preventDefault();
			// require(["admin/manage/category"], function (catPurgee) {
			// 	console.log(catPurgee);
			// 	catPurgee.init(true);
			// 	catPurgee.catPurge();
			// });
		});

		/* $("body").on("click", ".catPurge", function (e) {
			e.preventDefault();
			require(["admin/manage/anecdotes"], function (catPurgee) {
				console.log(catPurgee);
				catPurgee.init(true);
				catPurgee.catPurge();
			});
		});
		//? why is it needed? is it even needed?
		*/

		$('body').on('click', '#new_quiz', function (e) {
			e.preventDefault();
			app.newQuiz();
		});

		$('#header-menu .container').on(
			'click',
			'[component="user/logout"]',
			function () {
				app.clearStorage();
				app.logout();
				return false;
			}
		);

		if (window.location.pathname == '/monitor') {
			require(['tmb/monitorBoard'], function (mb) {
				mb.init({
					tid: 2,
					log: 1,
				});
			});
		}

		if (window.location.pathname.includes('/live/')) {
			require(['sdlms/liveClass/liveClass'], function (lc) {
				lc.init({
					tid: 2,
					log: 1,
				});
			});
		}

		if (window.location.pathname.includes('/postclass/')) {
			require(['sdlms/postClass/postClass'], function (pc) {
				pc.init({
					tid: 2,
					log: 1,
				});
			});
		}

		if (window.location.pathname.includes('/sam')) {
			require(['sam'], function (lc) {
				lc.init({
					tid: 2,
					log: 1,
				});
			});
			console.log('hi there, this page is ausm!!!!!!');
		}

		Visibility.change(function (event, state) {
			app.isFocused = state === 'visible';
		});
		// if ("/compose" != location.pathname) {
		// 	// require(["sdlms"], function (sdlms) {
		// 	// 	sdlms.reset();
		// 	// });
		// }
		// window.addEventListener(
		// 	"popstate",
		// 	function (event) {
		// 		if ("/compose" != location.pathname) {
		// 			require(["sdlms"], function (sdlms) {
		// 				sdlms.reset();
		// 			});
		// 		}
		// 	},
		// 	false
		// );
		// createHeaderTooltips();
		// app.showEmailConfirmWarning();
		// app.showCookieWarning();
		registerServiceWorker();

		require([
			'taskbar',
			'helpers',
			// "forum/pagination",
			// "translator",
			// "forum/unread",
			// "forum/header/notifications",
			// "forum/header/chat",
			// "timeago/jquery.timeago",
		], function (
			taskbar,
			helpers
			// pagination,
			// translator,
			// unread,
			// notifications,
			// chat
		) {
			// notifications.prepareDOM();
			// chat.prepareDOM();
			// translator.prepareDOM();
			taskbar.init();
			helpers.register();
			// pagination.init();

			app.showMessages();
			appLoaded = true;
			$(window).trigger('action:app.load');
			// if (app.user.uid > 0) {
			// 	unread.initUnreadTopics();
			// }

			// function finishLoad() {
			// 	$(window).trigger("action:app.load");
			// 	app.showMessages();
			// 	appLoaded = true;
			// }
			// // overrides.overrideTimeago();
			// finishLoad();
			// if (app.user.timeagoCode && app.user.timeagoCode !== "en") {
			// 	require([
			// 		"timeago/locales/jquery.timeago." + app.user.timeagoCode,
			// 	], finishLoad);
			// } else {
			// 	finishLoad();
			// }
		});
	};

	app.logout = function (redirect) {
		redirect = redirect === undefined ? true : redirect;
		$(window).trigger('action:app.logout');

		$.ajax(config.relative_path + '/logout', {
			type: 'POST',
			headers: {
				'x-csrf-token': config.csrf_token,
			},
			beforeSend: function () {
				app.flags._logout = true;
			},
			success: function (data) {
				$(window).trigger('action:app.loggedOut', data);
				if (redirect) {
					if (data.next) {
						window.location.href = data.next;
					} else {
						window.location.reload();
					}
				}
			},
		});
		return false;
	};

	app.alert = function (params) {
		require(['alerts'], function (alerts) {
			alerts.alert(params);
		});
	};

	app.removeAlert = function (id) {
		require(['alerts'], function (alerts) {
			alerts.remove(id);
		});
	};

	app.alertSuccess = function (message, timeout) {
		app.alert({
			alert_id: utils.generateUUID(),
			title: '[[global:alert.success]]',
			message: message,
			type: 'success',
			timeout: timeout || 5000,
		});
	};

	app.alertError = function (message, timeout) {
		message = message.message || message;

		if (message === '[[error:invalid-session]]') {
			app.handleInvalidSession();
			app.logout(false);
			return;
		}

		app.alert({
			alert_id: utils.generateUUID(),
			title: '[[global:alert.error]]',
			message: message,
			type: 'danger',
			timeout: timeout || 10000,
		});
	};

	app.handleInvalidSession = function () {
		if (app.flags._login || app.flags._logout) {
			return;
		}

		socket.disconnect();
		bootbox.alert({
			title: '[[error:invalid-session]]',
			message: '[[error:invalid-session-text]]',
			closeButton: false,
			callback: function () {
				window.location.reload();
			},
		});
	};

	app.enterRoom = function (room, callback) {
		callback = callback || function () { };
		if (socket && app.user.uid && app.currentRoom !== room) {
			var previousRoom = app.currentRoom;
			app.currentRoom = room;
			socket.emit(
				'meta.rooms.enter', {
				enter: room,
			},
				function (err) {
					if (err) {
						app.currentRoom = previousRoom;
						return app.alertError(err.message);
					}

					callback();
				}
			);
		}
	};

	app.leaveCurrentRoom = function () {
		if (!socket) {
			return;
		}
		var previousRoom = app.currentRoom;
		app.currentRoom = '';
		socket.emit('meta.rooms.leaveCurrent', function (err) {
			if (err) {
				app.currentRoom = previousRoom;
				return app.alertError(err.message);
			}
		});
	};

	function highlightNavigationLink() {
		$('#main-nav li')
			.removeClass('active')
			.find('a')
			.filter(function (i, x) {
				return (
					window.location.pathname === x.pathname ||
					window.location.pathname.startsWith(x.pathname + '/')
				);
			})
			.parent()
			.addClass('active');
	}

	app.createUserTooltips = function (els, placement) {
		if (isTouchDevice) {
			return;
		}
		els = els || $('body');
		els
			.find(
				'.avatar,img[title].teaser-pic,img[title].user-img,div.user-icon,span.user-icon'
			)
			.each(function () {
				$(this).tooltip({
					placement: placement || $(this).attr('title-placement') || 'top',
					title: $(this).attr('title'),
					container: '#content',
				});
			});
	};

	app.createStatusTooltips = function () {
		if (!isTouchDevice) {
			$('body').tooltip({
				selector: '.fa-circle.status',
				placement: 'top',
			});
		}
	};

	app.processPage = function () {
		highlightNavigationLink();

		// $(".timeago").timeago();

		utils.makeNumbersHumanReadable($('.human-readable-number'));

		utils.addCommasToNumbers($('.formatted-number'));

		app.createUserTooltips($('#content'));

		app.createStatusTooltips();
	};

	app.showMessages = function () {
		var messages = {
			login: {
				format: 'alert',
				title: '[[global:welcome_back]] ' + app.user.username + '!',
				message: '[[global:you_have_successfully_logged_in]]',
			},
			register: {
				format: 'modal',
			},
		};

		function showAlert(type, message) {
			switch (messages[type].format) {
				case 'alert':
					app.alert({
						type: 'success',
						title: messages[type].title,
						message: messages[type].message,
						timeout: 5000,
					});
					break;

				case 'modal':
					require(['bootbox'], function (bootbox) {
						bootbox.alert({
							title: messages[type].title,
							message: message || messages[type].message,
						});
					});
					break;
			}
		}

		if (showWelcomeMessage) {
			showWelcomeMessage = false;
			$(document).ready(function () {
				showAlert('login');
			});
		}
		if (registerMessage) {
			$(document).ready(function () {
				showAlert(
					'register',
					utils.escapeHTML(decodeURIComponent(registerMessage))
				);
				registerMessage = false;
			});
		}
	};

	app.openChat = function (roomId, uid) {
		if (!app.user.uid) {
			return app.alertError('[[error:not-logged-in]]');
		}
		return;

		require(['chat'], function (chat) {
			function loadAndCenter(chatModal) {
				chat.load(chatModal.attr('data-uuid'));
				chat.center(chatModal);
				chat.focusInput(chatModal);
			}

			if (chat.modalExists(roomId)) {
				loadAndCenter(chat.getModal(roomId));
			} else {
				socket.emit(
					'modules.chats.loadRoom', {
					roomId: roomId,
					uid: uid || app.user.uid,
				},
					function (err, roomData) {
						if (err) {
							return app.alertError(err.message);
						}
						roomData.users = roomData.users.filter(function (user) {
							return (
								user && parseInt(user.uid, 10) !== parseInt(app.user.uid, 10)
							);
						});
						roomData.uid = uid || app.user.uid;
						roomData.isSelf = true;
						chat.createModal(roomData, loadAndCenter);
					}
				);
			}
		});
	};

	app.newChat = function (touid, callback) {
		function createChat() {
			socket.emit(
				'modules.chats.newRoom', {
				touid: touid,
			},
				function (err, roomId) {
					if (err) {
						return app.alertError(err.message);
					}

					if (!ajaxify.data.template.chats) {
						app.openChat(roomId);
					} else {
						ajaxify.go('chats/' + roomId);
					}

					callback(false, roomId);
				}
			);
		}

		callback = callback || function () { };
		if (!app.user.uid) {
			return app.alertError('[[error:not-logged-in]]');
		}

		if (parseInt(touid, 10) === parseInt(app.user.uid, 10)) {
			return app.alertError('[[error:cant-chat-with-yourself]]');
		}
		socket.emit('modules.chats.isDnD', touid, function (err, isDnD) {
			if (err) {
				return app.alertError(err.message);
			}
			if (!isDnD) {
				return createChat();
			}
			bootbox.confirm(
				'[[modules:chat.confirm-chat-with-dnd-user]]',
				function (ok) {
					if (ok) {
						createChat();
					}
				}
			);
		});
	};

	app.toggleNavbar = function (state) {
		var navbarEl = $('.navbar');
		if (navbarEl) {
			navbarEl[state ? 'show' : 'hide']();
		}
	};

	function createHeaderTooltips() {
		var env = utils.findBootstrapEnvironment();
		if (env === 'xs' || env === 'sm' || isTouchDevice) {
			return;
		}
		$('#header-menu li a[title]').each(function () {
			$(this).tooltip({
				placement: 'bottom',
				trigger: 'hover',
				title: $(this).attr('title'),
			});
		});

		$('#search-form').tooltip({
			placement: 'bottom',
			trigger: 'hover',
			title: $('#search-button i').attr('title'),
		});

		$('#user_dropdown').tooltip({
			placement: 'bottom',
			trigger: 'hover',
			title: $('#user_dropdown').attr('title'),
		});
	}

	app.enableTopicSearch = function (options) {
		if (!config.searchEnabled || !app.user.privileges['search:content']) {
			return;
		}
		/* eslint-disable-next-line */
		var searchOptions = Object.assign({
			in: 'titles',
		}, options.searchOptions);
		var quickSearchResults = options.searchElements.resultEl;
		var inputEl = options.searchElements.inputEl;
		var searchTimeoutId = 0;
		var oldValue = inputEl.val();
		var filterCategoryEl = quickSearchResults.find('.filter-category');

		function updateCategoryFilterName() {
			if (ajaxify.data.template.category) {
				require(['translator'], function (translator) {
					translator.translate(
						'[[search:search-in-category, ' + ajaxify.data.name + ']]',
						function (translated) {
							var name = $('<div></div>').html(translated).text();
							filterCategoryEl.find('.name').text(name);
						}
					);
				});
			}
			filterCategoryEl.toggleClass('hidden', !ajaxify.data.template.category);
		}

		function doSearch() {
			require(['search'], function (search) {
				/* eslint-disable-next-line */
				options.searchOptions = Object.assign({}, searchOptions);
				options.searchOptions.term = inputEl.val();
				updateCategoryFilterName();

				if (ajaxify.data.template.category) {
					if (filterCategoryEl.find('input[type="checkbox"]').is(':checked')) {
						options.searchOptions.categories = [ajaxify.data.cid];
						options.searchOptions.searchChildren = true;
					}
				}

				quickSearchResults
					.removeClass('hidden')
					.find('.quick-search-results-container')
					.html('');
				quickSearchResults.find('.loading-indicator').removeClass('hidden');
				$(window).trigger('action:search.quick.start', options);
				options.searchOptions.searchOnly = 1;
				search.api(options.searchOptions, function (data) {
					quickSearchResults.find('.loading-indicator').addClass('hidden');
					if (options.hideOnNoMatches && !data.posts.length) {
						return quickSearchResults
							.addClass('hidden')
							.find('.quick-search-results-container')
							.html('');
					}
					data.posts.forEach(function (p) {
						var text = $('<div>' + p.content + '</div>').text();
						var start = Math.max(
							0,
							text.toLowerCase().indexOf(inputEl.val().toLowerCase()) - 40
						);
						p.snippet = utils.escapeHTML(
							(start > 0 ? '...' : '') +
							text.slice(start, start + 80) +
							(text.length - start > 80 ? '...' : '')
						);
					});
					app.parseAndTranslate(
						'partials/quick-search-results',
						data,
						function (html) {
							if (html.length) {
								html.find('.timeago').timeago();
							}
							quickSearchResults
								.toggleClass('hidden', !html.length || !inputEl.is(':focus'))
								.find('.quick-search-results-container')
								.html(html.length ? html : '');
							var highlightEls = quickSearchResults.find(
								'.quick-search-results .quick-search-title, .quick-search-results .snippet'
							);
							search.highlightMatches(options.searchOptions.term, highlightEls);
							$(window).trigger('action:search.quick.complete', {
								data: data,
								options: options,
							});
						}
					);
				});
			});
		}

		quickSearchResults
			.find('.filter-category input[type="checkbox"]')
			.on('change', function () {
				inputEl.focus();
				doSearch();
			});

		inputEl.off('keyup').on('keyup', function () {
			if (searchTimeoutId) {
				clearTimeout(searchTimeoutId);
				searchTimeoutId = 0;
			}
			searchTimeoutId = setTimeout(function () {
				if (inputEl.val().length < 3) {
					quickSearchResults.addClass('hidden');
					oldValue = inputEl.val();
					return;
				}
				if (inputEl.val() === oldValue) {
					return;
				}
				oldValue = inputEl.val();
				if (!inputEl.is(':focus')) {
					return quickSearchResults.addClass('hidden');
				}
				doSearch();
			}, 250);
		});

		inputEl.on('blur', function () {
			setTimeout(function () {
				if (!inputEl.is(':focus')) {
					quickSearchResults.addClass('hidden');
				}
			}, 200);
		});

		inputEl.on('focus', function () {
			oldValue = inputEl.val();
			if (
				inputEl.val() &&
				quickSearchResults.find('#quick-search-results').children().length
			) {
				updateCategoryFilterName();
				quickSearchResults.removeClass('hidden');
				inputEl[0].setSelectionRange(0, inputEl.val().length);
			}
		});

		inputEl.off('refresh').on('refresh', function () {
			doSearch();
		});
	};

	app.handleSearch = function (searchOptions) {
		searchOptions = searchOptions || {
			in: 'titles',
		};
		var searchButton = $('#search-button');
		var searchFields = $('#search-fields');
		var searchInput = $('#search-fields input');
		var quickSearchContainer = $('#quick-search-container');

		$('#search-form .advanced-search-link')
			.off('mousedown')
			.on('mousedown', function () {
				ajaxify.go('/search');
			});

		$('#search-form')
			.off('submit')
			.on('submit', function () {
				searchInput.blur();
			});
		searchInput.off('blur').on('blur', dismissSearch);
		searchInput.off('focus');

		var searchElements = {
			inputEl: searchInput,
			resultEl: quickSearchContainer,
		};

		app.enableTopicSearch({
			searchOptions: searchOptions,
			searchElements: searchElements,
		});

		function dismissSearch() {
			setTimeout(function () {
				if (!searchInput.is(':focus')) {
					searchFields.addClass('hidden');
					searchButton.removeClass('hidden');
				}
			}, 200);
		}

		searchButton.off('click').on('click', function (e) {
			if (!config.loggedIn && !app.user.privileges['search:content']) {
				app.alert({
					message: '[[error:search-requires-login]]',
					timeout: 3000,
				});
				ajaxify.go('login');
				return false;
			}
			e.stopPropagation();

			app.prepareSearch();
			return false;
		});

		$('.featuredTopic').off('click').on('click', () => {
			app.log('featured marked');
		});

		$('#search-form')
			.off('submit')
			.on('submit', function () {
				var input = $(this).find('input');
				require(['search'], function (search) {
					var data = search.getSearchPreferences();
					data.term = input.val();
					$(window).trigger('action:search.submit', {
						searchOptions: data,
						searchElements: searchElements,
					});
					search.query(data, function () {
						input.val('');
					});
				});
				return false;
			});
	};

	app.prepareSearch = function () {
		$('#search-fields').removeClass('hidden');
		$('#search-button').addClass('hidden');
		$('#search-fields input').focus();
	};

	function handleStatusChange() {
		$('[component="header/usercontrol"] [data-status]')
			.off('click')
			.on('click', function (e) {
				var status = $(this).attr('data-status');
				console.log('This is status', status);
				socket.emit('user.setStatus', status, function (err) {
					if (err) {
						return app.alertError(err.message);
					}
					$(
						'[data-uid="' +
						app.user.uid +
						'"] [component="user/status"], [component="header/profilelink"] [component="user/status"]'
					)
						.removeClass('away online dnd offline')
						.addClass(status);
					$('[component="header/usercontrol"] [data-status]').each(function () {
						$(this)
							.find('span')
							.toggleClass('bold', $(this).attr('data-status') === status);
					});
					app.user.status = status;
				});
				e.preventDefault();
			});
	}

	app.updateUserStatus = function (el, status) {
		if (!el.length) {
			return;
		}

		require(['translator'], function (translator) {
			translator.translate('[[global:' + status + ']]', function (translated) {
				el.removeClass('online offline dnd away')
					.addClass(status)
					.attr('title', translated)
					.attr('data-original-title', translated);
			});
		});
	};

	app.newTopic = function (cid, tags) {
		$(window).trigger('action:composer.topic.new', {
			cid: cid || ajaxify.data.cid || 0,
			tags: tags || (ajaxify.data.tag ? [ajaxify.data.tag] : []),
		});
	};

	app.newQuiz = function (cid, tags) {
		$(window).trigger('action:composer.quiz.new', {
			cid: cid || ajaxify.data.cid || 0,
			tags: tags || (ajaxify.data.tag ? [ajaxify.data.tag] : []),
		});
	};

	app.loadJQueryUI = function (callback) {
		if (typeof $().autocomplete === 'function') {
			return callback();
		}
		require([
			'jquery-ui/widgets/datepicker',
			'jquery-ui/widgets/autocomplete',
			'jquery-ui/widgets/sortable',
			'jquery-ui/widgets/resizable',
			'jquery-ui/widgets/draggable',
		], function () {
			callback();
		});
	};

	app.showEmailConfirmWarning = function (err) {
		if (!config.requireEmailConfirmation || !app.user.uid) {
			return;
		}
		var msg = {
			alert_id: 'email_confirm',
			type: 'warning',
			timeout: 0,
		};

		if (!app.user.email) {
			msg.message = '[[error:no-email-to-confirm]]';
			msg.clickfn = function () {
				app.removeAlert('email_confirm');
				ajaxify.go('user/' + app.user.userslug + '/edit');
			};
			app.alert(msg);
		} else if (!app.user['email:confirmed'] && !app.user.isEmailConfirmSent) {
			msg.message = err ? err.message : '[[error:email-not-confirmed]]';
			msg.clickfn = function () {
				app.removeAlert('email_confirm');
				socket.emit('user.emailConfirm', {}, function (err) {
					if (err) {
						return app.alertError(err.message);
					}
					app.alertSuccess('[[notifications:email-confirm-sent]]');
				});
			};

			app.alert(msg);
		} else if (!app.user['email:confirmed'] && app.user.isEmailConfirmSent) {
			msg.message = '[[error:email-not-confirmed-email-sent]]';
			app.alert(msg);
		}
	};

	app.parseAndTranslate = function (template, blockName, data, callback) {
		require(['translator', 'benchpress'], function (translator, Benchpress) {
			if (typeof blockName !== 'string') {
				callback = data;
				data = blockName;
				blockName = undefined;
			}

			Benchpress.render(template, data, blockName)
				.then(rendered => translator.translate(rendered))
				.then(translated => translator.unescape(translated))
				.then(
					result => setTimeout(callback, 0, $(result)),
					err => console.error(err)
				);
		});
	};

	app.showCookieWarning = function () {
		require(['translator', 'storage'], function (translator, storage) {
			if (!config.cookies.enabled || !navigator.cookieEnabled) {
				// Skip warning if cookie consent subsystem disabled (obviously), or cookies not in use
				return;
			} else if (
				window.location.pathname.startsWith(config.relative_path + '/admin')
			) {
				// No need to show cookie consent warning in ACP
				return;
			} else if (storage.getItem('cookieconsent') === '1') {
				return;
			}

			config.cookies.message = translator.unescape(config.cookies.message);
			config.cookies.dismiss = translator.unescape(config.cookies.dismiss);
			config.cookies.link = translator.unescape(config.cookies.link);
			config.cookies.link_url = translator.unescape(config.cookies.link_url);

			app.parseAndTranslate(
				'partials/cookie-consent',
				config.cookies,
				function (html) {
					$(document.body).append(html);
					$(document.body).addClass('cookie-consent-open');

					var warningEl = $('.cookie-consent');
					var dismissEl = warningEl.find('button');
					dismissEl.on('click', function () {
						// Save consent cookie and remove warning element
						storage.setItem('cookieconsent', '1');
						warningEl.remove();
						$(document.body).removeClass('cookie-consent-open');
					});
				}
			);
		});
	};
	$(window).on('action:page.loaded', function () {
		console.log('action:page.loaded');
	});
	/**
	 * @author Deepansu
	 * @date 2022-01-31
	 * @description listening for route change event
	 *
	 */
	$(window).on('routeChange', function (e, data) {
		console.log(data);
		const url = new URL(location.origin + '/' + data.url);
		const prev = new URL(location.origin + '/' + data.previousUrl);
	});

	$('body').find('.mbNav').off('click').on('click', function () {
		function demo() {
			location.replace(config.relative_path + '/monitor');
		}
		if (window.href == config.relative_path + '/monitor') {
			location.reload();
		} else {
			demo().then(() => {
				location.reload();
			});
		}
	});

	function registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register(config.relative_path + '/assets/src/service-worker.js')
				.then(function () {
					console.info('ServiceWorker registration succeeded.');
				})
				.catch(function (err) {
					console.info('ServiceWorker registration failed: ', err);
				});
		}
	}
	((() => {
		$('.container-equal-h').each(function () {
			var highestBox = 0;
			$('.sdlms-section-body', this).each(function () {
				if ($(this).height() > highestBox) {
					highestBox = $(this).height();
				}
			});
			$('.sdlms-section-body', this).height(highestBox);
		});
	})());
	((() => {
		$('.sdlms-sections').each(function () {
			var highestBox = 0;
			$('[collapse-body]', this).each(function () {
				if ($(this).height() > highestBox) {
					highestBox = $(this).height();
				}
			});
			$('[collapse-body]', this).height(highestBox);
		});
	})());
	$('body').on('click', '.sdlms-section-header[collapse]', function (e) {
		if ($(e.target).attr('contenteditable') == 'true') return;
		$(this).next('[collapse-body]').slideToggle();
		$(this).find('[collapse-icon]').toggleClass('rotate');
		$(this).parents('.sdlms-section').toggleClass('section-collapsed');
	});
	$('body').on('click', '[collpsible] [collapse]', function (e) {
		if ($(e.target).attr('contenteditable') == 'true') return;
		$(this).parents('[collpsible]').first().find('[collapse-body]')
			.slideToggle();
		$(this).parents('[collpsible]').first().find('[collapse-icon]')
			.toggleClass('rotate');
	});
	$('body').on('click', '.sdlms-thread [collapse]', function (e) {
		if ($(e.target).attr('contenteditable') == 'true') return;
		$(this).parents('.sdlms-thread').first().find('[collapse-body]')
			.slideToggle();
		$(this).parents('.sdlms-thread').first().find('[collapse-icon]')
			.toggleClass('rotate');
	});
	$('body').on('click', 'sdlms-feedbacks [collapse]', function (e) {
		$(this).parents('sdlms-feedbacks').first().find('[collapse-body]')
			.slideToggle();
		$(this).parents('sdlms-feedbacks').first().find('[collapse-icon]')
			.toggleClass('rotate');
	});
	$('.sdlms-assets-tab').on('click', '.sdlms-asset-tab', function () {
		$('.sdlms-assets-tab').find('.sdlms-asset-tab').removeClass('active');
		$(this).addClass('active');
		$('.sdlms-assets-tab-content').removeClass('show active');
		$($(this).data('href')).addClass('show active');
	});
	$('[sdlms-component="session"],[sdlms-component="microscope"]').on('click', '[sdlms-search-toggle]', function () {
		$('[sdlms-asset-container]').toggleClass('sdlms-search-container-open');
		$('[sdlms-student-list]').toggleClass('col-md-4 sdlms-mw-150 col-md-1 collapsed');
		$('[student-assets] .sdlms-section-header').toggleClass('sdlms-text-white-18px sdlms-text-white-20px');
		$('[sdlms-asset-container]').toggleClass('col-md-12  sdlms-mw--150 col-md-8 expanded');
		$('[sdlms-asset-container]').find('[student-assets]').toggleClass('col-md-12 col-md-6');
		$('[sdlms-asset-container]').find('[members-assets]').toggleClass('sdlms-w-0');
	});
	app._template = (part, data = {}) => {
		const components = {
			studentSearch: () => ` <div class="sdlms-assets-selection-user-list" data-students-search data-fullname="${data.fullname}" data-displayname="${data.displayname}" data-username="${data.username}" data-uid="${data.uid}" data-is-teacher="${data.isTeacher}" data-role="${data.role}" >
				<div class="col-11 mx-auto">
					<div class="d-flex align-items-center py-2 justify-content-start">
						<img onerror="${app.IMG_ERROR()}" src="${data.picture}" class="rounded-circle" alt="" /><span class="sdlms-text-tertiary-16px text-ellipse font-weight-medium ml-3">${data.fullname || data.displayname || data.username}</span>
					</div>
				</div>
			</div>`,
		};
		return components[part]();
	};
	$('[sdlms-component="session"],[sdlms-component="microscope"]').on('input', '#search-student-bar', function () {
		const $searchelems = $('.sdlms-asset-container').find('.sdlms-assets-selection-user-list');
		let query = $(this).val();
		const tid = $(this).data('tid');
		const inQueue = $(this).data('inqueue') || false;
		const $this = $(this);
		query = $.trim(query);
		if (query) {
			$searchelems.removeClass('d-flex').addClass('d-none');
			$searchelems.each(function (index, element) {
				const data = $(element).data();
				let k = 0;
				$.each(data, function (i, e) {
					if (e) {
						e = String(e);
					}
					if (e && e.toLowerCase().includes(query.toLowerCase())) {
						k++;
					}
				});
				if (k) {
					$(element).addClass('d-flex').removeClass('d-none');
				}
			});
			if (!inQueue && tid && !$searchelems.filter(':visible').length) {
				$(this).data('inqueue', true);
				require(['api'], function (api) {
					api.get(`/sdlms/${tid}/attendance`, {
						limit: 50,
						query: query,
						key: 'fullname',
					}).then(function (res) {
						if (res.data.length) {
							$.each(res.data, function (index, data) {
								if (Array.isArray(window.students) && window.students.indexOf(student.uid) === -1) window.students.push(data);
								if (!$('.sdlms-asset-selection-user-body').find(`[data-students-search][data-uid="${data.uid}"]`).length) {
									$('body').find('.sdlms-asset-selection-user-body').append(app._template('studentSearch', data));
								}
							});
						}
					}).catch(function (err) {
						console.log(err);
					}).finally(function () {
						$this.data('inqueue', false);
					});
				});
			}
		} else {
			$searchelems.addClass('d-flex').removeClass('d-none');
		}
	});
	$('.sdlms-asset-selection-user-body').on('scroll', function () {
		const $this = $(this);
		if ($(this).data('next') && !$(this).data('inqueue') && (($(this).scrollTop()) >= $(this)[0].scrollHeight * 0.8)) {
			$this.data('inqueue', true);
			require(['api'], function (api) {
				api.get($(this).data('next'), {}).then(function (res) {
					if (res.data.length) {
						$.each(res.data, function (index, data) {
							if (Array.isArray(window.students) && window.students.indexOf(student.uid) === -1) window.students.push(data);
							if (!$('.sdlms-asset-selection-user-body').find(`[data-students-search][data-uid="${data.uid}"]`).length) {
								$('body').find('.sdlms-asset-selection-user-body').append(app._template('studentSearch', data));
							}
						});
					}
					$('.sdlms-asset-selection-user-body').data('next', res.next_page_url);
					$('.sdlms-asset-selection-user-body').data('prev', res.prev_page_url);
				}).catch(function (err) {
					console.log(err);
				}).finally(function () {
					$this.data('inqueue', false);
				});
			});
		}
	});
	$('[sdlms-component="session"],[sdlms-component="microscope"]').on('click', '[sdlms-toggle-members-list]', function () {
		$('[sdlms-toggle-members-list]').toggle();
		$('.assetSelectionDropDown').slideUp();
		$('[asset-selection-label]').off('click');
		$('[asset-selection-label]').removeClass('active');
		$('[asset-selection-label]').text('asset Selection').removeClass('visibility-shown');
		$('[sdlms-members-asset-view],[sdlms-search]').toggleClass('w-100 sdlms-w-0');
	});
	app.loader = (show, text = '') => {
		if (show) {
			$('body').append(`<div class="pageLoader"><div class="loader">
			<div class="divider" aria-hidden="true"></div>
			   <p class="loading-text" aria-label="Loading">
				 <span class="letter" aria-hidden="true">L</span>
				 <span class="letter" aria-hidden="true">o</span>
				 <span class="letter" aria-hidden="true">a</span>
				 <span class="letter" aria-hidden="true">d</span>
				 <span class="letter" aria-hidden="true">i</span>
				 <span class="letter" aria-hidden="true">n</span>
				 <span class="letter" aria-hidden="true">g</span>
			   </p>
		  </div>
		 </div>`);
			try {
				text = text.split('');
				if (text.length) {
					$('body').find('p.loading-text').append(`<span class="letter custom" aria-hidden="true" style="opacity:0">.</span>`);
				}
				$.each(text, function (i, e) {
					$('body').find('p.loading-text').append(` <span class="letter custom" aria-hidden="true">${e}</span>`);
				});
			} catch (error) {
				console.log(error);
			}
		} else {
			$('.pageLoader').remove();
		}
	};
	if (location.pathname.includes('live')) {
		app.loader(true, 'Class');
	} else if (location.pathname.includes('monitor')) {
		app.loader(true, 'Sessions');
	} else if (location.pathname.includes('postclass')) {
		app.loader(true, 'Sessions');
	}
	$('body').on('click', '.sdlms-menu', function () {
		$(this).toggleClass('active');
		$(this).find('.sdlms-menu-items').slideToggle();
	});
	$('body').on('click', '[sdlms-toggle-members-list]', function () {
		$(window).trigger('sdlms.asset.selection.change');
	});
	$(window).on('sdlms.asset.selection.change', function (e) {
		clearInterval(window.tbRereshInterval);
		clearInterval(window.ebRereshInterval);
	});
	$(document).mouseup(function (e) {
		var $container = $('.sdlms-menu');
		if (!$container.is(e.target) && $container.has(e.target).length === 0) {
			$container.find('.sdlms-menu-items').slideUp();
		}
	});


	/**
	 * @author @KRISHNA-git11
	 * @date 10 Feb 2022
	 * @description use this to add the Session details
	 * @function addSessionDetails
	 * @param schedule
	 */

	app.addSessionDetails = function (schedule, target, ended_on) {
		$('body').find(`.${target}`).append(`${app.dateFormatter(schedule, undefined)}<br/>${new Date(schedule).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(ended_on || (schedule + 3600000)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`);
	};
	app.dateFormatter = (date, format) => {
		var d = new Date(date);
		var formattedDate = d.toLocaleDateString(format, {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
		return formattedDate;
	};
	app.numberToAlphabates = (num) => {
		var s = '';
		var t;

		while (num > 0) {
			t = (num - 1) % 26;
			s = String.fromCharCode(65 + t) + s;
			num = (num - t) / 26 | 0;
		}
		return s || undefined;
	};

	$('body').on('click', '[js-action]', function () {
		location.href = $(this).attr('js-action');
	});

	app.truncate = (element, lines) => {
		var lineHeight = window.getComputedStyle(element)['line-height'];
		if (lineHeight === 'normal') {
			lineHeight = 1.16 * parseFloat(window.getComputedStyle(element)['font-size']);
		} else {
			lineHeight = parseFloat(lineHeight);
		}
		var content = $(element).text().split(' ');
		while (lines * lineHeight < element.clientHeight) {
			content.pop();
			element.innerHTML = content.join(' ') + '...';
		}
	};

	app._flbCopy = (text) => {
		var textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.top = '0';
		textArea.style.left = '0';
		textArea.style.position = 'fixed';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Fallback: Copying text command was ' + msg);
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}
		document.body.removeChild(textArea);
	};

	app.copyText = (text) => {
		if (!navigator.clipboard) {
			app._flbCopy(text);
			return;
		}
		navigator.clipboard.writeText(text).then(function () {
			notify('Copied to clipboard', 'success');
		}, function (err) {
			notify('Can not Copied to clipboard', 'danger');
			alert(text);
			console.error('Async: Could not copy text: ', err);
		});
	};
	app.isJSON = (item) => {
		item = typeof item !== 'string' ?
			JSON.stringify(item) :
			item;

		try {
			item = JSON.parse(item);
		} catch (e) {
			return false;
		}

		if (typeof item === 'object' && item !== null) {
			return true;
		}

		return false;
	};
	app.isParsableJSON = (item) => {
		try {
			JSON.parse(item);
		} catch (e) {
			return false;
		}
		return true;
	};
	app.timeFormatter = (time, template = '') => {
		const date = new Date(time);
		var intervals = [{
			label: 'year',
			seconds: 31536000,
		},
		{
			label: 'month',
			seconds: 2592000,
		},
		{
			label: 'day',
			seconds: 86400,
		},
		{
			label: 'hour',
			seconds: 3600,
		},
		{
			label: 'minute',
			seconds: 60,
		},
		{
			label: 'second',
			seconds: 1,
		},
		];

		function replace_string_placeholder($target, $replace) {
			const result = $target.replace(/#([^#]+)#/g, (match, key) => ($replace[key] !== undefined ? $replace[key] : ' '));
			return result;
		}
		var seconds = Math.floor((Date.now() - date.getTime()) / 1000);
		if (!seconds || seconds < 0) return 'Just now';
		var interval = intervals.find(i => i.seconds < seconds);
		if (!interval) return 'Few seconds ago';
		var count = Math.floor(seconds / interval.seconds);
		if (template) {
			return replace_string_placeholder(template, {
				time: count,
				Mins: interval.label,
			});
		}
		return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
	};
	app.setCookie = (name, value, days) => {
		var expires = '';
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie = name + '=' + (value || '') + expires + '; path=/';
	};
	app.getCookie = (name) => {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	};
	app.eraseCookie = (name) => {
		document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	};
	app.getQueryParams = (qs = window.location.href) => {
		qs = qs.split('+').join(' ');

		var params = {};
		var tokens;
		var re = /[?&]?([^=]+)=([^&]*)/g;

		while (tokens = re.exec(qs)) {
			params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
		}

		return params;
	};
	app.IMG_ERROR = () => `this.onerror=null;this.src='${app.v1_asset_url}/2022/04/TH_24567080_24594080_24596080_24601080_24563080_24565080_24588080_001.jpg';`;
	$('img').each(function () {
		$(this).attr('onerror', app.IMG_ERROR());
		$(this).attr('src', $(this).attr('src'));
	});
	app.removeCommonWords = (sentence) => {
		var common = app.common.words;
		var wordArr = sentence.match(/\w+/g);
		var commonObj = {};
		var uncommonArr = [];
		var word; var
			i;

		for (i = 0; i < common.length; i++) {
			commonObj[common[i].trim()] = true;
		}
		if (wordArr) {
			for (i = 0; i < wordArr.length; i++) {
				word = wordArr[i].trim().toLowerCase();
				if (!commonObj[word]) {
					uncommonArr.push(word);
				}
			}
		}

		return uncommonArr.join(' ');
	};
	// https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
	app.getRandom = (arr, n) => {
		var result = new Array(n);
		var len = arr.length;
		var taken = new Array(len);
		if (n > len) throw new RangeError('getRandom: more elements taken than available');
		while (n--) {
			var x = Math.floor(Math.random() * len);
			result[n] = arr[x in taken ? taken[x] : x];
			taken[x] = --len in taken ? taken[len] : len;
		}
		return result;
	};
	app.splitTimeIntoInterval = (startTime, endTime, interval) => {
		startTime = moment(startTime);
		endTime = moment(endTime);
		interval = interval / 60;
		const result = [startTime.toString()];
		let time = startTime.add(interval, 'm');
		while (time.isBetween(startTime, endTime, undefined, [])) {
			result.push(time.toString());
			time = time.add(interval, 'm');
		}
		return result;
	}
	app.splitTimeIntoChunks = (startTime, endTime, numberOfIntervals) => {
		startTime = moment(startTime);
		endTime = moment(endTime);

		let diff = endTime.valueOf() - startTime.valueOf();
		let intervalLength = diff / numberOfIntervals;
		let intervals = [];
		for (let i = 1; i <= numberOfIntervals; i++)
			intervals.push(new Date(startTime.valueOf() + i * intervalLength))
		return intervals;

	}
	app.isHTML = (str) => {

		try {
			const fragment = document.createRange().createContextualFragment(str);
			fragment.querySelectorAll('*').forEach(el => el.parentNode.removeChild(el));
			return !(fragment.textContent || '').trim();
		} catch (error) {
			console.log(error);
			return false;
		}
	};
	app.htmltoText = (html = "") => {
		let text = html;
		text = text.replace(/\n/gi, "");
		text = text.replace(/<style([\s\S]*?)<\/style>/gi, "");
		text = text.replace(/<script([\s\S]*?)<\/script>/gi, "");
		text = text.replace(/<a.*?href="(.*?)[\?\"].*?>(.*?)<\/a.*?>/gi, " $2 $1 ");
		text = text.replace(/<\/div>/gi, "\n\n");
		text = text.replace(/<\/li>/gi, "\n");
		text = text.replace(/<li.*?>/gi, "  *  ");
		text = text.replace(/<\/ul>/gi, "\n\n");
		text = text.replace(/<\/p>/gi, "\n\n");
		text = text.replace(/<br\s*[\/]?>/gi, "\n");
		text = text.replace(/<[^>]+>/gi, "");
		text = text.replace(/^\s*/gim, "");
		text = text.replace(/ ,/gi, ",");
		text = text.replace(/ +/gi, " ");
		text = text.replace(/\n+/gi, "\n\n");
		return text;
	};
	app.processString = (str = '', doNotEscapeHTML = false) => {
		if (!str) return '';
		else if (doNotEscapeHTML) return `<pre><code>${str}</code></pre>`;
		else return app.htmltoText(str);
	}
	app.wordCloud = ($target, sentence) => {

		let words = ['Social', 'Learnings', 'Loyalty', 'Respect', 'Response', 'Holistic', 'Growth', 'Fairness', 'Resourceful', 'Authenticity', 'Courage', 'Innovative', 'Energetic', 'Disciplin', 'Reliability', 'Optimism', 'Secure', 'Polite', 'Young', 'Ideas'];
		let weights = [40, 39, 11, 27, 36, 39, 12, 27, 36, 22, 40, 39, 11, 27, 36, 39, 12, 27, 80, 22]
		sentence = app.removeCommonWords(sentence);
		sentence = sentence.replace(/\s\s+/g, ' ');
		sentence = sentence.split(' ');
		sentence = [...new Set(sentence)];
		if (sentence.length < 20) {
			const remain = 20 - sentence.length;
			sentence = [...sentence, ...app.getRandom(words, remain)];
		}

		const newWords = [];

		app.getRandom(sentence, 20).forEach((word, index) => {
			newWords.push({
				word: word,
				weight: weights[index],
				color: app.random.colors.random(),
			});
		});
		var style = getComputedStyle(document.body);
		const fonts = style.getPropertyValue('--sdlms-font-family-poppins');
		$target.jQWCloud({
			words: newWords,
			cloud_font_family: fonts
		});
	};
	app.getDayTimeStamp = (timestamp) => {

		return moment(timestamp).startOf('day').valueOf()
	};
	app.isValidURL = (string) => {
		var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z0-9]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
		return (res !== null)
	};
	app.getFileExtension = (path) => {
		if (!path) return '';
		var basename = path.split(/[\\/]/).pop(), // extract file name from full path ...							   // (supports `\\` and `/` separators)
			pos = basename.lastIndexOf("."); // get last position of `.`
		if (basename === "" || pos < 1) // if file name is empty or ...
			return ""; //  `.` not found (-1) or comes first (0)

		return basename.slice(pos + 1); // extract extension ignoring `.`
	}

	((() => {
		var url_string = window.location.href;
		var url = new URL(url_string);
		var share_redirect = url.searchParams.get('share_redirect');
		var share_redirect_url = url.searchParams.get('url');
		if (share_redirect && share_redirect_url) {
			app.setCookie('share_redirect', share_redirect_url, 1);
		}
	})());
}());
