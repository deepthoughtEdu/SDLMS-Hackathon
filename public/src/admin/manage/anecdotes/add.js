"use strict";

define("admin/manage/anecdotes/add", ["api"], function (api) {
	//* here we are defining add module !
	var add = {};

	add.init = function () {
		const _templates = {
			userInfo: function (data) {
				return `<div class="user-profile-picture">
					<img
						src="${data.picture}"
						alt="user-img" class="margin-right-3 object-cover square-85 border-radius-circle">
				</div>
				<div class="user-details display-flex column-flex margin-left-3">
					<div class="user-name primary-text font-20 font-semi-bold">${data.displayname}</div>
					<div class="user-name primary-text font-semi-bold margin-top-3">${data.userslug}</div>
				</div>`;
			},
			reflectionListing: function (data) {
				return `<tr class="reflection-listing" uid=${data.uid} displayname=${data.displayname} userslug=${data.userslug} imgsrc=${data.imgsrc}>
							<th scope="row">${data.index}</th>
							<td>${data.content}</td>
						</tr>`;
			},
			carousalContent: function (data) {
				return `<div class=" anecdote display-flex column-flex bg-layer p-5 border-0 rounded-15-px" id="anecdote-listing" uid=${data.uid}>
							<div class="anecdote-user-info display-flex ai-center margin-bottom-3">
								<div class="anecdote-user-avatar margin-right-5">
								<img
							src="${data.imgsrc}"
							alt="user-img" class="margin-right-3 object-cover square-85 border-radius-circle">
								</div>
								<div class="anecdotes-user-details display-flex column-flex">
								<div class="user-name primary-text font-20 font-semi-bold" id="author-name">${data.displayname}</div>
								<div class="user-name primary-text font-semi-bold margin-top-2" id="author-slug">${data.userslug}</div>
								</div>
							</div>
							<div class="anecdote-content">
								<p class="primary-text margin-bottom-4 font-bold" id="anecdoteTitle">${data.title}</p>
								<p class="primary-text" id="anecdoteContent">${data.content}</p>
							</div>
						</div>`;
			},
		};

		$("body").on("click", function () {
			$("#username-search").is(":focus")
				? $("#users-menu").removeClass("display-none")
				: $("#users-menu").addClass("display-none");
		});

		$("body").on("keyup", "#username-search", function () {
			$.ajax({
				url:
					config.relative_path +
					`/api/users?query=${$(this).val()}&paginate=true`,
				type: "GET",
				dataType: "json",
				success: function (res) {
					$("#menu-content").empty();
					for (
						let index = 0;
						index < (res.users.length > 10 ? 10 : res.users.length);
						index++
					) {
						const user = res.users[index];
						$("#menu-content").append(
							`<p class="text-center user-listing" uid=${user.uid} imgsrc=${user.picture} userslug=${user.userslug}>${user.displayname}</p>`
						);
					}
				},
			});
		});

		$("body").on("click", ".user-listing", function () {
			const userDetails = {
				uid: $(this).attr("uid"),
				userslug: $(this).attr("userslug"),
				picture: $(this).attr("picture"),
				displayname: $(this).text(),
			};

			$("#user-info").empty();
			$("#user-info").append(_templates.userInfo(userDetails));

			doAjax({
				type: "GET",
				url: `/app/reflections?limit=5&uid=${userDetails.uid}`,
				data: {},
			}).then(function (response) {
				console.log(response);

				$("#table-body").empty();

				for (let index = 0; index < response.response.data.length; index++) {
					const reflection = response.response.data[index];
					const data = {
						index: index + 1,
						content: reflection.content,
						uid: reflection.user.uid,
						displayname: reflection.user.displayname,
						userslug: reflection.user.userslug,
						imgsrc: reflection.user.picture,
					};
					$("#table-body").append(_templates.reflectionListing(data));
				}

				$("#filters-dropdown").addClass("display-flex");
				$("#filters-dropdown").removeClass("display-none");
				$("#table").removeClass("display-none");
				$("#container-right").addClass("display-flex");
				$("#container-right").removeClass("display-none");
			});
		});

		$("body").on("click", ".reflection-listing", function () {
			let listings = $(".reflection-listing");

			for (let index = 0; index < listings.length; index++) {
				const listing = listings[index];
				$(listing).removeClass("background-secondary text-white");
			}

			$(this).addClass("background-secondary text-white");
			$("#content-input").val($(this).find("td").text());
		});

		// save final anecdote
		$("body").on("click", "#save-btn", function () {
			let payload = {
				title: $("#title-input").val(),
				content: $("#content-input").val(),
				placements: [],
				author_uid: 71,
				status: "draft",
			};

			$("#title-input").val("");
			$("#content-input").val("");

			api.post("/app/annecdote", payload).then(function (response) {
				console.log("anecdote saved", response);
			});

			ajaxify.go("/admin/manage/anecdotes");
		});

		// populating modal
		$("body").on("click", "#modal-btn", function () {
			const selectedListing = $("tr.background-secondary.text-white");

			const carousalData = {
				title: $("#title-input").val(),
				content: $("#content-input").val(),
				uid: $(selectedListing).attr("uid"),
				displayname: $(selectedListing).attr("displayname"),
				userslug: $(selectedListing).attr("userslug"),
				imgsrc: $(selectedListing).attr("imgsrc"),
			};

			$("#carousal-content").empty();
			$("#carousal-content").append(_templates.carousalContent(carousalData));
		});

		// save anecdote with placement listings
		$("body").on("click", "#save-btn-car", function () {
			const placementsSelected = $(".placement-option:checked");
			let placementLocs = [];
			for (let index = 0; index < placementsSelected.length; index++) {
				const placementLoc = placementsSelected[index];
				placementLocs.push($(placementLoc).val());
			}

			let payload = {
				title: $("#anecdoteTitle").text(),
				content: $("#anecdoteContent").text(),
				placements: placementLocs,
				author_uid: $("#anecdote-listing").attr("uid"),
				status: "draft",
			};

			$("#title-input").val("");
			$("#content-input").val("");

			api.post("/app/annecdote", payload).then(function (response) {
				console.log("anecdote saved", response);
			});

			$("#previewModal").modal("hide");

			ajaxify.go("/admin/manage/anecdotes");
		});

		// Final anecdote publishing
		$("body").on("click", "#submit-btn-car", function () {
			const placementsSelected = $(".placement-option:checked");
			let placementLocs = [];
			for (let index = 0; index < placementsSelected.length; index++) {
				const placementLoc = placementsSelected[index];
				placementLocs.push($(placementLoc).val());
			}

			if (placementLocs.length == 0)
				alert("Please pick where the anecdote has to be deployed");
			else {
				let payload = {
					title: $("#anecdoteTitle").text(),
					content: $("#anecdoteContent").text(),
					placements: placementLocs,
					author_uid: $("#anecdote-listing").attr("uid"),
					status: "published",
				};

				$("#title-input").val("");
				$("#content-input").val("");

				api.post("/app/annecdote", payload).then(function (response) {
					console.log("anecdote saved", response);
				});

				$("#previewModal").modal("hide");

				ajaxify.go("/admin/manage/anecdotes");
			}
		});
	};

	return add;
});
