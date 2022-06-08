"use strict";

/* globals define */

define("forum/mobile/post/create", ["api"], function (api) {
	var create = {};

	create.init = function () {
		const attachment = document.querySelector(".attachment");
		const attachments = document.querySelector(".attachments");
		const crossIcon = document.querySelector(".cross-icon");
		const filterIcon = document.querySelectorAll(".filter-icon");
		const closeFilterBtn = document.querySelectorAll(".close-filter-btn");
		const filters = document.querySelectorAll(".filters");
		const articles = document.querySelectorAll(".article");
		const discussionRooms = document.querySelectorAll(".discussion-room");
		const attachmentInfoContainer = document.querySelector(
			"#attachment-info-container"
		);
		const btnRack = document.querySelector("#btn-rack");

		let category;
		let subCategory;
		let articleCount = 0;
		let discussionCount = 0;

		const _templates = {
			category: function (data) {
				return `<li class="category-container">
					<div class="category-name" data-toggle="collapse"
						data-target="#open-${data.cid}" aria-expanded="false"
						aria-controls="open-${data.cid}" cid="${data.cid}" category>
						<p>${data.name}</p>
						<i class="fas fa-solid fa-chevron-down chevron-180 mr-2"></i>
					</div>
					<ul class="collapse" id="open-${data.cid}">
						${data.sub_categories.map((e) => _templates.subCategory(e)).join("")}
					</ul>
				</li>`;
			},
			subCategory: function (data) {
				return `<li>
					<div class="sub-category" sub-category cid=${data.cid}>
						<p>${data.name}</p>
					</div>
				</li>`;
			},
			articleSelected: function (data) {
				return `<div class="article-attachment attachment-info p-2 bg-white shadow-sm w-50 mb-2 d-flex align-items-center rounded-lg" id="${data.id}">
                            <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/cross.svg" class="deselect-btn"  alt="">
                            <p class="font-12 font-bold text-black mb-0 ml-2">${data.name}</p>
                        </div>`;
			},
			discussionSelected: function (data) {
				return `<div class="discussion-attachment attachment-info p-2 bg-white shadow-sm w-50 mb-2 d-flex align-items-center rounded-lg" id="${data.id}">
                            <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/cross.svg" class="deselect-btn"  alt="">
                            <p class="font-12 font-bold text-black mb-0 ml-2">${data.name}</p>
                        </div>`;
			},
			articleOption: function (data) {
				return `<div class="article col-10 d-flex mb-3" id="${data.tid}">
        <img src="${
					data.picture
				}" alt="" class="img-cover circle-md rounded-circle" />
        <div class="article-text ml-2">
            <h2 class="article-heading font-10 font-semi-bold mb-0">
                ${data.title}
            </h2>
            <p class="article-date brand-text font-8 font-regular mb-0">
                ${moment(data.timestamp).format("MMMM DD, YYYY")}
            </p>
            <p class="article-content primary-text font-8 font-regular mb-0 text-truncate" style="max-width: 55vw">
                ${data.content}
            </p>
        </div>
    </div>`;
			},
			discussionOption: function (data) {
				return `<div class="discussion col-10 d-flex mb-3" id="${data.tid}">
        <img src="${
					data.image
				}" alt="" class="img-cover circle-md rounded-circle" />
        <div class="discussion-text ml-2">
            <h2 class="discussion-heading font-10 font-semi-bold mb-0">
                ${data.title}
            </h2>
            <p class="discussion-date brand-text font-8 font-regular mb-0">
                ${moment(data.timestamp).format("MMMM DD, YYYY")}
            </p>
            <p class="discussion-content primary-text font-8 font-regular mb-0 text-truncate" style="max-width: 55vw">
                ${data.description}
            </p>
        </div>
    </div>`;
			},
		};

		// checking if we came here for post edit and setting up data that has already been entered
		let searchParams = new URLSearchParams(window.location.search);
		let currentTid = false;
		if(searchParams.has("tid"))	{
			currentTid = searchParams.get("tid")

			api.post(`/app/getposts?tid=${currentTid}`, {}).then((res) => {
				console.log("logging post");
				console.log(res);

				articleCount = 1
				let articleData = {
					id: res.data.attachment.tid,
					name: res.data.attachment.title
				}

				$("#attachment-info-container").append(
					_templates.articleSelected(articleData)
				);

				$(`[cid=${res.data.cid}]`).addClass("selected")
				$(`[cid=${res.data.sub_cid}]`).addClass("selected")

				$("#post-content").val(res.data.content)
			})
		}

		// opening attachments div
		const toggleAttachments = function () {
			attachment.classList.toggle("d-flex");
			attachments.classList.toggle("d-flex");
			btnRack.classList.toggle("d-flex");
			btnRack.classList.toggle("d-none");
		};

		// checking attachments btn
		attachment.addEventListener("click", toggleAttachments);
		crossIcon.addEventListener("click", toggleAttachments);

		const toggleFilter = function () {
			for (let i = 0; i < filters.length; i++)
				filters[i].classList.toggle("d-flex");
		};

		for (let i = 0; i < filterIcon.length; i++)
			filterIcon[i].addEventListener("click", toggleFilter);

		for (let i = 0; i < closeFilterBtn.length; i++)
			closeFilterBtn[i].addEventListener("click", toggleFilter);

		// open categories modal
		$("#categories-btn").on("click", () => {
			$("#categories-modal").modal("show");
			$("#categories-modal").addClass("show");
		});

		// api get categories
		api.get("/app/category", {}).then((res) => {
			$.each(res, function (i, data) {
				$("#open-categories").append(_templates.category(data));
			});
		});

		// categories modal working
		$("body").on("click", "[sub-category]", function (e) {
			if ($(this)[0] != $("[sub-category].selected")[0]) {
				$("[category].selected").removeClass("selected");
				$("[sub-category].selected").removeClass("selected");
			}
			$(this).toggleClass("selected");
			let parent = $(this).parents(".collapse").first();
			let parentCategory = parent.prev("[category]");
			if (parent.find("[sub-category].selected").length) {
				parentCategory.addClass("selected");
			} else {
				parentCategory.removeClass("selected");
			}
		});

		// submit category modal
		$("#submit-category").on("click", () => {
			category = parseInt($("[category].selected").attr("cid"));
			subCategory = parseInt($("[sub-category].selected").attr("cid"));
			console.log(category + "\n" + subCategory);
			$("#categories-modal").modal("hide");
			$("#categories-modal").removeClass("show");
		});

		// open aritlces modal
		$("#articles-btn").on("click", () => {
			$("#exampleModal").modal("show");
			$("#exampleModal").addClass("show");
		});

		// lazy load articles list
		let check = {
			root: null,
			rootMargin: "0px",
			threshold: 0.9,
		};
		let articlePage = 0;

		function loadArticles() {
			if ($("#article-modal-body .article").length < 5) {
				api
					.post(`/app/getarticles?limit=5&page=${articlePage}`, {})
					.then((res) => {
						// $("#article-modal-body").empty();
						$.each(res.data, function (i, data) {
							$("#article-modal-body").append(_templates.articleOption(data));
						});
					});
				articlePage++;
			}
		}

		let articlesObserver = new IntersectionObserver(loadArticles, check);
		articlesObserver.observe(document.getElementById("article-modal-body"));

		// searching through articcles
		let allArticles = $("#article-modal-body").children(".article");
		allArticles = allArticles.prevObject[0].children;

		$("#search-article").on("keyup", function () {
			let searchArticle = $("#search-article").val().toLowerCase();

			for (let index = 0; index < allArticles.length; index++) {
				let ArticleName = $($(allArticles[index]).children("h2")[0])
					.text()
					.toLowerCase();

				if (ArticleName.indexOf(searchArticle) <= -1) {
					$(allArticles[index]).removeClass("d-flex");
					$(allArticles[index]).addClass("d-none");
				} else {
					$(allArticles[index]).addClass("d-flex");
					$(allArticles[index]).removeClass("d-none");
				}
			}
		});

		// open discussions modal
		$("#discussions-btn").on("click", () => {
			$("#exampleModal2").modal("show");
			$("#exampleModal2").addClass("show");
		});

		// lazy load drs list
		let discussionPage = 0;

		function loadDiscussions() {
			if ($("#discussion-modal-body .discussion").length < 5) {
				api
					.post(`/app/getdiscussion_room?limit=5&page=${discussionPage}`, {})
					.then((res) => {
						$.each(res.data, function (i, data) {
							$("#discussion-modal-body").append(
								_templates.discussionOption(data)
							);
						});
					});
				discussionPage++;
			}
		}

		let discussionsObserver = new IntersectionObserver(loadDiscussions, check);
		discussionsObserver.observe(
			document.getElementById("discussion-modal-body")
		);

		// searching through drs
		let allDiscussions = $("#discussion-modal-body").children(".discussion");
		allDiscussions = allDiscussions.prevObject[0].children;

		$("#search-discussion").on("keyup", function () {
			let searchDiscussion = $("#search-discussion").val().toLowerCase();

			for (let index = 0; index < allDiscussions.length; index++) {
				let discussionName = $($(allDiscussions[index]).children("h2")[0])
					.text()
					.toLowerCase();

				if (discussionName.indexOf(searchDiscussion) <= -1) {
					$(allDiscussions[index]).removeClass("d-flex");
					$(allDiscussions[index]).addClass("d-none");
				} else {
					$(allDiscussions[index]).addClass("d-flex");
					$(allDiscussions[index]).removeClass("d-none");
				}
			}
		});

		// select article
		$("body").on("click", ".article", function () {
			if (articleCount == 0) {
				articleCount += 1;

				let data = {
					name: $($($(this)).children()[1])
						.children("h2")
						.text(),
					id: $(this).attr("id"),
				};

				$("#attachment-info-container").append(
					_templates.articleSelected(data)
				);

				$("#exampleModal").modal("hide");
				$("#exampleModal").removeClass("show");
			} else {
				$("#article-alert").alert();
				$("#article-alert").addClass("show");
				$("#article-alert").removeClass("d-none");
				$("#exampleModal").modal("hide");
				$("#exampleModal").removeClass("show");
			}
		});

		// remove attached article
		$("body").on("click", ".article-attachment", function () {
			articleCount -= 1;
			$(this).remove();
		});

		// select drs
		$("body").on("click", ".discussion", function () {
			if (discussionCount <= 2) {
				discussionCount += 1;

				let data = {
					name: $($($(this)).children()[1])
						.children("h2")
						.text(),
					id: $(this).attr("id"),
				};

				$("#attachment-info-container").append(
					_templates.discussionSelected(data)
				);

				$("#exampleModal2").modal("hide");
				$("#exampleModal2").removeClass("show");
			} else {
				$("#discussion-alert").alert();
				$("#discussion-alert").addClass("show");
				$("#discussion-alert").removeClass("d-none");
				$("#exampleModal2").modal("hide");
				$("#exampleModal2").removeClass("show");
			}
		});

		// remove attached discussion
		$("body").on("click", ".discussion-attachment", function () {
			discussionCount -= 1;
			$(this).remove();
		});

		// editing given post if tid is passed in the url
		if(currentTid){
			$("body").on("submit", "#post-form", function(e){
				e.preventDefault();

				let formData = new FormData(this);

				category = parseInt($("[category].selected").attr("cid"));
				subCategory = parseInt($("[sub-category].selected").attr("cid"));
	
				formData.append("cid", category);
				formData.append("sub_cid", subCategory);
				formData.append("content", $("#post-content").val());
				if(!formData.get("files[image]").name){
					formData.delete("files[image]");
				}

				// check if there is any attached article
				if ($("#attachment-info-container .article-attachment").length > 0)
					formData.append(
						"attachment_id",
						// get id of the article and append it to the formData as a number
						parseInt(
							$("#attachment-info-container .article-attachment").attr("id")
						)
					);

				console.log(...formData);

				doAjax({
					type: 'PUT',
					url: `/app/posts/${currentTid}`,
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
				}).then(function (res) {
					console.log(res);
					window.location.href = `view?tid=${currentTid}`
				})
			})
		}
		// creating new post if no tid is passed in the url
		else{
			// submitting post
			$("body").on("submit", "#post-form", function (e) {
				e.preventDefault();
	
				let formData = new FormData(this);
	
				formData.append("cid", category);
				formData.append("sub_cid", subCategory);
				formData.append("content", $("#post-content").val());
	
				// check if there is any attached article
				if ($("#attachment-info-container .article-attachment").length > 0)
					formData.append(
						"attachment_id",
						// get id of the article and append it to the formData as a number
						parseInt(
							$("#attachment-info-container .article-attachment").attr("id")
						)
					);
	
				console.log(...formData);
	
				doAjax({
					type: "POST",
					url: "/app/posts",
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
				}).then(function (res) {
					console.log(res);
					window.location.href = `view?tid=${res.response.tid}`
				});
			});
		}
	};

	return create;
});
