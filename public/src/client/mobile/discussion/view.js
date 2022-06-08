"use strict";

/* globals define */

define("forum/mobile/discussion/view", function () {
	var view = {};

	view.init = function () {
		// variables
		let threadSelected = false;
		let replyMode = false;
		let newId = 100;
		let holdStart = isMobile() ? "touchstart" : "mousedown";
		let holdStop = isMobile() ? "touchend" : "mouseup";

		let menuBtn = document.querySelector("#menu-btn");

		// getting tid of room from url
		let url = $(location).attr("href");
		let roomTid = url.split("/")[url.split("/").length - 1];

		// chat template
		const _template = {
			chat: function (data) {
				if (app.user.uid == data.fromUser.uid) {
					return `<div class="chat-row outgoing" id=${data.mid ? data.mid : data.messageId} uid=${data.fromUser.uid}>
								<div>
									<p class="font-10 mb-0">
										Me
									</p>
									<div class="chat">
										<p class="mb-0 font-12">${data.cleanedContent}</p>
									</div>
								</div>
								<img src="${data.fromUser.picture}"
									alt="man 2" class="circle-sm rounded-circle img-cover">
							</div>`;
				} else {
					return `<div class="chat-row incoming" id=${data.mid ? data.mid : data.messageId} uid=${data.fromUser.uid}>
								<img src="${data.fromUser.picture}"
								alt="man 2" class="circle-sm rounded-circle img-cover">
								<div>
									<p class="font-10 mb-0">
										${data.fromUser.displayname}
									</p>
									<div class="chat">
										<p class="mb-0 font-12">${data.cleanedContent}</p>
									</div>
								</div>
							</div>`;
				}
			},
			chatReply: function (data) {
				if (app.user.uid == data.uid) {
					return `<div class="chat-row outgoing" id=${data.mid ? data.mid : data.messageId} uid=${data.uid}>
								<div>
									<p class="font-10 mb-0">
										Me
									</p>
									<div class="chat">
										<div class="reply mb-1" pointer=${data.pointer}>
												<p class="font-12 mb-0">${data.orgText}</p>
										</div>
										<p class="mb-0 font-12">${data.replyText}</p>
									</div>
								</div>
								<img src="${data.picture}"
									alt="man 2" class="circle-sm rounded-circle img-cover">
							</div>`;
				} else {
					return `<div class="chat-row incoming" id=${data.mid ? data.mid : data.messageId} uid=${data.uid}>
								<img src="${data.picture}"
								alt="man 2" class="circle-sm rounded-circle img-cover">
								<div>
									<p class="font-10 mb-0">
										${data.displayname}
									</p>
									<div class="chat">
										<div class="reply mb-1" pointer=${data.pointer}>
												<p class="font-12 mb-0">${data.orgText}</p>
										</div>
										<p class="mb-0 font-12">${data.replyText}</p>
									</div>
								</div>
							</div>`;
				}
			},
			rule: function (data) {
				return `<li>${data}</li>`;
			},
			article: function (data) {
				return `<img src="${data.image}"
									alt="article-img" class="circle-md rounded-circle mr-2 img-cover">
						<div class="w-75">
							<p class="font-14 mb-0">${data.title}</p>
							<p class="font-10 brand-text mb-0">${moment(data.timestamp).format(
					"ddd Do MMM, YYYY"
				)}</p>
							<p class="mt-1 font-10 text-secondary mb-0 truncate-line-2">${app.htmltoText(
					data.content
				)}</p>
						</div>`;
			},
		};

		// function to render article
		function renderArticle(pid) {
			doAjax({
				type: "POST",
				url: `/app/getarticles?pid=${pid}`,
				method: "POST",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({}),
			}).then(function (res) {
				$("#article-container").append(_template.article(res.response.data));
			});
		}

		// function to check if device is mobile
		function isMobile() {
			var check = false;
			(function (a) {
				if (
					/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
						a
					) ||
					/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
						a.substr(0, 4)
					)
				) {
					check = true;
				}
			})(navigator.userAgent || navigator.vendor || window.opera);

			return check;
		}

		// deselect chat if click outside selected chat
		$("body").on("click", function (e) {
			let eventTarget = $(e.target);
			let eventParent = $(e.target).parent();

			// check if user clicks outside menu options, text field or any chat and remove selected
			if (
				!$.contains($("#menu-btn")[0], e.target) &&
				!$.contains($("#participant-options-selected")[0], e.target) &&
				!$.contains($("#mod-options-selected")[0], e.target) &&
				!$.contains($("#reply-selected")[0], e.target) &&
				!$.contains($("#chatbox")[0], e.target) &&
				!eventTarget.hasClass("chat") &&
				!eventParent.hasClass("chat")
			) {
				$(".chat.tertiary-border").removeClass("tertiary-border");
				threadSelected = false;
			}
		});

		// select chat on click
		$("#wrapper").on(holdStart, ".chat", function () {
			let that = $(this);
			setTimeout(() => {
				threadSelected = true;
				$(".chat.tertiary-border").removeClass("tertiary-border");
				that.addClass("tertiary-border");
				// clearInterval(i);
			}, 500);
		});

		// hide intro boxes if chats exist
		if ($(".chat-row").length > 0) {
			$("#intro-boxes").addClass("d-none");
		}

		// append received chat
		socket.on('event:chats.receive', function (data) {
			if (data.message.cleanedContent.split("||").length == 1) {
				$("#wrapper").append(_template.chat(data.message));
			} else {
				let pointer = data.message.cleanedContent.split("||")[0];
				let orgText = data.message.cleanedContent.split("||")[1];
				let replyText = data.message.cleanedContent.split("||")[2];

				let replyData = {
					pointer: pointer,
					orgText: orgText,
					replyText: replyText,
					uid: data.message.fromUser.uid,
					picture: data.message.fromUser.picture,
					mid: data.message.mid,
					displayname: data.message.fromUser.displayname,
				}

				$("#wrapper").append(_template.chatReply(replyData));
			}

			$("html, body").animate({ scrollTop: $(document).height() }, 100);
		})

		// chat append
		$("#wrapper").on("submit", "#chatbox", function (e) {
			e.preventDefault();
			let $this = $("#chat-input");
			let text = $this.val();
			if (!text.trim()) {
				return console.log("empty");
			}
			newId++;

			// if replying
			if (replyMode) {
				let pointer = $(".chat.tertiary-border").parent().parent().attr("id");
				let orgText = $(`.chat.tertiary-border > p`).text();

				let message = `${pointer}||${orgText}||${text}`;

				socket.emit('modules.chats.send', {
					roomId: roomTid,
					message: message,
				}, function (err) {
					if (err) {
						return console.log(err)
					}
				});

				replyMode = false;
				$(".chat.tertiary-border").removeClass("tertiary-border");
			}

			// else
			else {
				socket.emit('modules.chats.send', {
					roomId: roomTid,
					message: text,
				}, function (err) {
					if (err) {
						return console.log(err)
					}
				});
			}

			$this.val("");
		});

		// scroll on reply click
		$("body").on("click", ".reply", function () {
			let scrollId = $(this).attr("pointer");
			$(`#${scrollId}`)[0].scrollIntoView({
				behavior: "auto",
				block: "center",
				inline: "center",
			});
		});

		document
			.querySelector("#close-article")
			.addEventListener("click", () =>
				document.querySelector("#room-article-text").classList.add("d-none")
			);

		document
			.querySelector("#close-rules")
			.addEventListener("click", () =>
				document.querySelector("#room-rules-text").classList.add("d-none")
			);

		// open attachments menu
		$("body").on("click", "#attachments-btn", () =>
			$(".attachments-menu").removeClass("d-none")
		);

		// close menus
		$("body").on("click", function (event) {
			if (!$.contains($("#attachments-btn")[0], event.target))
				$(".attachments-menu").addClass("d-none");
			if (!$.contains($("#menu-btn")[0], event.target)) {
				$("#participant-options-selected").addClass("d-none");
				$("#participant-options").addClass("d-none");
				$("#mod-options-selected").addClass("d-none");
				$("#mod-options").addClass("d-none");
				$("#menu-btn").removeClass("d-none");
			}
		});

		// getting room details and rendering them
		doAjax({
			type: "POST",
			url: "/app/getroom",
			method: "POST",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({
				roomId: [roomTid],
			}),
		}).then(function (res) {
			doAjax({
				type: 'POST',
				url: "/app/loadroom",
				method: "POST",
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					roomId: roomTid,
				}),
			}).then(function (response) {
				console.log(response);

				if (response.response.messages.length != 0) $("#intro-boxes").addClass("d-none")

				for (let index = 0; index < response.response.messages.length; index++) {
					const message = response.response.messages[index];

					if (message.cleanedContent.split("||").length == 1) {
						$("#wrapper").append(_template.chat(message));
					} else {
						let pointer = message.cleanedContent.split("||")[0];
						let orgText = message.cleanedContent.split("||")[1];
						let replyText = message.cleanedContent.split("||")[2];

						let replyData = {
							pointer: pointer,
							orgText: orgText,
							replyText: replyText,
							uid: message.fromUser.uid,
							picture: message.fromUser.picture,
							mid: message.mid,
							displayname: message.fromUser.displayname,
						}

						$("#wrapper").append(_template.chatReply(replyData));
					}
				}

				$("html, body").animate({ scrollTop: $(document).height() }, 100);
			})

			let isMod;

			$("#room-title").text(res.response.name);
			$("#room-img").attr("src", res.response.image);
			res.response.rules
				.split("\n")
				.map((rule) => $("#rules-list").append(_template.rule(rule)));

			// render article if attached
			res.response.attachment_id ? renderArticle(res.response.attachment_id) : $("#room-article-text").addClass("d-none");

			let modList = res.response.moderators.split(",").map((uid) => {
				return parseInt(uid, 10);
			});

			modList.push(res.response.owner)

			$.inArray(app.user.uid, modList) == -1 ? isMod = false : isMod = true;

			// participant specific functionality if not mod
			if (isMod == false) {
				let participantOptions = document.querySelector("#participant-options");
				let participantOptionsSelected = document.querySelector(
					"#participant-options-selected"
				);

				// check menu
				menuBtn.addEventListener("click", () => {
					if (threadSelected) openMenuSelected();
					else openMenu();
				});

				// open menu function
				function openMenu() {
					menuBtn.classList.add("d-none");
					participantOptions.classList.remove("d-none");

					document
						.querySelector("#saved-threads")
						.addEventListener("click", () =>
							ajaxify.go(`/mobile/discussion/saved?tid=${roomTid}&uid=${app.user.uid}`)
						);

					// open and close search threads box
					document
						.querySelector("#search-thread")
						.addEventListener("click", () => {
							document
								.querySelector("#search-thread-box")
								.classList.remove("d-none");
							document.querySelector("#dr-header").classList.add("d-none");
						});

					document
						.querySelector("#close-search")
						.addEventListener("click", () => {
							document
								.querySelector("#search-thread-box")
								.classList.add("d-none");
							document.querySelector("#dr-header").classList.remove("d-none");
						});

					document
						.querySelector("#mod-list")
						.addEventListener("click", () =>
							ajaxify.go(`/mobile/discussion/modlist?tid=${roomTid}`)
						);

					document
						.querySelector("#dr-rules")
						.addEventListener("click", () =>
							ajaxify.go(`/mobile/discussion/rules?tid=${roomTid}`)
						);

					// leave modal
					$("#leave-room").on("click", function () {
						$("#leave-room-modal").modal("show");
					});

					$("#cancel-leave").on("click", function () {
						$("#leave-room-modal").modal("hide");
					});

					$("#leave-final").on("click", () => {
						$("#leave-room-modal").modal("hide");
						$("#leave-room-modal").removeClass("show");

						doAjax({
							type: 'POST',
							url: "/app/removeuser",
							method: "POST",
							dataType: 'json',
							contentType: 'application/json',
							data: JSON.stringify({
								roomId: roomTid,
								uids: [app.user.uid],
							}),
						}).then(function (response) {
							console.log(response);
						})
					})

					// sidebar toggle
					$("#highlighted-threads").on("click", function (e) {
						e.preventDefault();
						$("#wrapper").toggleClass("toggled");
						$("#dr-header").toggleClass("d-none");
					});
				}

				// open menu seleceted
				function openMenuSelected() {
					menuBtn.classList.add("d-none");
					participantOptionsSelected.classList.remove("d-none");

					document
						.querySelector("#reply-selected")
						.addEventListener("click", () => {
							document.querySelector("#chat-input").focus();
							replyMode = true;
						});

					$("#report-selected").on("click", () => reportThread());
				}

				$("#close-highlighted").on("click", () => {
					$("#wrapper").addClass("toggled");
					$("#dr-header").toggleClass("d-none");
				});

				// report thread function
				function reportThread() {
					$("#report-thread-modal").modal("show");

					$("#cancel-report").on("click", () => {
						$(".chat.tertiary-border").removeClass("tertiary-border");
						$("#report-thread-modal").modal("hide");
					});

					$("#report-final").on("click", function () {
						$(".chat.tertiary-border").removeClass("tertiary-border");
						$("#report-thread-modal").modal("hide");
					});
				}
			} else {
				$("body").on("click", "#menu-btn", function () {
					if (!threadSelected) {
						$("#mod-options").removeClass("d-none");
						$("#menu-btn").addClass("d-none");
					} else {
						$("#menu-btn").addClass("d-none");
						$("#mod-options-selected").removeClass("d-none")
					}
				})

				$("#mod-options > #saved-threads").on("click", () => ajaxify.go(`/mobile/discussion/saved?mod=true&uid=${app.user.uid}&tid=${roomTid}`));

				$("#mod-options > #search-thread").on("click", () => $("#search-thread-box").removeClass("d-none"));

				$("#close-search").on("click", () => $("#search-thread-box").addClass("d-none"));

				$("#mod-options > #mod-list").on("click", () => ajaxify.go(`/mobile/discussion/modlist?tid=${roomTid}`));

				$("#mod-options > #mod-list").on("click", () => ajaxify.go(`/mobile/discussion/modlist?mod=true&tid=${roomTid}`));

				$("#mod-options > #dr-rules").on("click", () => ajaxify.go(`/mobile/discussion/rules?mod=true&tid=${roomTid}`));

				$("#mod-options > #highlighted-threads").on("click", () => {
					$("#wrapper").removeClass("mod-toggled");
					$("#dr-header").addClass("d-none");
					$("#dr-footer").addClass("d-none");
				});

				$("#mod-sidebar-wrapper #close-highlighted").on("click", () => {
					$("#wrapper").addClass("mod-toggled");
					$("#dr-header").removeClass("d-none");
					$("#dr-footer").removeClass("d-none");
				})

				$("#mod-options > #reported-threads").on("click", () => ajaxify.go(`/mobile/discussion/reported`));

				$("#mod-options > #leave-room").on("click", () => {
					$("#leave-room-modal").modal("show");
					$("#leave-room-modal").addClass("show");
				});

				$("#cancel-leave").on("click", () => {
					$("#leave-room-modal").modal("hide");
					$("#leave-room-modal").removeClass("show");
				})

				$("#leave-final").on("click", () => {
					$("#leave-room-modal").modal("hide");
					$("#leave-room-modal").removeClass("show");

					doAjax({
						type: 'POST',
						url: "/app/removeuser",
						method: "POST",
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify({
							roomId: roomTid,
							uids: [app.user.uid],
						}),
					}).then(function (response) {
						console.log(response);
					})
				})

				$("#mod-options-selected > #reply-selected").on("click", () => {
					document.querySelector("#chat-input").focus();
					replyMode = true;
				})

				$("#mod-options-selected > #delete-selected").on("click", () => {
					$("#delete-thread-modal").modal("show");
					$("#delete-thread-modal").addClass("show");
				})

				$("#cancel-delete").on("click", () => {
					$("#delete-thread-modal").modal("hide");
					$("#delete-thread-modal").removeClass("show");
				})

				$("#delete-final").on("click", () => {
					let messageId = $($(".chat.tertiary-border").parents(".chat-row")[0]).attr("id");

					doAjax({
						type: 'POST',
						url: "/app/deletemessage",
						method: "POST",
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify({
							mid: messageId
						}),
					}).then(function (response) {
						$("#delete-thread-modal").modal("hide");
						$("#delete-thread-modal").removeClass("show");

						$(`#${messageId}`).addClass("d-none");
					})
				})

				$("#mod-options-selected > #remove-selected").on("click", () => {
					$("#remove-user-modal").modal("show");
					$("#remove-user-modal").addClass("show");
				})

				$("#cancel-remove").on("click", () => {
					$("#remove-user-modal").modal("hide");
					$("#remove-user-modal").removeClass("show");
				})

				$("#remove-final").on("click", () => {
					userUid = $($(".chat.tertiary-border").parents(".chat-row")[0]).attr("uid");

					if (userUid != app.user.uid) {
						doAjax({
							type: 'POST',
							url: "/app/removeuser",
							method: "POST",
							dataType: 'json',
							contentType: 'application/json',
							data: JSON.stringify({
								roomId: roomTid,
								uids: [$($(".chat.tertiary-border").parents(".chat-row")[0]).attr("uid")]
							}),
						}).then(function (response) {
							$("#remove-user-modal").modal("hide");
							$("#remove-user-modal").removeClass("show");
						})
					} else {
						alert("remove?! that's you!!!");

						$("#remove-user-modal").modal("hide");
						$("#remove-user-modal").removeClass("show");
					}
				})
			}
		});

	};

	return view;
});
