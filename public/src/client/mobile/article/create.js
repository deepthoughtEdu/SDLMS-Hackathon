"use strict";

/* globals define */

define("forum/mobile/article/create", ["api"], function (api) {
	var create = {};

	create.init = function () {
		let category;
		let subCategory;
		let nudgeSelected;

		let imgOpen = document.querySelector(".img-open");
		let nudgeOpen = document.querySelector(".nudge-open");
		let categoriesOpen = document.querySelector(".categories-open");

		// categories templates
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
			nudgeTemp: function (data) {
				return `<div class="nudge font-12 d-flex align-items-center mb-2" nid=${data.pid}>
              <img
                src=${data.image}
                alt="pix" class="img-cover circle-sm rounded-circle">
              <p class="mb-0 ml-2">${data.title}</p>
            </div>`;
			},
		};

		// checking if we came here for post edit and setting up data that has already been entered
		let searchParams = new URLSearchParams(window.location.search);
		let currentPid = false;
		if(searchParams.has("pid"))	{
			currentPid = searchParams.get("pid")

			api.post(`/app/getarticles?pid=${currentPid}`, {}).then((res) => {
				console.log(res);
				$(`[cid=${res.data.cid}]`).addClass("selected")
				$(`[cid=${res.data.sub_cid}]`).addClass("selected")

				$("#nudge-title").val(res.data.title);
				$("#nudge-description").val(res.data.content);
				nudgeSelected = res.data.nid;
			})
		}

		$("body").on("click", "#nudge-btn", () => openNudge());
		$("body").on("click", "#categories-btn", () => openCategories());
		$("body").on("click", "#img-btn", () => openImg());

		// open img
		function openImg() {
			if (categoriesOpen.classList.contains("d-none") == false)
				categoriesOpen.classList.add("d-none");
			if (nudgeOpen.classList.contains("d-none") == false)
				nudgeOpen.classList.add("d-none");
			imgOpen.classList.remove("d-none");
		}

		// open nudge
		function openNudge() {
			if (categoriesOpen.classList.contains("d-none") == false)
				categoriesOpen.classList.add("d-none");
			if (imgOpen.classList.contains("d-none") == false)
				imgOpen.classList.add("d-none");
			nudgeOpen.classList.remove("d-none");
		}

		// lazy load nudges list
		let check = {
			root: null,
			rootMargin: "0px",
			threshold: 0.9,
		};
		let nudgePage = 0;

		function loadNudges() {
			api
				.post(`/app/getnudge`, { limitBy: 50, page: nudgePage })
				.then((res) => {
					$("#nudges-list").empty();
					$.each(res.data, function (i, data) {
						$("#nudges-list").append(_templates.nudgeTemp(data));
					});
				});
			nudgePage++;
		}

		let nudgeObserver = new IntersectionObserver(loadNudges, check);
		nudgeObserver.observe(document.getElementById("nudges-list"));

		// searching through nudges
		let allNudges = $("#nudges-list").children(".nudge");
		allNudges = allNudges.prevObject[0].children;

		$("#search-nudge").on("keyup", function () {
			let searchNudge = $("#search-nudge").val().toLowerCase();

			for (let index = 0; index < allNudges.length; index++) {
				let nudgeName = $($(allNudges[index]).children("p")[0])
					.text()
					.toLowerCase();

				if (nudgeName.indexOf(searchNudge) <= -1) {
					$(allNudges[index]).removeClass("d-flex");
					$(allNudges[index]).addClass("d-none");
				} else {
					$(allNudges[index]).addClass("d-flex");
					$(allNudges[index]).removeClass("d-none");
				}
			}
		});

		// selecting a nudge
		$("body").on("click", ".nudge", function () {
			nudgeSelected = $(this).attr("nid");
			openImg();
		});

		// open categories
		function openCategories() {
			if (imgOpen.classList.contains("d-none") == false)
				imgOpen.classList.add("d-none");
			if (nudgeOpen.classList.contains("d-none") == false)
				nudgeOpen.classList.add("d-none");
			categoriesOpen.classList.remove("d-none");
		}

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

			category = parseInt($("[category].selected").attr("cid"));
			subCategory = parseInt($("[sub-category].selected").attr("cid"));
		});

		// create submission
		$("body").on("submit", "#create-article", function (e) {
			e.preventDefault();

			let formData = new FormData(this);
			formData.append("nid", nudgeSelected);

			if(currentPid){
				category = parseInt($("[category].selected").attr("cid"));
				subCategory = parseInt($("[sub-category].selected").attr("cid"));
	
				formData.append("cid", category);
				formData.append("sub_cid", subCategory);
				if(!formData.get("files[image]").name){
					formData.delete("files[image]");
				}

				
				doAjax({
					type: 'PUT',
					url: `/app/articles/${currentPid}`,
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
				}).then(function (res) {
					console.log(res);
					window.location.href = `view?pid=${currentPid}`
				})
			}
			else {
			formData.append("cid", 1);
			formData.append("sub_cid", 10);

			doAjax({
				type: "POST",
				url: "/app/articles",
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
			}).then(function (res) {
				console.log(res);
				// window.location.href = `view?pid=${res.response.pid}`
				ajaxify.go(`/mobile/article/view?pid=${res.response.pid}`)
			});
		}
		});
	};

	return create;
});
