"use strict";

define("admin/manage/anecdotes/saved", function () {
	//* here we are defining saved module !
	var saved = {};

	saved.init = function () {
		const _templates = {
			preview: function (data) {
				return `<div class="display-flex">
					<img
						src="${data.imgsrc}"
						alt="user-img" class="margin-right-3 object-cover square-85 border-radius-circle">
					<div>
						<p class="font-18 font-bold margin-bottom-3">${
							data.title ? data.title : "Please provide a title"
						}</p>
						<p class="font-16 margin-bottom-0">${data.name}</p>
						<p class="font-16 margin-bottom-0">${
							data.userslug ? data.userslug : "Front End Developer"
						}</p>
					</div>
					</div>
					<p class="margin-top-3">${data.content}</p>`;
			},
			listing: function (data) {
				return `<tr uid=${data.author_uid} tid=${data.tid} imgsrc=${
					data.author.picture
				} userslug=${data.author.userslug}>
							<th scope="row"><input type="checkbox" class="anecdote-selectores"></th>
							<td class="author-name">${data.author.fullname}</td>
							<td class="anecdote-title">${data.title}</td>
							<td class="anecdote-content text-truncate">${data.content}</td>
							<td class="anecdote-placements">${data.placements.toString()}</td>
						</tr>`;
			},
		};

		doAjax({
			type: "GET",
			url: "/app/annecdote",
			data: {},
		}).then(function (response) {
			const pageCount = response.response.last_page;
			$("#table-body").empty();

			for (let pgNum = 0; pgNum <= pageCount; pgNum++) {
				doAjax({
					type: "GET",
					url: `/app/annecdote?limit=5&page=${pgNum}`,
					data: {},
				}).then(function (res) {
					for (let index = 0; index < res.response.data.length; index++) {
						const anecdoteData = res.response.data[index];
						anecdoteData.status == "draft" &&
							$("#table-body").append(_templates.listing(anecdoteData));
					}
				});
			}
		});

		$("body").on("click", ".anecdote-selectores", function () {
			if ($(this).is(":checked"))
				$(this).parent().parent().addClass("background-secondary text-white");
			else {
				if ($("#all-check").is(":checked"))
					$("#all-check").prop("checked", false);
				$(this)
					.parent()
					.parent()
					.removeClass("background-secondary text-white");
			}
		});

		$("#all-check").on("click", function () {
			let anecdoteSelectors = $(".anecdote-selectores");

			if ($(this).is(":checked")) {
				for (let index = 0; index < anecdoteSelectors.length; index++) {
					const element = anecdoteSelectors[index];
					$(element).prop("checked", true);
					$(element)
						.parent()
						.parent()
						.addClass("background-secondary text-white");
				}
			} else {
				for (let index = 0; index < anecdoteSelectors.length; index++) {
					const element = anecdoteSelectors[index];
					$(element).prop("checked", false);
					$(element)
						.parent()
						.parent()
						.removeClass("background-secondary text-white");
				}
			}
		});

		let currentIndex = 0;
		let selectedAnecdotes;

		$("body").on("click", "#edit-btn", function () {
			if ($(".anecdote-selectores:checked").length == 0) {
				$("#input").removeClass("display-flex");
				$("#input").addClass("display-none");
			} else {
				selectedAnecdotes = $("tr.background-secondary");
				console.log(selectedAnecdotes);
				$("#input").addClass("display-flex");
				$("#input").removeClass("display-none");
				$("#page-count").text(`1 / ${selectedAnecdotes.length}`);
				$("#title-input").val(
					$(selectedAnecdotes[0]).find(".anecdote-title").text()
				);
				$("#content-input").val(
					$(selectedAnecdotes[0]).find(".anecdote-content").text()
				);
			}
		});

		$("body").on("click", "#delete-btn", function () {
			selectedAnecdotes = $("tr.background-secondary");
			if (selectedAnecdotes.length == 1) {
				$("#anecdote-meta").empty();
				$(selectedAnecdotes[0]).find(".anecdote-title").text() != ""
					? $("#anecdote-meta").append(
							`anecdote titled '${$(selectedAnecdotes[0])
								.find(".anecdote-title")
								.text()}'`
					  )
					: $("#anecdote-meta").append(
							`anecdote by ${$(selectedAnecdotes[0])
								.find(".author-name")
								.text()}`
					  );
				$("#deleteModal").modal("show");
			} else if (selectedAnecdotes.length > 1) {
				$("#anecdote-meta").empty();
				$("#anecdote-meta").append(`${selectedAnecdotes.length} anecdotes`);
				$("#deleteModal").modal("show");
			}
		});

		$("body").on("click", "#confirm-delete", function () {
			for (let index = 0; index < selectedAnecdotes.length; index++) {
				const anecdote = selectedAnecdotes[index];
				$(anecdote).find(".anecdote-selectores").prop("checked", false);
				$(anecdote).removeClass("background-secondary text-white");
				$(anecdote).addClass("display-none");

				doAjax({
					type: "DELETE",
					url: `/app/annecdote/${$(anecdote).attr("tid")}`,
					data: {},
				}).then(function (response) {
					console.log(response);
				});
			}
			$("#deleteModal").modal("hide");
		});

		$("body").on("click", "#next", function () {
			if (!(currentIndex + 1 == selectedAnecdotes.length)) {
				currentIndex += 1;
				$("#page-count").text(
					`${currentIndex + 1} / ${selectedAnecdotes.length}`
				);
				$("#title-input").val(
					$(selectedAnecdotes[currentIndex]).find(".anecdote-title").text()
				);
				$("#content-input").val(
					$(selectedAnecdotes[currentIndex]).find(".anecdote-content").text()
				);
			}
		});

		$("body").on("click", "#prev", function () {
			if (!(currentIndex == 0)) {
				currentIndex -= 1;
				$("#page-count").text(
					`${currentIndex + 1} / ${selectedAnecdotes.length}`
				);
				$("#title-input").val(
					$(selectedAnecdotes[currentIndex]).find(".anecdote-title").text()
				);
				$("#content-input").val(
					$(selectedAnecdotes[currentIndex]).find(".anecdote-content").text()
				);
			}
		});

		$("body").on("click", "#cancel-btn", function () {
			$("#input").removeClass("display-flex");
			$("#input").addClass("display-none");
		});

		function selectPlacements(anecdotePlacements) {
			jQuery.inArray("login", anecdotePlacements) !== -1
				? $(".input-checkbox[value='login']").prop("checked", true)
				: $(".input-checkbox[value='login']").prop("checked", false);

			jQuery.inArray("signup", anecdotePlacements) !== -1
				? $(".input-checkbox[value='signup']").prop("checked", true)
				: $(".input-checkbox[value='signup']").prop("checked", false);

			jQuery.inArray("create_event", anecdotePlacements) !== -1
				? $(".input-checkbox[value='create_event']").prop("checked", true)
				: $(".input-checkbox[value='create_event']").prop("checked", false);
		}

		$("body").on("click", "#publish-btn", function () {
			let anecdotePlacements = $(selectedAnecdotes[currentIndex])
				.find(".anecdote-placements")
				.text()
				.split(",");
			selectPlacements(anecdotePlacements);

			let payload = {
				title: $("#title-input").val(),
				content: $("#content-input").val(),
				placements: anecdotePlacements,
				author_uid: $(selectedAnecdotes[currentIndex]).attr("uid"),
				status: "published",
			};

			let anecdoteTid = $(selectedAnecdotes[currentIndex]).attr("tid");

			$("#title-input").val("");
			$("#content-input").val("");

			doAjax({
				type: "PUT",
				url: `/app/annecdote/${anecdoteTid}`,
				method: "PUT",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(payload),
			}).then(function (response) {
				console.log(response);
			});

			ajaxify.go("/admin/manage/anecdotes/saved");
		});

		$("body").on("click", "#draft-btn", function () {
			let anecdotePlacements = $(selectedAnecdotes[currentIndex])
				.find(".anecdote-placements")
				.text()
				.split(",");
			selectPlacements(anecdotePlacements);

			let payload = {
				title: $("#title-input").val(),
				content: $("#content-input").val(),
				placements: anecdotePlacements,
				author_uid: $(selectedAnecdotes[currentIndex]).attr("uid"),
				status: "draft",
			};

			let anecdoteTid = $(selectedAnecdotes[currentIndex]).attr("tid");

			$("#title-input").val("");
			$("#content-input").val("");

			doAjax({
				type: "PUT",
				url: `/app/annecdote/${anecdoteTid}`,
				method: "PUT",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(payload),
			}).then(function (response) {
				console.log(response);
			});

			ajaxify.go("/admin/manage/anecdotes/saved");
		});

		$("body").on("click", "#preview-btn", function () {
			let data = {
				name: $(selectedAnecdotes[currentIndex]).find(".author-name").text(),
				title: $(selectedAnecdotes[currentIndex])
					.find(".anecdote-title")
					.text(),
				content: $(selectedAnecdotes[currentIndex])
					.find(".anecdote-content")
					.text(),
				userslug: $(selectedAnecdotes[currentIndex]).attr("userslug"),
				imgsrc: $(selectedAnecdotes[currentIndex]).attr("imgsrc"),
			};
			$("#carousal-content").empty();
			$("#carousal-content").append(_templates.preview(data));
			$("#page-count-car").text(
				`${currentIndex + 1} / ${selectedAnecdotes.length}`
			);

			let carousalIndex = currentIndex;

			let anecdotePlacements = $(selectedAnecdotes[carousalIndex])
				.find(".anecdote-placements")
				.text()
				.split(",");
			selectPlacements(anecdotePlacements);

			$("body").on("click", "#prev-carousal", function () {
				carousalIndex != 0 && carousalIndex--;
				let data = {
					name: $(selectedAnecdotes[carousalIndex]).find(".author-name").text(),
					title: $(selectedAnecdotes[carousalIndex])
						.find(".anecdote-title")
						.text(),
					content: $(selectedAnecdotes[carousalIndex])
						.find(".anecdote-content")
						.text(),
				};
				$("#carousal-content").empty();
				$("#carousal-content").append(_templates.preview(data));
				$("#page-count-car").text(
					`${carousalIndex + 1} / ${selectedAnecdotes.length}`
				);

				console.log(selectedAnecdotes[carousalIndex]);
				anecdotePlacements = $(selectedAnecdotes[carousalIndex])
					.find(".anecdote-placements")
					.text()
					.split(",");
				selectPlacements(anecdotePlacements);
			});

			$("body").on("click", "#next-carousal", function () {
				carousalIndex != selectedAnecdotes.length - 1 && carousalIndex++;
				let data = {
					name: $(selectedAnecdotes[carousalIndex]).find(".author-name").text(),
					title: $(selectedAnecdotes[carousalIndex])
						.find(".anecdote-title")
						.text(),
					content: $(selectedAnecdotes[carousalIndex])
						.find(".anecdote-content")
						.text(),
				};
				$("#carousal-content").empty();
				$("#carousal-content").append(_templates.preview(data));
				$("#page-count-car").text(
					`${carousalIndex + 1} / ${selectedAnecdotes.length}`
				);

				console.log(selectedAnecdotes[carousalIndex]);
				anecdotePlacements = $(selectedAnecdotes[carousalIndex])
					.find(".anecdote-placements")
					.text()
					.split(",");
				selectPlacements(anecdotePlacements);

				console.log(anecdotePlacements);
			});

			$("body").on("click", "#publish-car", function () {
				const placementsSelected = $(".input-checkbox:checked");
				let placementLocs = [];
				for (let index = 0; index < placementsSelected.length; index++) {
					const placementLoc = placementsSelected[index];
					placementLocs.push($(placementLoc).val());
				}

				if (placementLocs.length == 0)
					alert("Please pick where the anecdote has to be deployed");
				else {
					let payload = {
						title: $("#title-input").val(),
						content: $("#content-input").val(),
						placements: placementLocs,
						author_uid: $(selectedAnecdotes[carousalIndex]).attr("uid"),
						status: "published",
					};

					let anecdoteTid = $(selectedAnecdotes[carousalIndex]).attr("tid");

					$("#title-input").val("");
					$("#content-input").val("");

					doAjax({
						type: "PUT",
						url: `/app/annecdote/${anecdoteTid}`,
						method: "PUT",
						dataType: "json",
						contentType: "application/json",
						data: JSON.stringify(payload),
					}).then(function (response) {
						console.log(response);
					});

					$("#previewModal").modal("hide");

					ajaxify.go("/admin/manage/anecdotes/saved");
				}
			});

			$("body").on("click", "#draft-car", function () {
				const placementsSelected = $(".input-checkbox:checked");
				let placementLocs = [];
				for (let index = 0; index < placementsSelected.length; index++) {
					const placementLoc = placementsSelected[index];
					placementLocs.push($(placementLoc).val());
				}

				if (placementLocs.length == 0)
					alert("Please pick where the anecdote has to be deployed");
				else {
					let payload = {
						title: $("#title-input").val(),
						content: $("#content-input").val(),
						placements: placementLocs,
						author_uid: $(selectedAnecdotes[carousalIndex]).attr("uid"),
						status: "draft",
					};

					let anecdoteTid = $(selectedAnecdotes[carousalIndex]).attr("tid");

					$("#title-input").val("");
					$("#content-input").val("");

					doAjax({
						type: "PUT",
						url: `/app/annecdote/${anecdoteTid}`,
						method: "PUT",
						dataType: "json",
						contentType: "application/json",
						data: JSON.stringify(payload),
					}).then(function (response) {
						console.log(response);
					});

					$("#previewModal").modal("hide");

					ajaxify.go("/admin/manage/anecdotes/saved");
				}
			});
		});

		$("#title-input").on("change", function () {
			$(selectedAnecdotes[currentIndex])
				.find(".anecdote-title")
				.text($("#title-input").val());
		});

		$("#content-input").on("change", function () {
			$(selectedAnecdotes[currentIndex])
				.find(".anecdote-content")
				.text($("#content-input").val());
		});

		$("#title-input").on("change", function () {
			$(selectedAnecdotes[currentIndex])
				.find(".anecdote-title")
				.text($("#title-input").val());
		});

		$("#content-input").on("change", function () {
			$(selectedAnecdotes[currentIndex])
				.find(".anecdote-content")
				.text($("#content-input").val());
		});
	};

	return saved;
});
