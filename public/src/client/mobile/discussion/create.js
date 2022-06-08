"use strict";

/* globals define */

define("forum/mobile/discussion/create", function () {
	var create = {};

	create.init = function () {
		const _templates = {
			article: function (data) {
				return `<div class="article col-10 d-flex mb-3 mx-auto" pid=${data.pid}>
							<div class="article-img">
								<img src="${data.image}"
									alt="" class="img-cover circle-lg rounded-circle">
							</div>
							<div class="article-text line-height-12px ml-2">
								<h2 class="article-heading font-10 font-regular mb-0">${data.title}</h2>
								<p class="article-date brand-text font-8 font-regular mb-0">${moment(data.timestamp).format("ddd, MMM DD, YYYY")}</p>
								<p class="article-content primary-text font-8 font-regular mb-0 truncate-line-2">${app.htmltoText(data.content)}</p>
							</div>
						</div>`
			},
			user: function (data) {
				return `<div class="user-listing d-flex" uid=${data.uid}>
                            <img src="${data.picture}" alt="user-img" class="circle-sm rounded-circle img-cover">
                            <p class="font-12">${data.displayname}</p>
                        </div>`
			}
		}

		// show rr modal
		$("body").on("change", "#dr-participant-criteria", function () {
			if ($(this).val() == "rr") {
				$("#rr-modal").modal("show");
				$("#rr-modal").addClass("show");
			}
		});

		// rr modal
		let incrementBtn = $(".inc-btn");
		let decrementBtn = $(".dec-btn");
		let rrVal = $("#rr-select");
		let newVal = 5;

		incrementBtn.on("click", () => {
			if (rrVal.val() < 10) newVal = parseFloat(rrVal.val()) + 1;
			else newVal = 10;

			rrVal.val(newVal);
		});

		decrementBtn.on("click", () => {
			if (rrVal.val() > 0) newVal = parseFloat(rrVal.val()) - 1;
			else newVal = 0;

			rrVal.val(newVal);
		});

		$("body").on("click", "#submit-rr", () => {
			$("#rr-modal").modal("hide");
			$("#rr-modal").removeClass("show");
		});

		// show categories modal
		$("#dr-category").on("click", function (event) {
			event.preventDefault();
			$("#categories-modal").modal("show");
			$("#categories-modal").addClass("show");
		});

		// categories modal working
		$("body").on("click", "[sub-category]", function (e) {
			$(this).toggleClass("selected");
			console.log(e);
			console.log(
				$(this).parent("li").prev("li").find("[sub-category] p").text()
			);
			let parent = $(this).parents(".collapse").first();
			let parentCategory = parent.prev("[category]");
			console.log(parentCategory);
			if (parent.find("[sub-category].selected").length) {
				parentCategory.addClass("selected");
			} else {
				parentCategory.removeClass("selected");
			}
		});

		$("#submit-categories").on("click", () => {
			let selectedCategories = $(".selected > p");
			console.log(selectedCategories.text());
			$("#categories-modal").modal("hide");
			$("#categories-modal").removeClass("show");
			$("#serch-articles-modal").modal("show");
			$("#serch-articles-modal").addClass("show");
		});

		const filterIcon = document.querySelectorAll(".filter-icon");
		const filters = document.querySelectorAll(".filters");
		const closeFilterBtn = document.querySelectorAll(".close-filter-btn");
		const toggleFilter = function () {
			for (let i = 0; i < filters.length; i++)
				filters[i].classList.toggle("d-flex");
		};
		for (let i = 0; i < filterIcon.length; i++)
			filterIcon[i].addEventListener("click", toggleFilter);
		for (let i = 0; i < closeFilterBtn.length; i++)
			closeFilterBtn[i].addEventListener("click", toggleFilter);

		// article selection
		let articlesPage = 1;
		let selectedArticle;

		// getting initial articles
		doAjax({
			type: 'POST',
			url: "/app/getarticles?limit=5",
			method: "POST",
			dataType: 'json',
			contentType: 'application/json',
			data: {},
		}).then(function (res) {
			console.log(res);
			res.response.data.map((article) => $("#articles-modal-body").append(_templates.article(article)))
		})

		// on selecting article
		$("body").on("click", ".article", function () {
			selectedArticle = $(this).attr("pid");
			$("#serch-articles-modal").modal("hide");
			$("#serch-articles-modal").removeClass("show");
		})

		// on skipping selection
		$("body").on("click", "#skip-article-select", function () {
			selectedArticle = null;
			$("#serch-articles-modal").modal("hide");
			$("#serch-articles-modal").removeClass("show");
		})

		// filtering articles on search
		$("body").on("keyup", "#article-input", function () {
			let listedArticles = $(".article");
			const searchQuery = $("#article-input").val().toUpperCase();

			for (let index = 0; index < listedArticles.length; index++) {
				const listedArticle = listedArticles[index];
				const articleHeading = $(listedArticle).find(".article-heading").text().toUpperCase();
				if (articleHeading.indexOf(searchQuery) <= -1) {
					$(listedArticle).removeClass("d-flex")
					$(listedArticle).addClass("d-none")
				} else {
					$(listedArticle).addClass("d-flex")
					$(listedArticle).removeClass("d-none")
				}
			}

			$(".article.d-flex").length < 5 && renderArticles();
		})

		// function to render 5 more articles
		function renderArticles() {
			doAjax({
				type: 'POST',
				url: `/app/getarticles?limit=5&page=${articlesPage}`,
				method: "POST",
				dataType: 'json',
				contentType: 'application/json',
				data: {},
			}).then(function (res) {
				console.log(res);
				res.response.data.map((article) => $("#articles-modal-body").append(_templates.article(article)))
				return res;
			})

			articlesPage++;
		}

		// showing list of users when user searches for potential mods
		let selectedMods = [];

		$("body").on("click", function () {
			$("#username-search").is(":focus")
				? $("#users-menu").removeClass("d-none")
				: $("#users-menu").addClass("d-none");
		});

		$("body").on("keyup", "#username-search", function () {
			$.ajax({
				url:
					config.relative_path +
					`/api/users?query=${$(this).val()}&paginate=true`,
				type: "GET",
				dataType: "json",
				success: function (res) {
					$("#user-menu-content").empty();
					for (
						let index = 0;
						index < (res.users.length > 10 ? 10 : res.users.length);
						index++
					) {
						const user = res.users[index];
						$("#user-menu-content").append(_templates.user(user));
					}
				},
			});
		});

		$("body").on("click", ".user-listing", function () {
			selectedMods.push(parseInt($(this).attr("uid")));
			$("#username-search").val('');
		})

		// submission
		$("body").on("submit", "#create-dr-form", function (e) {
			e.preventDefault();

			console.log("submit triggered");

			let formData = new FormData(this);

			console.log(...formData);

			formData.append("cid", 1);
			formData.append("sub_cid", 10);
			formData.append("type", 'discuss_room');
			formData.append("rigor_rank", newVal);
			selectedArticle != null && formData.append("attachment_id", selectedArticle);
			formData.append("moderators", selectedMods)

			doAjax({
				type: 'POST',
				url: "/app/createroom",
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
			}).then(function (res) {
				ajaxify.go(`/mobile/discussion/${res.response.roomId}`)
			});
		});
	};

	return create;
});
