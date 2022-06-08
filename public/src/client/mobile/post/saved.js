"use strict";

/* globals define */

define("forum/mobile/post/saved", function () {
	var saved = {};

	saved.init = function () {
		let validClick = false;

		console.log("saved posts");

		$("body").on("click", ".post-settings", function () {
			$(this).siblings(".reader-options").removeClass("d-none")
		})

		$("body").on("click", function (e) {
			let settingsBtns = $(".post-settings")
			let readerMenus = $(".reader-options")
			let authorMenus = $(".author-options")

			for (let index = 0; index < readerMenus.length; index++) { 
				if(!$(readerMenus[index]).hasClass("d-none")) {
					for (let i = 0; i < readerMenus.length; i++) {
						if($.contains(settingsBtns[i], e.target))	validClick = true;
					}
					validClick && readerMenus[index].addClass("d-none")
				}

				if(!$(authorMenus[index]).hasClass("d-none")) {
					for (let i = 0; i < readerMenus.length; i++) {
						if($.contains(settingsBtns[i], e.target))	validClick = true;
					}
					validClick && authorMenus[index].addClass("d-none")
				}
			}

			!$.contains($(".post-settings")[0], e.target) && console.log("closing");

		})

		const _templates = {
			listing: function(data) {
				return `<div class="article-container container pt-3 rounded-10-px bg-white mt-3" tid=${data.tid} cid="${data.cid}" subcid="${data.sub_cid}">
							<!-- article-header starts here -->
							<div id="post-author" class="d-flex justify-content-between align-items-center mb-2">
								<div id="post-author-details" class="d-flex">
									<img src="${app.user.signature}"
										alt="author-avatar" class="circle-lg overflow-hidden rounded-circle img-cover">
									<div id="post-meta" class="ml-2">
										<p class="mb-0 font-14 font-medium">${data.user.fullname}</p>
										<p class="mb-0 brand-text font-10">${data.user.signature}Amet minim mollit non deserunt</p>
										<p class="font-10 mb-0">${moment(data.timestamp).format("MMMM DD, YYYY")}</p>
									</div>
								</div>
								<div class="post-settings mr-3">
									<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/settings-icon.svg"
										alt="settings" class="overflow-hidden">
								</div>
								<div class="author-options p-3 floating-right-bottom shadow-sm secondary-bg rounded-10-px d-none">
									<div class="d-flex align-items-center mb-3" id="edit-btn">
										<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/edit.svg" alt="edit-icon">
										<p class="font-8 ml-2 mb-0">Edit</p>
									</div>
									<div class="d-flex align-items-center mb-3">
										<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/share.svg" alt="share-icon">
										<p class="font-8 ml-2 mb-0">Share</p>
									</div>
									<div class="d-flex align-items-center mb-3">
										<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/bookmark.svg"
											alt="save-icon">
										<p class="font-8 ml-2 mb-0">Save</p>
									</div>
									<div class="d-flex align-items-center mb-3">
										<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/repost.svg"
											alt="repost-icon">
										<p class="font-8 ml-2 mb-0">Repost</p>
									</div>
									<div class="d-flex align-items-center" id="delete-btn">
										<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/delete.svg"
											alt="delete-icon">
										<p class="font-8 ml-2 mb-0">Delete</p>
									</div>
								</div>
								<div class="reader-options p-3 floating-right-bottom shadow-sm secondary-bg rounded-10-px d-none">
									<div class="d-flex align-items-center mb-3">
										<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/share.svg" alt="share-icon">
										<p class="font-8 ml-2 mb-0">Share</p>
									</div>
									<div class="d-flex align-items-center mb-3">
										<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/bookmark.svg"
											alt="save-icon">
										<p class="font-8 ml-2 mb-0">Save</p>
									</div>
									<div class="d-flex align-items-center">
										<img src="https://blog.deepthought.education/wp-content/uploads/2022/04/report.svg"
											alt="report-icon">
										<p class="font-8 ml-2 mb-0">Report</p>
									</div>
								</div>
							</div>
							<!-- article-header ends here -->
							<!-- article-content starts here -->
							<div id="article-content-container"
								class="d-flex justify-content-center align-items-center overflow-hidden">
								<div id="article-content" class="rounded-10-px primary-border p-2">
									<p class="font-12">${data.content}</p>

									<img src="${data.image}"
										alt="header-img" class="img-cover component-full rounded-10-px height-160 mb-1">
								</div>
							</div>

							<!-- article-content ends here -->
							<!-- article-discussion-comments starts here -->
							<div id="article-discussion-comments"
								class="d-flex justify-content-end align-items-center font-8 line-height-12px article-discussion-comments-color mr-2 pt-2">
								<div id="article-comments-count">
									<p class="mb-2">10 comments </p>
								</div>
							</div>
						</div>`
			}
		}

		async function appendPosts(pageNumber = 0) {

			let getPosts = new Promise((resolve, reject) => {
				doAjax({
					type: 'GET',
					url: `/app/saved/post?page=${pageNumber}`,
					data: {},
				}).then(function (res) {
					console.log("printing api result\t\t",res);

					let pageCount = res.response.last_page + 1;
					let pageData = res.response.data;
					let posts = {
						pageCount,
						pageData
					}

					resolve(posts);
					reject("no data");
				})
			})

			let posts = await getPosts;

			posts.pageData.map((data) => $("#page-container").append(_templates.listing(data)));
			return posts;
		}

		appendPosts().then(
			function(posts) {
				console.log("Posts", posts);

				// lazy load posts
				let check = {
					root: null,
					rootMargin: "0px",
					threshold: 0.1,
				};
				let postPage = 1;

				let postsObserver = new IntersectionObserver((entries) =>{
					if(entries[0].isIntersecting && postPage < posts.pageCount){
						appendPosts(postPage);
						postPage ++;
					}
				}, check);
				postsObserver.observe(document.getElementById("page-checker"));
			}
		)
	};

	return saved;
});
