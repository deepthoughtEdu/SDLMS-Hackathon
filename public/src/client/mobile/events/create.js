"use strict";

/* globals define */

define("forum/mobile/events/create", ["api"], function (api) {
	var create = {};

	create.init = function () {
		let category;
		let subCategory;
		let rrSubmit;

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
		};

		api.get("/app/category", {}).then((res) => {
			$.each(res, function (i, data) {
				$("#open-categories").append(_templates.category(data));
			});
		});

		// show categories modal
		$("#events-category").on("click", function (event) {
			event.preventDefault();
			$("#categories-modal").modal("show");
			$("#categories-modal").addClass("show");
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

		// save category selection
		$("body").on("click", "#submit-categories", function () {
			category = parseInt($("[category].selected").attr("cid"));
			subCategory = parseInt($("[sub-category].selected").attr("cid"));
			$("#categories-modal").modal("hide");
			$("#categories-modal").removeClass("show");
		});

		// show rr modal
		$("body").on("click", "#event-rr", function () {
			$("#rr-modal").modal("show");
			$("#rr-modal").addClass("show");
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

		// rr modal submit
		$("#submit-rr").on("click", function (e) {
			e.preventDefault();
			rrSubmit = newVal;
			$("#rr-modal").modal("hide");
			$("#rr-modal").removeClass("show");
		});

		// submission post
		$("body").on("submit", "#create-event", function (e) {
			e.preventDefault();

			let formData = new FormData(this);
			let schedule = moment(
				`${formData.get("date")} ${formData.get("time")}`
			).valueOf();
			formData.append("schedule", schedule);
			formData.append("category", category);
			formData.append("sub_category", subCategory);
			console.log(...formData);

			api.post(
				`/app/events`,
				formData,
				() => {
					console.log("submitted");
				},
				true
			);
		});
	};

	return create;
});