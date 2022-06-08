"use strict";

/* globals define */

define("forum/mobile/discussion/view_mod", function () {
	var view = {};

	view.init = function () {
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

		// variables
		let threadSelected = false;
		let replyMode = false;

		let menuBtn = document.querySelector("#menu-btn");
		let attachmentsBtn = document.querySelector("#attachments-btn");
		let participantOptions = document.querySelector("#participant-options");
		let participantOptionsSelected = document.querySelector(
			"#participant-options-selected"
		);
		let attachmentsMenu = document.querySelector(".attachments-menu");

		// check selected
		// $("#wrapper").on("click", ".chat", function (e) {
		//   $(".chat.tertiary-border").removeClass("tertiary-border");
		//   $(this).addClass("tertiary-border");
		//   threadSelected = true;
		// });

		// check menu
		menuBtn.addEventListener("click", () => {
			if (threadSelected) openMenuSelected();
			else openMenu();
		});

		// check attachments
		attachmentsBtn.addEventListener("click", () =>
			attachmentsMenu.classList.remove("d-none")
		);

		// open menu function
		function openMenu() {
			menuBtn.classList.add("d-none");
			participantOptions.classList.remove("d-none");

			document
				.querySelector("#saved-threads")
				.addEventListener(
					"click",
					() => (document.location.href = "dr-saved.html")
				);

			// open and close search threads box
			document.querySelector("#search-thread").addEventListener("click", () => {
				document.querySelector("#search-thread-box").classList.remove("d-none");
				document.querySelector("#dr-header").classList.add("d-none");
			});

			document.querySelector("#close-search").addEventListener("click", () => {
				document.querySelector("#search-thread-box").classList.add("d-none");
				document.querySelector("#dr-header").classList.remove("d-none");
			});

			document
				.querySelector("#mod-list")
				.addEventListener(
					"click",
					() => (document.location.href = "dr-mods-mod.html")
				);

			document
				.querySelector("#dr-rules")
				.addEventListener(
					"click",
					() => (document.location.href = "dr-rules-mod.html")
				);

			document
				.querySelector("#reported-threads")
				.addEventListener(
					"click",
					() => (document.location.href = "dr-reported.html")
				);

			// leave modal
			$("#leave-room").on("click", function () {
				$("#leave-room-modal").modal("show");
			});

			$("#cancel-leave").on("click", function () {
				$("#leave-room-modal").modal("hide");
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

			document
				.querySelector("#delete-selected")
				.addEventListener("click", () => deleteThread());

			document
				.querySelector("#remove-selected")
				.addEventListener("click", () => removeUser());
		}

		// close menus check
		window.onload = function () {
			document.onclick = function (e) {
				if (e.target.id !== "menu-btn") {
					//element clicked wasn't the div; hide the div
					if (participantOptions.classList.contains("d-none") == false) {
						participantOptions.classList.add("d-none");
						menuBtn.classList.remove("d-none");
					} else if (
						participantOptionsSelected.classList.contains("d-none") == false
					) {
						participantOptionsSelected.classList.add("d-none");
						menuBtn.classList.remove("d-none");
					}
				}

				if (e.target.id != "attachments-btn") {
					if (attachmentsMenu.classList.contains("d-none") == false) {
						attachmentsMenu.classList.add("d-none");
					}
				}
			};
		};

		// sidebar toggle
		$("#highlighted-threads").click(function (e) {
			e.preventDefault();
			$("#wrapper").toggleClass("toggled");
			$("#dr-header").toggleClass("d-none");
			$("#dr-footer").toggleClass("d-none");
		});

		$("#close-highlighted").click(() => {
			$("#wrapper").addClass("toggled");
			$("#dr-header").toggleClass("d-none");
			$("#dr-footer").toggleClass("d-none");
		});

		// select new owner before leaving
		function selectParticipant() {
			$(".row").on("click", ".col-6", function () {
				$(".row .brand-text").removeClass("brand-text");
				$(".row .font-bold").removeClass("font-bold");
				$(this).addClass("brand-text");
				$(this).addClass("font-bold");
			});
		}

		// delete highlighted threads
		function removeHighlighted() {
			console.log("clicked");
			let selectedThreads = $('input[name="thread-selector"]:checked');
			console.log(selectedThreads);
			selectedThreads.each(function () {
				$(this).parent().parent().removeClass("d-flex");
				$(this).parent().parent().addClass("d-none");
			});
		}

		// chat functionality
		if ($(".chat-row").length > 0) {
			$("#intro-boxes").addClass("d-none");
		}

		// chat template
		const _template = {
			outgoing: function (data) {
				return `<div class="chat-row outgoing" id=${data.id}>
            <div>
                <p class="font-8 mb-0">
                    Me
                </p>
                <div class="chat">
                    <p class="mb-0 font-10">${data.text}</p>
                </div>
            </div>
            <img src="https://www.mantruckandbus.com/fileadmin/_processed_/c/7/csm_frank-sprenger-interviewkachel_4470dab1a7.jpg"
                alt="man 2" class="circle-sm rounded-circle img-cover">
        </div>`;
			},
			outgoingReply: function (data) {
				return `<div class="chat-row outgoing" id=${data.id}>
            <div>
                <p class="font-8 mb-0">
                    Me
                </p>
                <div class="chat">
                    <div class="reply mb-1" pointer=${data.pointer}>
                            <p class="font-10 mb-0">${data.orgText}</p>
                    </div>
                    <p class="mb-0 font-10">${data.text}</p>
                </div>
            </div>
            <img src="https://www.mantruckandbus.com/fileadmin/_processed_/c/7/csm_frank-sprenger-interviewkachel_4470dab1a7.jpg"
                alt="man 2" class="circle-sm rounded-circle img-cover">
        </div>`;
			},
		};

		let newId = 100;
		// chat append
		$("#wrapper").on("submit", "#chatbox", function (e) {
			e.preventDefault();
			let $this = $("#chat-input");
			let text = $this.val();
			if (!$.trim(text)) {
				return console.log("empty");
			}
			let $wrapper = $("#wrapper");
			newId++;

			// if replying
			if (replyMode) {
				let pointer = $(".chat.tertiary-border").parent().parent().attr("id");
				console.log(pointer);
				let orgText = $(`.chat.tertiary-border > p`).text();

				$wrapper.append(
					_template.outgoingReply({
						text: text,
						id: newId,
						orgText: orgText,
						pointer: pointer,
					})
				);

				replyMode = false;
				$(".chat.tertiary-border").removeClass("tertiary-border");
			}

			// else
			else {
				$wrapper.append(_template.outgoing({ text: text, id: newId }));
			}

			$this.val("");
		});

		// scroll on reply click
		$("body").on("click", ".reply", function () {
			let scrollId = $(this).attr("pointer");
			console.log(scrollId);
			$(`#${scrollId}`)[0].scrollIntoView({
				behavior: "auto",
				block: "center",
				inline: "center",
			});
		});

		function deleteThread() {
			$("#delete-thread-modal").modal("show");

			$("#cancel-delete").on("click", () => {
				$(".chat.tertiary-border").removeClass("tertiary-border");
				$("#delete-thread-modal").modal("hide");
			});

			$("#delete-final").on("click", function () {
				$(".chat.tertiary-border").parent().parent().addClass("d-none");
				$("#delete-thread-modal").modal("hide");
			});
		}

		function removeUser() {
			$("#remove-user-modal").modal("show");

			$("#cancel-remove").on("click", () => {
				$(".chat.tertiary-border").removeClass("tertiary-border");
				$("#remove-user-modal").modal("hide");
			});

			$("#remove-final").on("click", () => {
				let texts = $(".chat-row.incoming");
				console.log(texts);
				texts.addClass("d-none");
				// for (let index = 0; index < texts.length; index++) {
				//     texts[index].addClass("d-none")
				// }
				$("#remove-user-modal").modal("hide");
			});
		}

		// check if device is mobile
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

		let holdStart = isMobile() ? "touchstart" : "mousedown";
		let holdStop = isMobile() ? "touchend" : "mouseup";

		if ($(".chat.tertiary-border")) {
			$("body").on("click", function (e) {
				let eventTarget = $(e.target);
				let eventParent = $(e.target).parent();

				// check if user clicks outside menu options, text field or any chat and remove selected
				if (
					e.target.id != "submit-thread" &&
					e.target.id != "chat-input" &&
					e.target.id != "menu-btn" &&
					e.target.id != "reply-selected" &&
					e.target.id != "save-selected" &&
					e.target.id != "share-selected" &&
					e.target.id != "highlight-selected" &&
					e.target.id != "delete-selected" &&
					e.target.id != "remove-selected" &&
					!eventTarget.hasClass("chat") &&
					!eventParent.hasClass("chat")
				) {
					$(".chat.tertiary-border").removeClass("tertiary-border");
					threadSelected = false;
				}
			});
		}

		$("#wrapper").on(holdStart, ".chat", function () {
			let that = $(this);
			setTimeout(() => {
				threadSelected = true;
				$(".chat.tertiary-border").removeClass("tertiary-border");
				that.addClass("tertiary-border");
				// clearInterval(i);
			}, 500);
		});

		$("body").on("click", "#sidebar-footer", function () {
			removeHighlighted();
		});

		$("body").on("click", ".pariticipant-selectable", function () {
			selectParticipant();
		});
	};

	return view;
});
