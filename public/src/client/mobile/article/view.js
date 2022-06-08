"use strict";

/* globals define */

define("forum/mobile/article/view", ["api"], function (api) {
	var view = {};

	view.init = function () {
		// comment input working
		const messageForm = document.querySelector("#message-form");
		const sendIcon = document.querySelector(".write-icon");

		const _templates = {
			authorDetails: function (data) {
				return `<img src="${
					data.response.data.user.picture
				}" alt="author-avatar" class="circle-md img-cover rounded-circle overflow-hidden">
                <div id="post-meta" class="ml-2">
                    <p class="mb-0 font-14 font-medium">${
											data.response.data.user.fullname
										}</p>
                    <p class="mb-0 brand-text font-10 text-truncate component-md">${
											data.response.data.user.signature
										}</p>
                    <p class="font-8 mb-0">${moment(
											data.response.data.timestamp
										).format("MMMM DD, YYYY")}</p>
                </div>`;
			},
			imgBlock: function (data) {
				return `<img src="${data.response.data.image}"
                    alt="header-img" class="img-cover component-full rounded-10-px height-160 mb-2">`;
			},
			articleBlock: function (data) {
				return `<p class="font-10 font-regular text-black">${data}</p>`;
			},
			lastArticleBlock: function (data) {
				return `<p class="font-10 font-regular text-black mb-0">${data}</p>`;
			},
			nudgeContent: function (data) {
				return `<div class="nudges px-3 py-2 rounded-10-px" style="background-image: url(${data.response.image});>
                <div class="author-suggestion">
                    <p class="font-10 font-regular text-white">Author's Suggestion</p>
                </div>
                <div class="nudge-details d-flex justify-content-between w-100">
                    <div class="discussion-on d-flex flex-column">
                        <p class="font-10 font-regular text-white mb-0">${data.response.fav_icon} on</p>
                        <p class="font-16 font-regular text-white mb-0">${data.response.title}</p>
                    </div>
                    <div class="nudge-date-time d-flex flex-column align-items-center align-self-end">
                        <p class="font-10 font-regular text-white mb-0">20th Feb, 2022</p>
                        <p class="font-10 font-regular text-white mb-0">${data.response.schedule}</p>
                    </div>
                </div>
                <hr class="border border-light">
                <div class="nudge-content d-flex flex-column">
                    <div class="note-from-author">
                        <p class="font-12 font-regular text-white mb-2">Note from author:</p>
                    </div>
                    <div class="nudge-content-text">
                        <p class="font-10 font-regular text-white mb-0">
                            This discussion room is being hosted by Mr. Josh Doyle who is a practicing psychologist and
                            has
                            been
                            studying the EV industry closely. So there is allot to learn and discuss for both Technology
                            enthusiasts
                            and folks just looking to learn best behavioral practices from an experiecned psychologist
                        </p>
                    </div>
                </div>
                <div class="d-flex justify-content-center align-items-center mt-3">
                    <button class="text-center button-secondary border-0 mr-3 rounded-5-px button-lg-p font-12">Know
                        more</button>
                    <button class="border-0 rounded-5-px button-lg-p font-12 button-brand">Register</button>
                </div>
            </div>`;
			},
		};

		const showModal = function () {
			messageForm.classList.remove("d-none");
			sendIcon.classList.add("d-none");
		};

		const closeModal = function () {
			messageForm.classList.add("d-none");
			sendIcon.classList.remove("d-none");
		};

		const clickOut = function (event) {
			const writeTarget =
				event.target != sendIcon && event.target.parentNode != sendIcon;
			const modalTarget =
				event.target != messageForm && event.target.parentNode != messageForm;
			if (writeTarget && modalTarget) {
				closeModal();
			}
		};

		sendIcon.addEventListener("click", showModal);
		window.addEventListener("click", clickOut);

		// tabs working
		// nudges tab
		$("#nudges-tab").on("click", function () {
			if (!$("#reflections-tab-content").hasClass("d-none"))
				$("#reflections-tab-content").addClass("d-none");
			if (!$("#tp-tab-content").hasClass("d-none"))
				$("#tp-tab-content").addClass("d-none");
			if (!$("#comments-tab-content").hasClass("d-none"))
				$("#comments-tab-content").addClass("d-none");
			if ($("#nudges-tab-content").hasClass("d-none"))
				$("#nudges-tab-content").removeClass("d-none");
			// tab color
			if ($("#reflection-tab").hasClass("brand-text"))
				$("#reflection-tab").removeClass("brand-text");
			if ($("#thought-process-tab").hasClass("brand-text"))
				$("#thought-process-tab").removeClass("brand-text");
			if ($("#comments-tab").hasClass("brand-text"))
				$("#comments-tab").removeClass("brand-text");
			if (!$("#nudges-tab").hasClass("brand-text"))
				$("#nudges-tab").addClass("brand-text");
		});

		$("#reflection-tab").on("click", function () {
			if (!$("#nudges-tab-content").hasClass("d-none"))
				$("#nudges-tab-content").addClass("d-none");
			if (!$("#tp-tab-content").hasClass("d-none"))
				$("#tp-tab-content").addClass("d-none");
			if (!$("#comments-tab-content").hasClass("d-none"))
				$("#comments-tab-content").addClass("d-none");
			if ($("#reflections-tab-content").hasClass("d-none"))
				$("#reflections-tab-content").removeClass("d-none");
			// tab color
			if ($("#nudges-tab").hasClass("brand-text"))
				$("#nudges-tab").removeClass("brand-text");
			if ($("#thought-process-tab").hasClass("brand-text"))
				$("#thought-process-tab").removeClass("brand-text");
			if ($("#comments-tab").hasClass("brand-text"))
				$("#comments-tab").removeClass("brand-text");
			if (!$("#reflection-tab").hasClass("brand-text"))
				$("#reflection-tab").addClass("brand-text");
		});

		$("#thought-process-tab").on("click", function () {
			if (!$("#reflections-tab-content").hasClass("d-none"))
				$("#reflections-tab-content").addClass("d-none");
			if (!$("#nudges-tab-content").hasClass("d-none"))
				$("#nudges-tab-content").addClass("d-none");
			if (!$("#comments-tab-content").hasClass("d-none"))
				$("#comments-tab-content").addClass("d-none");
			if ($("#tp-tab-content").hasClass("d-none"))
				$("#tp-tab-content").removeClass("d-none");
			// tab color
			if ($("#reflection-tab").hasClass("brand-text"))
				$("#reflection-tab").removeClass("brand-text");
			if ($("#nudges-tab").hasClass("brand-text"))
				$("#nudges-tab").removeClass("brand-text");
			if ($("#comments-tab").hasClass("brand-text"))
				$("#comments-tab").removeClass("brand-text");
			if (!$("#thought-process-tab").hasClass("brand-text"))
				$("#thought-process-tab").addClass("brand-text");
		});

		$("#comments-tab").on("click", function () {
			if (!$("#reflections-tab-content").hasClass("d-none"))
				$("#reflections-tab-content").addClass("d-none");
			if (!$("#tp-tab-content").hasClass("d-none"))
				$("#tp-tab-content").addClass("d-none");
			if (!$("#nudges-tab-content").hasClass("d-none"))
				$("#nudges-tab-content").addClass("d-none");
			if ($("#comments-tab-content").hasClass("d-none"))
				$("#comments-tab-content").removeClass("d-none");
			// tab color
			if ($("#reflection-tab").hasClass("brand-text"))
				$("#reflection-tab").removeClass("brand-text");
			if ($("#thought-process-tab").hasClass("brand-text"))
				$("#thought-process-tab").removeClass("brand-text");
			if ($("#nudges-tab").hasClass("brand-text"))
				$("#nudges-tab").removeClass("brand-text");
			if (!$("#comments-tab").hasClass("brand-text"))
				$("#comments-tab").addClass("brand-text");
		});

		// getting pid from url to load the article
		let searchParams = new URLSearchParams(window.location.search);
		let currentPid;
		if(searchParams.has("pid"))	{
			currentPid = searchParams.get("pid")
			console.log(currentPid);
		}

		doAjax({
			type: "POST",
			method: "POST",
			url: `/app/getarticles?pid=${currentPid}`,
			data: JSON.stringify({}),
			dataType: "json",
			contentType: "application/json",
		}).then(function (res) {
			console.log(res);

			$("#post-author-details").append(_templates.authorDetails(res));

			if (res.response.data.image)
				$("#article-content").append(_templates.imgBlock(res));

			let articleContent = res.response.data.content;
			let articleBlocks = articleContent.split("\n");

			for (let index = 0; index < articleBlocks.length - 1; index++) {
				$("#article-content").append(
					_templates.articleBlock(articleBlocks[index])
				);
			}

			$("#article-content").append(
				_templates.lastArticleBlock(articleBlocks[articleBlocks.length - 1])
			);

			doAjax({
				type: "POST",
				method: "POST",
				url: `/app/getnudge?id=604`,
				data: JSON.stringify({}),
				dataType: "json",
				contentType: "application/json",
			}).then(function (res) {
				console.log(res);
				console.log("appending nudge");
				$("#nudges-tab-content").append(_templates.nudgeContent(res))
			});

			$("body").on("click", "#post-settings", function() {
				if(res.response.data.uid == app.user.uid) {
					$("#author-options").removeClass("d-none");
				}
				else {
					$("#reader-options").removeClass("d-none");
				}
			})

			$("body").on("click", "#article-content-container", () => {
				if(!$("#author-options").hasClass("d-none"))
					$("#author-options").addClass("d-none");
				else if(!$("#reader-options").hasClass("d-none"))
					$("#reader-options").addClass("d-none");
			})
	
			$("#delete-btn").on("click", function() {
				api.del(`/app/posts/${currentPid}`, {}).then((res) => {
					console.log(res)
					window.location.href = "http://127.0.0.1:4567/mobile/article/create";
				})
			}) 

			$("#edit-btn").on("click", () => window.location.href = `create?pid=${currentPid}`)
		});
	};

	return view;
});
