'use strict';

/* globals define */

define('forum/mobile/message/chat', function () {
	var chat = {};

	function groupByDay(scroll = true) {
		var groups = {};
		var getDateLabel = (timestamp) => {
			let yesterday = moment().add(-1, 'day').startOf('day').valueOf();
			let today = moment().startOf('day').valueOf();
			let timestampDay = moment(timestamp).startOf('day').valueOf();
			if (timestampDay == today) return 'Today';
			if (timestampDay == yesterday) return 'Yesterday';
			else return moment(timestampDay).format('MMM DD, YYYY')
		}
		$('#chats > .chat-row[data-day]').each(function () {
			var className = this.className.match(/(day\d+)/)[1],
				time = $(this).data('day');
			if ($(`.group-${className}`).length) groups[className] = $(`.group-${className}`);
			var $group = groups[className];
			let date = getDateLabel(time);
			if (!$group) {
				$group = $('<div />', {
					'class': `message-date-group group-${className} ${date.toLocaleLowerCase()}`,
					'data-day': date
				}).insertAfter(this);
				groups[className] = $group;
				if (!$('.message-chat-date.today').length) {
					$(chat._templates.dateEntry(date)).insertBefore($group);
				}

			}
			$group.append(this);
		});
	}

	function processMessage(message, old) {

		message.class = message.self ? 'outgoing' : 'incoming';
		let fileType = app.getFileTypeByURL(location.origin + message.content);
		let template = 'message';
		if (fileType) template = fileType;
		$('#chats')[old ? 'prepend' : 'append']((typeof chat._templates[template] == 'function') ? chat._templates[template](message) : chat._templates['message'](message));

	}
	chat.init = function () {

		let newId = 1;


		let sender = ajaxify.data.users[0];
		$('#profile-info').html(`
			<div class="d-flex align-items-center">
				<div class="profile-pic mr-2">
					<img onerror="${app.IMG_ERROR()}"  src="${sender.picture}" alt="profile-info" class="img-cover circle-sm rounded-circle">
				</div>
				<h2 class="font-14 font-medium mb-0">${sender.fullname || sender.displayname || sender.username}</h2>
			</div>`)

		$.each(ajaxify.data.messages, function (index, message) {
			processMessage(message);
		});
		window.scrollTo(0, document.body.scrollHeight);
		groupByDay();
		socket.emit('modules.chats.markRead', ajaxify.data.roomId);
		chat.events();




		const dropDown = document.querySelector("#dropdown");
		const dropDownAction = document.querySelectorAll(
			'.dropdown-content__action'
		);
		const dropDownHold = document.querySelectorAll('.dropdown-content__hold');
		const settingsIcon = document.querySelector('.settings-icon');

		const attachmentBtn = document.querySelector('#attachments-btn');
		const attachmentMenu = document.querySelector('.attachments-menu');




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

		$('body').on('click', function (event) {
			if (
				attachmentMenu.contains(event.target) ||
				attachmentBtn.contains(event.target)
			) attachmentMenu.classList.remove('d-none');
			else attachmentMenu.classList.add('d-none');
		});

		$(".back-icon").on(
			"click",
			() => {
				window.location.pathname = "/mobile/message/list";
			}
		);

		$("body").on('change', '[name="files"]', function (e) {
			let formData = new FormData();
			let $that = this;

			if (!window.FileReader) {
				console.log("The file API isn't supported on this browser yet.");
				return;
			}
			if (!$that) {
				console.error("This browser doesn't seem to support the `files` property of file inputs.");
				return;
			}
			var file = $that.files[0];
			if (!file) {
				console.log("Please select a file before clicking 'Load'");
				return;
			}

			let size = file.size / 1024 / 1024;
			if (size > 5) {
				return alert("File size must be less than 5MB");
			}
			console.log(file);
			console.log(app.getFileTypeByURL(file.name, true));
			if (!app.getFileTypeByURL(file.name, true)) return alert("File type is not supported");

			formData.append("files[files]", file);

			doAjax({
				url: '/app/uploadfile',
				type: "POST",
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
			}).then((res) => {
				console.log(res.response);
				sendMessage(res.response.files);
				$that.value = "";
			}).catch((err) => {

			}).finally(() => {

			})
		});

		$("body").on("submit", "#message-input", function (e) {
			e.preventDefault();
			let message = $("#chat-input").val();
			if (message.trim()) sendMessage(message);
			$("#chat-input").val("");
		});

		function sendMessage(message) {
			if (!message) return;
			socket.emit('modules.chats.send', {
				roomId: ajaxify.data.roomId,
				message: message,
			}, function (err) {
				if (err) {
					return console.log(err)
				}
			});
		}
		$("body").on("click", ".chat > img", function () {
			$("#modalImg").attr("src", $(this).attr("src"));
			$("#imageModal").modal("show");
		});
		socket.on('event:chats.receive', function (data) {
			if (parseInt(data.roomId, 10) === parseInt(ajaxify.data.roomId, 10)) {
				var newMessage = data.self === 0;
				data.message.self = data.self;
				if (!$('#chats .message-date-group.today').length) {
					$('#chats').append($('<div />', {
						'class': `message-date-group today`,
						'data-day': 'Today'
					}).append(chat._templates.dateEntry('Today')))
				}
				processMessage(data.message);
				groupByDay();
				window.scrollTo(0, 999999);
			}
		});
	};
	chat.events = function () {
		$(window).on('scroll', function () {
			console.log($(window).scrollTop());
			if (!chat.loadingChats) {
				var doc = document.documentElement;
				let scrollableHeight = doc.scrollHeight - window.innerHeight;
				var topScroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
				let scPercent = (topScroll / scrollableHeight) * 100;
				if (scPercent < 5) {
					console.log(chat.loadingChats)
					chat.loadingChats = 1;
					socket.emit('modules.chats.getMessages', {
						roomId: ajaxify.data.roomId,
						uid: app.user.uid,
						start: ($('#chats').find('.chat-row').length + 1)
					}, function (err, messages) {
						chat.loadingChats = 0;
						if (messages) {
							messages = messages.reverse();
							$.each(messages, function (index, message) {
								processMessage(message, true);
							});

							groupByDay(false)
						}
					})
				}
			}
		})
	};
	chat._templates = {
		message: function (data) {
			return `<div class="chat-row ${data.system ? 'postion-absolute' : ''} ${data.class} day${app.getDayTimeStamp(data.timestamp)}" data-day="${app.getDayTimeStamp(data.timestamp)}">
				<div class="chat mb-1" >
					<p class="mb-0">${data.content}</p>
				</div>
			</div>`
		},
		image: function (data) {
			return `<div class="chat-row  ${data.class} day${app.getDayTimeStamp(data.timestamp)}" data-day="${app.getDayTimeStamp(data.timestamp)}">
				<div class="chat mb-1" >
					<img src="${data.content}" alt="" class="circle-lg img-cover">
					
				</div>
			</div>`
		},
		audio: function (data) {
			return `<div class="chat-row  ${data.class} day${app.getDayTimeStamp(data.timestamp)}" data-day="${app.getDayTimeStamp(data.timestamp)}">
				<div class="chat mb-1" >
				   <audio controls>
				    <source src="${data.content}" type="audio/mpeg">
				  	Your browser does not support the audio element.
				  </audio>
				 
				</div>
			</div>`
		},
		video: function (data) {
			return `<div class="chat-row  ${data.class} day${app.getDayTimeStamp(data.timestamp)}" data-day="${app.getDayTimeStamp(data.timestamp)}">
				<div class="chat mb-1" >
				   <video controls>
				    <source src="${data.content}" type="video/mp4">
				  	Your browser does not support the audio element.
				  </video>
				 
				</div>
			</div>`
		},
		pdf: function (data) {
			return `<div class="chat-row  ${data.class} day${app.getDayTimeStamp(data.timestamp)}" data-day="${app.getDayTimeStamp(data.timestamp)}">
				<div class="chat mb-1" >
				  ${chat._templates.download(data, data.content)}
				</div>
			</div>`
		},
		download: function (data, name) {
			return `<div class="w-100 d-flex justify-content-end" ><a href="${data.content}" download="">${name || 'Download'}</a></div>`
		},
		// audio tag


		dateEntry: function (date) {
			return `<div class="d-flex message-chat-date ${date.toLocaleLowerCase()} justify-content-center mt-2 font-10">
				<p class="mb-0">${date}</p>
			</div>`
		},
	}

	return chat;
});
