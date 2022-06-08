"use strict";

define("admin/manage/rigorRank", function () {
	//* here we are defining rigorRank module !
	var rigorRank = {};

	rigorRank.init = function () {
		const _templates = {
			listing: function(data) {
				return `<tr class="table__tr table__tr--gray">
							<td class="text__black u-pd-left-sm">${data.index}</td>
							<td class="text__black">${data.username}</td>
							<td class="text__black">${data.rigor_rank}</td>
						</tr>`
			}
		}

		let { rankedUsers } = ajaxify.data;
		$("#rr-display").empty()
		$.each(rankedUsers, function(index, rankedUser) {
			console.log(rankedUser);
			rankedUser.index = index + 1;
			$("#rr-display").append(_templates.listing(rankedUser))
		})

		$("#download-rr-btn").on("click", function () {
			ajaxify.go("/api/v3/app/csv/rigorrank");
		});

		$("body").on("change", "#csvInput", function() {
			if($("#csvInput")[0].files.length == 0)	alert("Please attach a CSV file to be uploaded");
			else {
				const formData = new FormData($("#csv-upload-form")[0]);
				console.log(...formData);

				doAjax({
					type: 'PUT',
					url: "/app/rigorrank",
					data: formData,
					cache: false,
					contentType: false,
					processData: false,
				}).then(function (response) {
					console.log(response);
					ajaxify.go("/admin/manage/rigorRank");
				})
			}
		})
	};

	return rigorRank;
});
