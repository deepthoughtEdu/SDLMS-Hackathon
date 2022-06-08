"use strict";

define("admin/manage/customCat", [
	"translator",
	"benchpress",
	"categorySelector",
	"api",
	"Sortable",
], function (translator, Benchpress, categorySelector, api, Sortable) {
	var Categories = {};
	var newCategoryId = -1;
	var sortables;

	Categories.init = function () {
		Categories.render(ajaxify.data.categories);

		$('button[data-action="create"]').on("click", Categories.throwCreateModal);

		// Enable/Disable toggle events
		$(".categories").on(
			"click",
			'.category-tools [data-action="toggle"]',
			function () {
				var $this = $(this);
				var cid = $this.attr("data-disable-cid");
				var parentEl = $this.parents('li[data-cid="' + cid + '"]');
				var disabled = parentEl.hasClass("disabled");
				var childrenEls = parentEl.find("li[data-cid]");
				var childrenCids = childrenEls
					.map(function () {
						return $(this).attr("data-cid");
					})
					.get();

				Categories.toggle([cid].concat(childrenCids), !disabled);
			}
		);

		$(".categories").on("click", ".toggle", function () {
			var el = $(this);
			el.find("i").toggleClass("fa-minus").toggleClass("fa-plus");
			el.closest("[data-cid]").find("> ul[data-cid]").toggleClass("hidden");
		});

		$("#collapse-all").on("click", function () {
			toggleAll(false);
		});

		$("#expand-all").on("click", function () {
			toggleAll(true);
		});

		function toggleAll(expand) {
			var el = $(".categories .toggle");
			el.find("i")
				.toggleClass("fa-minus", expand)
				.toggleClass("fa-plus", !expand);
			el.closest("[data-cid]")
				.find("> ul[data-cid]")
				.toggleClass("hidden", !expand);
		}

		$("#category-search").on("keyup", function () {
			searchCategory();
		});
	};

	function searchCategory() {
		var container = $("#content .categories");
		function revealParents(cid) {
			var parentCid = container
				.find('li[data-cid="' + cid + '"]')
				.attr("data-parent-cid");
			if (parentCid) {
				container
					.find('li[data-cid="' + parentCid + '"]')
					.removeClass("hidden");
				revealParents(parentCid);
			}
		}

		function revealChildren(cid) {
			var els = container.find('li[data-parent-cid="' + cid + '"]');
			els.each(function (index, el) {
				var $el = $(el);
				$el.removeClass("hidden");
				revealChildren($el.attr("data-cid"));
			});
		}

		var categoryEls = container.find("li[data-cid]");
		var val = $("#category-search").val().toLowerCase();
		var noMatch = true;
		var cids = [];
		categoryEls.each(function () {
			var liEl = $(this);
			var isMatch = liEl.attr("data-name").toLowerCase().indexOf(val) !== -1;
			if (noMatch && isMatch) {
				noMatch = false;
			}
			if (isMatch && val) {
				cids.push(liEl.attr("data-cid"));
			}
			liEl.toggleClass("hidden", !isMatch);
		});

		cids.forEach(function (cid) {
			revealParents(cid);
			revealChildren(cid);
		});

		$('[component="category/no-matches"]').toggleClass("hidden", !noMatch);
	}

	Categories.throwCreateModal = function () {
		socket.emit(
			"categories.getSelectCategories",
			{},
			function (err, categories) {
				if (err) {
					return app.alertError(err.message);
				}

				categories.unshift({
					cid: 0,
					name: "[[admin/manage/categories:parent-category-none]]",
					icon: "fa-none",
				});
				Benchpress.render("admin/partials/categories/newCreate", {
					categories: categories,
				}).then(function (html) {
					var modal = bootbox.dialog({
						title: "[[admin/manage/categories:alert.create]]",
						message: html,
						buttons: {
							save: {
								label: "[[global:save]]",
								className: "btn-primary",
								callback: submit,
							},
						},
					});
					//submit();
					// var parentSelector = categorySelector.init(
					// 	modal.find('#parentCidGroup [component="category-selector"]')
					// );
					// app.log(parentSelector);

					// var cloneFromSelector = categorySelector.init(
					// 	modal.find('#cloneFromCidGroup [component="category-selector"]')
					// );

					function submit() {
						var formData = modal.find("form").serializeObject();
						formData.description = "";
						formData.icon = "fa-comments";
						formData.uid = app.user.uid;
						formData.parentCid = 41;
						formData.cloneFromCid = "";
						formData.categoryType = document.getElementById("category-type").value;
						if (formData.categoryType == "0") { alert("You need to select the category type first"); return;}

						Categories.create(formData);
						modal.modal("hide");
						return false;
					}

					$("#cloneChildren").on("change", function () {
						var check = $(this);
						var parentSelect = modal.find(
							'#parentCidGroup [component="category-selector"] .dropdown-toggle'
						);

						if (check.prop("checked")) {
							parentSelect.attr("disabled", "disabled");
							parentSelector.selectCategory(0);
						} else {
							parentSelect.removeAttr("disabled");
						}
					});

					modal.find("form").on("submit", submit);
					// submit();
				});
			}
		);
	};

	Categories.create = function async(payload) {
		app.alert({
			title: "Creating the Categories",
			message: 'Please wait! Category "' + payload.name + '" is being created',
			type: "success",
			timeout: 9000,
		});
		//app.log(payload);
		// const categories = require("../../../../src/categories/create");
		// categories.create(payload).then(() => {
		// 	app.alert({
		// 		alert_id: "category_created",
		// 		title: "[[admin/manage/categories:alert.created]]",
		// 		message: "[[admin/manage/categories:alert.create-success]]",
		// 		type: "success",
		// 		timeout: 2000,
		// 	});
		// 	ajaxify.go("category/41");
		// });
		api.post("/categories", payload, function (err, data) {
			if (err) {
				return app.alertError(err.message);
			}

			app.alert({
				alert_id: "category_created",
				title: "[[admin/manage/categories:alert.created]]",
				message: "[[admin/manage/categories:alert.create-success]]",
				type: "success",
				timeout: 2000,
			});
			ajaxify.go("category/41");
			// ajaxify.go("admin/manage/categories/" + data.cid);
		});
	};

	Categories.render = function (categories) {
		var container = $(".categories");

		if (!categories || !categories.length) {
			translator.translate(
				"[[admin/manage/categories:alert.none-active]]",
				function (text) {
					$("<div></div>")
						.addClass("alert alert-info text-center")
						.text(text)
						.appendTo(container);
				}
			);
		} else {
			sortables = {};
			renderList(categories, container, 0);
		}
	};

	Categories.toggle = function (cids, disabled) {
		const listEl = document.querySelector(".categories ul");
		Promise.all(
			cids.map((cid) =>
				api
					.put("/categories/" + cid, {
						disabled: disabled ? 1 : 0,
					})
					.then(() => {
						const categoryEl = listEl.querySelector(`li[data-cid="${cid}"]`);
						categoryEl.classList[disabled ? "add" : "remove"]("disabled");
						$(categoryEl)
							.find('li a[data-action="toggle"]')
							.first()
							.translateText(
								disabled
									? "[[admin/manage/categories:enable]]"
									: "[[admin/manage/categories:disable]]"
							);
					})
					.catch(app.alertError)
			)
		);
	};

	function itemDidAdd(e) {
		newCategoryId = e.to.dataset.cid;
	}

	function itemDragDidEnd(e) {
		var isCategoryUpdate = parseInt(newCategoryId, 10) !== -1;

		// Update needed?
		if (
			(e.newIndex != null &&
				parseInt(e.oldIndex, 10) !== parseInt(e.newIndex, 10)) ||
			isCategoryUpdate
		) {
			var parentCategory = isCategoryUpdate
				? sortables[newCategoryId]
				: sortables[e.from.dataset.cid];
			var modified = {};
			var i = 0;
			var list = parentCategory.toArray();
			var len = list.length;

			for (i; i < len; i += 1) {
				modified[list[i]] = {
					order: i + 1,
				};
			}

			if (isCategoryUpdate) {
				modified[e.item.dataset.cid].parentCid = newCategoryId;
			}

			newCategoryId = -1;

			Object.keys(modified).map((cid) =>
				api.put("/categories/" + cid, modified[cid])
			);
		}
	}

	/**
	 * Render categories - recursively
	 *
	 * @param categories {array} categories tree
	 * @param level {number} current sub-level of rendering
	 * @param container {object} parent jquery element for the list
	 * @param parentId {number} parent category identifier
	 */
	function renderList(categories, container, parentId) {
		// Translate category names if needed
		var count = 0;
		categories.forEach(function (category, idx, parent) {
			translator.translate(category.name, function (translated) {
				if (category.name !== translated) {
					category.name = translated;
				}
				count += 1;

				if (count === parent.length) {
					continueRender();
				}
			});
		});

		if (!categories.length) {
			continueRender();
		}

		function continueRender() {
			app.parseAndTranslate(
				"admin/partials/categories/category-rows",
				{
					cid: parentId,
					categories: categories,
				},
				function (html) {
					container.append(html);

					// Handle and children categories in this level have
					for (
						var x = 0, numCategories = categories.length;
						x < numCategories;
						x += 1
					) {
						renderList(
							categories[x].children,
							$('li[data-cid="' + categories[x].cid + '"]'),
							categories[x].cid
						);
					}

					// Make list sortable
					sortables[parentId] = Sortable.create(
						$('ul[data-cid="' + parentId + '"]')[0],
						{
							group: "cross-categories",
							animation: 150,
							handle: ".information",
							dataIdAttr: "data-cid",
							ghostClass: "placeholder",
							onAdd: itemDidAdd,
							onEnd: itemDragDidEnd,
						}
					);
				}
			);
		}
	}

	return Categories;
});
