"use strict";

/* globals define */

define("forum/mobile/post/view", ["api"], function (api) {
	var view = {};

	view.init = function () {
		// comment input working
		const messageForm = document.querySelector("#message-form");
		const sendIcon = document.querySelector(".write-icon");
		
		// getting post tid from url
		let searchParams = new URLSearchParams(window.location.search);
		let currentTid;
		if(searchParams.has("tid"))	{
			currentTid = searchParams.get("tid")
			console.log(currentTid);
		}
		else {
			alert("How did you get here?! SECURITY!!!");
		}

		const _templates = {
			authorDetails: function (data) {
				return `<img src="${data.data.user.picture}" alt="author-avatar" class="circle-md overflow-hidden">
                <div id="post-meta" class="ml-3">
                    <p class="mb-0 font-14 font-medium">${data.data.user.fullname}</p>
                    <p class="mb-0 brand-text font-10 text-truncate component-md">${
											data.data.user.signature
										}</p>
                    <p class="font-8 mb-0">${moment(
											data.data.timestamp
										).format("MMMM DD, YYYY")}</p>
                </div>`;
			},
			postBlock: function (data) {
				return `<p class="font-10 mb-2">
                ${data}
                </p>`;
			},
			lastPostBlock: function (data) {
				return `<p class="font-10 mb-0">
                ${data}
                </p>`;
			},
			imgAttach: function(data) {
				return `<img src="${data.data.image}"
                    alt="header-img" class="img-cover component-full rounded-10-px height-160 mt-3">`;
			},
			articleAttach: function(data) {
				return `<div id="attached-article" aid="${data.tid}" class="component-full rounded-10-px mt-3">
        <img src="${data.image}"
            alt="img" class="img-cover height-160 component-full rounded-top-10-px">
        <div class="d-flex px-3 py-2 justify-content-between align-items-center primary-bg rounded-bottom-10-px">
            <div>
                <p class="font-14 mb-0">${data.title}</p>
                <p class="font-10 brand-text mt-1 mb-0">${moment(data.timestamp).format("Do of MMMM, YYYY")}</p>
            </div>
            <div class="d-flex align-items-center">
                <p class="font-12 mb-0">Read more</p>
                <i class="fa-solid fa-chevron-right ml-1 mt-1 font-12"></i>
            </div>
        </div>
    </div>`
			}
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
		// discussion tab
		$("#discussion-tab").on("click", function () {
			if (!$("#reflections-tab-content").hasClass("d-none"))
				$("#reflections-tab-content").addClass("d-none");
			if (!$("#tp-tab-content").hasClass("d-none"))
				$("#tp-tab-content").addClass("d-none");
			if (!$("#comments-tab-content").hasClass("d-none"))
				$("#comments-tab-content").addClass("d-none");
			if ($("#discussion-tab-content").hasClass("d-none"))
				$("#discussion-tab-content").removeClass("d-none");
			// tab color
			if ($("#reflection-tab").hasClass("brand-text"))
				$("#reflection-tab").removeClass("brand-text");
			if ($("#thought-process-tab").hasClass("brand-text"))
				$("#thought-process-tab").removeClass("brand-text");
			if ($("#comments-tab").hasClass("brand-text"))
				$("#comments-tab").removeClass("brand-text");
			if (!$("#discussion-tab").hasClass("brand-text"))
				$("#discussion-tab").addClass("brand-text");
		});

		$("#reflection-tab").on("click", function () {
			if (!$("#discussion-tab-content").hasClass("d-none"))
				$("#discussion-tab-content").addClass("d-none");
			if (!$("#tp-tab-content").hasClass("d-none"))
				$("#tp-tab-content").addClass("d-none");
			if (!$("#comments-tab-content").hasClass("d-none"))
				$("#comments-tab-content").addClass("d-none");
			if ($("#reflections-tab-content").hasClass("d-none"))
				$("#reflections-tab-content").removeClass("d-none");
			// tab color
			if ($("#discussion-tab").hasClass("brand-text"))
				$("#discussion-tab").removeClass("brand-text");
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
			if (!$("#discussion-tab-content").hasClass("d-none"))
				$("#discussion-tab-content").addClass("d-none");
			if (!$("#comments-tab-content").hasClass("d-none"))
				$("#comments-tab-content").addClass("d-none");
			if ($("#tp-tab-content").hasClass("d-none"))
				$("#tp-tab-content").removeClass("d-none");
			// tab color
			if ($("#reflection-tab").hasClass("brand-text"))
				$("#reflection-tab").removeClass("brand-text");
			if ($("#discussion-tab").hasClass("brand-text"))
				$("#discussion-tab").removeClass("brand-text");
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
			if (!$("#discussion-tab-content").hasClass("d-none"))
				$("#discussion-tab-content").addClass("d-none");
			if ($("#comments-tab-content").hasClass("d-none"))
				$("#comments-tab-content").removeClass("d-none");
			// tab color
			if ($("#reflection-tab").hasClass("brand-text"))
				$("#reflection-tab").removeClass("brand-text");
			if ($("#thought-process-tab").hasClass("brand-text"))
				$("#thought-process-tab").removeClass("brand-text");
			if ($("#discussion-tab").hasClass("brand-text"))
				$("#discussion-tab").removeClass("brand-text");
			if (!$("#comments-tab").hasClass("brand-text"))
				$("#comments-tab").addClass("brand-text");
		});

		api.post(`/app/getposts?tid=${currentTid}`, {}).then((res) => {
			console.log(res);

			$("#post-author-details").append(_templates.authorDetails(res));

			let postContent = res.data.content;
			let postBlocks = postContent.split("\n");

			for (let index = 0; index < postBlocks.length - 1; index++) {
				$("#post-content").append(
					_templates.postBlock(postBlocks[index])
				);
			}

			$("#post-content").append(
				_templates.lastPostBlock(postBlocks[postBlocks.length - 1])
			);

			$("#post-content").append(_templates.imgAttach(res));

			$("#post-content").append(_templates.articleAttach(res.data.attachment));
			$("body").on("click", "#attached-article", function() {
				window.location.href= `http://127.0.0.1:4567/mobile/article/view?tid=${$(this).attr("aid")}`
			})

			$("body").on("click", "#post-settings", function() {
				if(res.data.uid == app.user.uid) {
					$("#author-options").removeClass("d-none");
				}
				else {
					$("#reader-options").removeClass("d-none");
				}
			})

			$("body").on("click", "#post-content", () => {
				if(!$("#author-options").hasClass("d-none"))
					$("#author-options").addClass("d-none");
				else if(!$("#reader-options").hasClass("d-none"))
					$("#reader-options").addClass("d-none");
			})
	
			$("#delete-btn").on("click", function() {
				api.del(`/app/posts/${currentTid}`, {}).then((res) => {
					console.log(res)
					window.location.href = "http://127.0.0.1:4567/mobile/post/create";
				})
			}) 

			$("#edit-btn").on("click", () => window.location.href = `create?tid=${currentTid}`)
		});
	};

	return view;
});
