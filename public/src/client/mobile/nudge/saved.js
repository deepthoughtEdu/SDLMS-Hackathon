"use strict";

/* globals define */

define("forum/mobile/nudge/saved", function () {
	var saved = {};

	saved.init = function () {
		const _templates = {
			listing: function(data) {
				return `<div class="d-flex justify-content-between align-items-center mt-3 mb-1 container" nudgeId=${data.tid}>
							<img src="https://sdlms.deepthought.education${data.image}" alt="random-img"
								class="img-cover listing-img rounded-lg">
							<div class="nudge-details ml-2 mr-1">
								<p class="font-14 font-medium mb-0">${data.title}</p>
								<p class="font-12 brand-text mb-0">by ${data.user.fullname}</p>
								<p class="mb-0 mt-3 font-12 truncate-line-2">${data.description}</p>
							</div>
							<i class="fa-solid fa-chevron-right"></i>
						</div>
						<hr class="mt-2">`
			}
		}

		async function appendNudges(pageNumber = 0) {

			let getNudges = new Promise((resolve, reject) => {
				doAjax({
					type: 'GET',
					url: `/app/saved/nudge?page=${pageNumber}`,
					data: {},
				}).then(function (res) {
					let pageCount = res.response.last_page + 1;
					let pageData = res.response.data;
					let nudges = {
						pageCount,
						pageData
					}

					resolve(nudges);
					reject("no data");
				})
			})

			let nudges = await getNudges;

			nudges.pageData.map((data) => $("#page-container").append(_templates.listing(data)));
			return nudges;
		}

		appendNudges().then(
			function(nudges) {
				console.log("Nudges", nudges);

				// lazy load nudges
				let check = {
					root: null,
					rootMargin: "0px",
					threshold: 0.1,
				};
				let nudgePage = 1;

				let nudgesObserver = new IntersectionObserver((entries) =>{
					if(entries[0].isIntersecting && nudgePage < nudges.pageCount){
						appendNudges(nudgePage);
						nudgePage ++;
					}
				}, check);
				nudgesObserver.observe(document.getElementById("page-checker"));
			}
		)
	};

	return saved;
});
