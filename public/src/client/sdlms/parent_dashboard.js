"use strict";

define("forum/sdlms/parent_dashboard", [
	"api",
	"sdlms/threadbuilder",
	"sdlms/eaglebuilder",
	"sdlms/feedbacks",
], function (api, tb, eb, fb) {
	var parentDashboard = {};

	parentDashboard.init = function () {

		// session statics
			$("#change-header1").text("words Typed")
			$("#change-header2").text("Thread Captured")
			$("body").on("click", ".change-view", function (e) {
				if ($(".sdlms-sections").find(".change-class").data("view") == "smaller") {
					$(".sdlms-parentDashboard-view").toggleClass("change-class");
					$(".dashboard-sessionIndex").toggleClass("change-class");
					$(".sdlms-asset-view").removeClass("change-class");
					$(".feedback-sections").addClass("change-class");
					$(".question-sections").addClass("change-class");
					parentDashboard.initThreadBuilder(
						$(this).data("tid"),
						$(this).data("topic")
					);
					parentDashboard.initEagleBuilder(
						$(this).data("tid"),
						$(this).data("topic")
					);
				} else {
					$(".sdlms-asset-view").removeClass("change-class");
					$(".feedback-sections").addClass("change-class");
					$(".question-sections").addClass("change-class");
					parentDashboard.initThreadBuilder(
						$(this).data("tid"),
						$(this).data("topic")
					);
					parentDashboard.initEagleBuilder(
						$(this).data("tid"),
						$(this).data("topic")
					);
				}
			});
			 parentDashboard.paginateSessions(`/sdlms/getsessions?limitBy=5&page=0&type=previous`, {
				parent: "sdlms-my-upcoming-session-table-body"
			})



		
		parentDashboard.initEagleBuilder();
        parentDashboard.initThreadBuilder();
		$("[asset-selection-label].active")
			.off("click")
			.on("click", function () {
				$(".assetSelectionDropDown").slideToggle();
				$(this).toggleClass("visibility-shown");
				let $this = $(this);
				$(".assetSelectionDropDown")
					.find("[get-asset]")
					.off("click")
					.on("click", function () {
						$("#studentAssetView")
							.empty()
							.removeClass(
								"h-100 w-100 text-center d-flex justify-content-center align-items-center"
							);
						$("[asset-selection-label]").text(
							`${$(this).data("type") == "fr"
								? "Feedback Received"
								: "Feedback Given"
							}`
						);
						$("[asset-selection-label]").data("fbType", $(this).data("type"));
						$(".assetSelectionDropDown").slideToggle();
						$(".assetSelectionDropDown")
							.find("[get-asset]")
							.removeClass("active");
						$(this).addClass("active");
						// LIVE_CLASS.getAsset($this.data('uid'), $(this).data('type'));
						$(this).data("type") == "fr"
							? parentDashboard.paginateFeedback(
								`/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}`,
								{
									parent: "sdlms-mb-feedback-section",
								}
							)
							: parentDashboard.paginateFeedback(
								`/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}&type=given`,
								{
									parent: "sdlms-mb-feedback-section",
								}
							);
					});
			});



			
	};
	// $('body').on('click','.change-view',(e)=>{
	// 	$('.sdlms-parentDashboard-view').addClass('change-class');
	// 	if($(".sdlms-sections").find(".change-class").data("view") != "smaller"){
	// 		$('.dashboard-sessionIndex').toggleClass('change-class');
	// 		$('.sdlms-asset-view').toggleClass('change-class');
	// 		parentDashboard.initThreadBuilder($(this).data('tid'),$(this).data('topic'))
	// 		parentDashboard.initEagleBuilder($(this).data('tid'),$(this).data('topic'))
	// 	}
	// 	else{
	// 		parentDashboard.initThreadBuilder($(this).data('tid'),$(this).data('topic'))
	// 		parentDashboard.initEagleBuilder($(this).data('tid'),$(this).data('topic'))
	// 	}
	// })
	$("[data-type = 'navigation']").on("click", function () {

		let navigate = $(this).data("navigate") || -1
		if (navigate == -1) {
			$("#change-header1").text("words Typed")
			$("#change-header2").text("Thread Captured")
			$("body").on("click", ".change-view", function (e) {
				if ($(".sdlms-sections").find(".change-class").data("view") == "smaller") {
					$(".sdlms-parentDashboard-view").toggleClass("change-class");
					$(".dashboard-sessionIndex").toggleClass("change-class");
					$(".sdlms-asset-view").removeClass("change-class");
					$(".feedback-sections").addClass("change-class");
					$(".question-sections").addClass("change-class");
					parentDashboard.initThreadBuilder(
						$(this).data("tid"),
						$(this).data("topic")
					);
					parentDashboard.initEagleBuilder(
						$(this).data("tid"),
						$(this).data("topic")
					);
				} else {
					$(".sdlms-asset-view").removeClass("change-class");
					$(".feedback-sections").addClass("change-class");
					$(".question-sections").addClass("change-class");
					parentDashboard.initThreadBuilder(
						$(this).data("tid"),
						$(this).data("topic")
					);
					parentDashboard.initEagleBuilder(
						$(this).data("tid"),
						$(this).data("topic")
					);
				}
			});
			 parentDashboard.paginateSessions(`/sdlms/getsessions?limitBy=5&page=0&type=previous`, {
				parent: "sdlms-my-upcoming-session-table-body"
			})
		}
		else if (navigate == 1) {
			$("#change-header1").text("no of feedbacks")
			$("#change-header2").text("Teacher Feedback")
			$("body").on("click", ".change-view", function (e) {
				if ($(".sdlms-sections").find(".change-class").data("view") == "smaller") {
					$(".sdlms-parentDashboard-view").toggleClass("change-class");
					$(".dashboard-sessionIndex").toggleClass("change-class");
					$(".sdlms-asset-view").addClass("change-class");
					$(".feedback-sections").removeClass("change-class");
					$(".question-sections").addClass("change-class");
					
					parentDashboard.paginateFeedback(
						`/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}&sessionIDs=${$(this).data('attachment-id')}`,
						{
							parent: "sdlms-mb-feedback-section",
						}
					);
				} else {
					$(".sdlms-asset-view").addClass("change-class");
					$(".feedback-sections").removeClass("change-class");
					$(".question-sections").addClass("change-class");
					parentDashboard.paginateFeedback(
						`/sdlms/feedbacks?uid=${ajaxify.data.user[0].uid}&sessionIDs=${$(this).data('attachment-id')}`,
						{
							parent: "sdlms-mb-feedback-section",
						}
					);
				}
			});
			 parentDashboard.paginatefeedbacks(`/sdlms/getsessions?limitBy=5&page=0&type=previous`, {
				parent: "sdlms-my-upcoming-session-table-body"
			})
		}
		else if(navigate == 2) {
			console.log($(this).data("navigate"))
			$("#change-header1").text("Questions asked")
			$("#change-header2").text("class average")
			$("body").on("click", ".change-view", function (e) {
				if ($(".sdlms-sections").find(".change-class").data("view") == "smaller") {
					$(".sdlms-parentDashboard-view").toggleClass("change-class");
					$(".dashboard-sessionIndex").toggleClass("change-class");
					$(".sdlms-asset-view").addClass("change-class");
					$(".feedback-sections").addClass("change-class");
					$(".question-sections").removeClass("change-class");
				} else {
					$(".sdlms-asset-view").addClass("change-class");
					$(".feedback-sections").addClass("change-class");
					$(".question-sections").removeClass("change-class");
				}
			});
			 parentDashboard.paginatequestions(`/sdlms/getsessions?limitBy=5&page=0&type=previous`, {
				parent: "sdlms-my-upcoming-session-table-body"
			})
		}
	})
	$(".sdlms-container").find(".page-navigator").off("click").on("click", function () {
		let url = $(this).data("url")
		console.log(url)
		if (url) {
			parentDashboard.paginateSessions(url, {
				parent: "sdlms-my-upcoming-session-table-body",
			})
		}
		// data-sdlms-type ==> .data("sdlmsType")

	})
	$(".sdlms-container").find(".page-navigator").off("click").on("click", function () {
		let url = $(this).data("url")
		console.log(url)
		if (url) {
			parentDashboard.paginateFeedbacks(url, {
				parent: "sdlms-my-upcoming-session-table-body",
			})
			return
		}
		// data-sdlms-type ==> .data("sdlmsType")

	})
	$(".sdlms-container").find(".page-navigator").off("click").on("click", function () {
		let url = $(this).data("url")
		console.log(url)
		if (url) {
			parentDashboard.paginatequestions(url, {
				parent: "sdlms-my-upcoming-session-table-body",
			})
			return
		}
		// data-sdlms-type ==> .data("sdlmsType")

	})
	
	$('[exittomain]').on('click',()=>{
		$('#expanded-view').removeClass("change-class");
		$('[smaller-view]').addClass("change-class");
		$(".dashboard-sessionIndex").removeClass("change-class");
		$(".sdlms-asset-view").addClass("change-class");
		$(".feedback-sections").addClass("change-class");
		$(".question-sections").addClass("change-class");
	})
	parentDashboard.paginateSessions = (
		url = "/sdlms/getsessions?limitBy=5&page=0&type=previous",
		data = {}
	) => {
		$(".sdlms-container").find(`.${data.parent}`).empty();
		api.get(url, {}).then((res) => {
			console.log(res)
			
			res.data.map((ev, index) => {
				$(".sdlms-container").find(`.${data.parent}`).append(` 
				${$(".sdlms-sections").find(".change-class").data("view") == "smaller"
						? `
				<tr class="sdlms-my-upcoming-session-table-row ">
				<td class="sdlms-my-upcoming-session-table-Sno font-weight-500 sdlms-text-black-18px dashboard-sessionIndex">${index + 1 + res.from
						}</td>
				<td class="sdlms-my-upcoming-session-table-Session-topic font-weight-500 sdlms-text-black-18px">
									${ev.topic}</td>
									<td class="sdlms-my-upcoming-session-table-date font-weight-500 sdlms-text-black-18px">
										${moment(ev.schedule).format("ddd, DD MMM, YYYY")}  <br />
											<span class="sdlms-my-upcoming-session-table-time font-weight-500 sdlms-text-black-18px">
													${moment(ev.schedule).format("hh:mm A")}
											</span>
									</td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px dashboard-sessionIndex"> ${(ev.threadbuilderStats && ev.threadbuilderStats.count) ? ev.threadbuilderStats.count.words : 0 } </td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px dashboard-sessionIndex"> ${ev.threadbuilderStats && ev.threadbuilderStats.count ? ev.threadbuilderStats.count.threads : 0 } </td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px  change-view" data-tid=${ev.tid} data-topic=${ev.topic} >  
				<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6324 16H2.07904V2H9.3557V0H2.07904C0.925175 0 0 0.9 0 2V16C0 17.1 0.925175 18 2.07904 18H16.6324C17.7758 18 18.7114 17.1 18.7114 16V9H16.6324V16ZM11.4347 0V2H15.1666L4.94814 11.83L6.41387 13.24L16.6324 3.41003V7H18.7114V0H11.4347Z" fill="#323232"/>
				</svg>
			</td>   
				</tr>
				`
						: `
				<tr class="sdlms-my-upcoming-session-table-row ">
				<td class="sdlms-my-upcoming-session-table-Session-topic font-weight-500 sdlms-text-black-18px">
						${ev.topic}</td>
				<td class="sdlms-my-upcoming-session-table-date font-weight-500 sdlms-text-black-18px">
					${moment(ev.schedule).format("ddd, DD MMM, YYYY")}  <br />
						<span class="sdlms-my-upcoming-session-table-time font-weight-500 sdlms-text-black-18px">
							${moment(ev.schedule).format("hh:mm A")}
						</span>
				</td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px change-view" data-tid=${ev.tid} data-topic=${ev.topic} >  
				<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6324 16H2.07904V2H9.3557V0H2.07904C0.925175 0 0 0.9 0 2V16C0 17.1 0.925175 18 2.07904 18H16.6324C17.7758 18 18.7114 17.1 18.7114 16V9H16.6324V16ZM11.4347 0V2H15.1666L4.94814 11.83L6.41387 13.24L16.6324 3.41003V7H18.7114V0H11.4347Z" fill="#323232"/>
				</svg>
			</td>
				</tr>
				
				`
					}`);
			});
			$(".sdlms-container")
				.find(".sessions-page")
				.val(res.current_page + 1);
			$(".sdlms-container")
				.find(".sessions-page-count")
				.text(res.last_page + 1);
			$(".sdlms-container")
				.find(".page-navigator.next")
				.data("url", res.next_page_url);
			$(".sdlms-container")
				.find(".page-navigator.prev")
				.data("url", res.prev_page_url);
		});
	};
	
	parentDashboard.paginatefeedbacks = (
		url,
		data = {}
	) => {

		$(".sdlms-container").find(`.${data.parent}`).empty();
		api.get(url, {}).then((res) => {
			
			res.data.map((ev, index) => {
				console.log("hello this is feedbacks")
				console.log(ev)
				$(".sdlms-parentDashboard-view").find(`.${data.parent}`).append(` 
				${$(".sdlms-sections").find(".change-class").data("view") == "smaller"
						? `
				<tr class="sdlms-my-upcoming-session-table-row ">
				<td class="sdlms-my-upcoming-session-table-Sno font-weight-500 sdlms-text-black-18px dashboard-sessionIndex">${index + 1 + res.from
						}</td>
				<td class="sdlms-my-upcoming-session-table-Session-topic font-weight-500 sdlms-text-black-18px">
									${ev.topic}</td>
									<td class="sdlms-my-upcoming-session-table-date font-weight-500 sdlms-text-black-18px">
										${moment(ev.schedule).format("ddd, DD MMM, YYYY")}  <br />
											<span class="sdlms-my-upcoming-session-table-time font-weight-500 sdlms-text-black-18px">
													${moment(ev.schedule).format("hh:mm A")}
											</span>
									</td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px dashboard-sessionIndex">  ${(ev.threadbuilderStats && ev.threadbuilderStats.remark) ? ev.threadbuilderStats.remark.length : 0 }</td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px dashboard-sessionIndex"> -- </td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px  change-view" data-attachment-id=${ev._id} data-topic=${ev.topic} >  
				<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6324 16H2.07904V2H9.3557V0H2.07904C0.925175 0 0 0.9 0 2V16C0 17.1 0.925175 18 2.07904 18H16.6324C17.7758 18 18.7114 17.1 18.7114 16V9H16.6324V16ZM11.4347 0V2H15.1666L4.94814 11.83L6.41387 13.24L16.6324 3.41003V7H18.7114V0H11.4347Z" fill="#323232"/>
				</svg>
			</td>   
				</tr>
				`
						: `
				<tr class="sdlms-my-upcoming-session-table-row ">
				<td class="sdlms-my-upcoming-session-table-Session-topic font-weight-500 sdlms-text-black-18px">
						${ev.topic}</td>
				<td class="sdlms-my-upcoming-session-table-date font-weight-500 sdlms-text-black-18px">
					${moment(ev.schedule).format("ddd, DD MMM, YYYY")}  <br />
						<span class="sdlms-my-upcoming-session-table-time font-weight-500 sdlms-text-black-18px">
							${moment(ev.schedule).format("hh:mm A")}
						</span>
				</td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px change-view" data-attachment-id=${ev._id} data-topic=${ev.topic} >  
				<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6324 16H2.07904V2H9.3557V0H2.07904C0.925175 0 0 0.9 0 2V16C0 17.1 0.925175 18 2.07904 18H16.6324C17.7758 18 18.7114 17.1 18.7114 16V9H16.6324V16ZM11.4347 0V2H15.1666L4.94814 11.83L6.41387 13.24L16.6324 3.41003V7H18.7114V0H11.4347Z" fill="#323232"/>
				</svg>
			</td>
				</tr>
				
				`
					}`);
			});
			$(".sdlms-parentDashboard-view")
				.find(".sessions-page")
				.val(res.current_page + 1);
			$(".sdlms-parentDashboard-view")
				.find(".sessions-page-count")
				.text(res.last_page + 1);
			$(".sdlms-parentDashboard-view")
				.find(".page-navigator.next")
				.data("url", res.next_page_url);
			$(".sdlms-parentDashboard-view")
				.find(".page-navigator.prev")
				.data("url", res.prev_page_url);
		
			
		});
	};
	parentDashboard.paginatequestions = (
		url,
		data = {}
	) => {
		$(".sdlms-container").find(`.${data.parent}`).empty();
		api.get(url, {}).then((res) => {
			console.log("this is question session")
			res.data.map((ev, index) => {
				$(".sdlms-parentDashboard-view").find(`.${data.parent}`).append(` 
				${$(".sdlms-sections").find(".change-class").data("view") == "smaller"
						? `
				<tr class="sdlms-my-upcoming-session-table-row ">
				<td class="sdlms-my-upcoming-session-table-Sno font-weight-500 sdlms-text-black-18px dashboard-sessionIndex">${index + 1 + res.from
						}</td>
				<td class="sdlms-my-upcoming-session-table-Session-topic font-weight-500 sdlms-text-black-18px">
									${ev.topic}</td>
									<td class="sdlms-my-upcoming-session-table-date font-weight-500 sdlms-text-black-18px">
										${moment(ev.schedule).format("ddd, DD MMM, YYYY")}  <br />
											<span class="sdlms-my-upcoming-session-table-time font-weight-500 sdlms-text-black-18px">
													${moment(ev.schedule).format("hh:mm A")}
											</span>
									</td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px dashboard-sessionIndex">${(ev.threadbuilderStats && ev.threadbuilderStats.question) ? ev.threadbuilderStats.question.length : 0 } </td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px dashboard-sessionIndex">--</td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px" data-tid=${ev.tid
						} data-topic=${ev.topic} disabled>  
				<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6324 16H2.07904V2H9.3557V0H2.07904C0.925175 0 0 0.9 0 2V16C0 17.1 0.925175 18 2.07904 18H16.6324C17.7758 18 18.7114 17.1 18.7114 16V9H16.6324V16ZM11.4347 0V2H15.1666L4.94814 11.83L6.41387 13.24L16.6324 3.41003V7H18.7114V0H11.4347Z" fill="#323232"/>
				</svg>
			</td>   
				</tr>
				`
						: `
				<tr class="sdlms-my-upcoming-session-table-row ">
				<td class="sdlms-my-upcoming-session-table-Session-topic font-weight-500 sdlms-text-black-18px">
						${ev.topic}</td>
				<td class="sdlms-my-upcoming-session-table-date font-weight-500 sdlms-text-black-18px">
					${moment(ev.schedule).format("ddd, DD MMM, YYYY")}  <br />
						<span class="sdlms-my-upcoming-session-table-time font-weight-500 sdlms-text-black-18px">
							${moment(ev.schedule).format("hh:mm A")}
						</span>
				</td>
				<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px change-view" data-tid=${ev.tid
						} data-topic=${ev.topic} >  
				<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.6324 16H2.07904V2H9.3557V0H2.07904C0.925175 0 0 0.9 0 2V16C0 17.1 0.925175 18 2.07904 18H16.6324C17.7758 18 18.7114 17.1 18.7114 16V9H16.6324V16ZM11.4347 0V2H15.1666L4.94814 11.83L6.41387 13.24L16.6324 3.41003V7H18.7114V0H11.4347Z" fill="#323232"/>
				</svg>
			</td>
				</tr>
				
				`
					}`);
			});
			$(".sdlms-parentDashboard-view")
				.find(".sessions-page")
				.val(res.current_page + 1);
			$(".sdlms-parentDashboard-view")
				.find(".sessions-page-count")
				.text(res.last_page + 1);
			$(".sdlms-parentDashboard-view")
				.find(".page-navigator.next")
				.data("url", res.next_page_url);
			$(".sdlms-parentDashboard-view")
				.find(".page-navigator.prev")
				.data("url", res.prev_page_url);
		});
	};
	parentDashboard.initThreadBuilder = (tid, topic) => {
		var uid = ajaxify.data.user.at().uid;
		if (ajaxify.data.isStudent) {
			try {
				api
					.get(`/sdlms/${tid}/threadbuilder?uid=${uid}`, {})
					.then((r) => {

						let data = {
							meta: r.meta,
							threads: r.threads,
							conclusion: r.conclusion || {},
						};
					
						new threadBuilder({
							target: "#studentThreadBuilder",
							action: "reader",
							tid: tid,
							id: r.pid || r.id,
							uid: uid,
							with: data,
							addFeedbacks: false,
							topic: topic,
						});

						parentDashboard.tbLoaded = true;
					})
					.catch((error) => {
						console.log(error);
					});
			} catch (error) {
				console.log("Error while fetching Student Eagle Builder:", error);
			}
		}
		else if(ajaxify.data.isTeacher){
			try {
				api
					.get(`/sdlms/${tid}/threadbuilder?uid=${uid}`, {})
					.then((r) => {

						let data = {
							meta: r.meta,
							threads: r.threads,
							conclusion: r.conclusion || {},
						};
						console.log(r);
						new threadBuilder({
							target: "#studentThreadBuilder",
							action: "reader",
							tid: tid,
							id: r.pid || r.id,
							uid: uid,
							with: data,
							addFeedbacks: false,
							topic: topic,
						});

						parentDashboard.tbLoaded = true;
					})
					.catch((error) => {
						console.log(error);
					});
			} catch (error) {
				console.log("Error while fetching	teacher thread Builder:", error);
			}
		}
	};
	parentDashboard.initEagleBuilder = (tid, topic) => {
		var uid = ajaxify.data.user.at().uid;
		try {
			api.get(`/sdlms/${tid}/tracker`, {}).then((r) => {

				let data = {
					meta: r.meta,
					tracks: r.tracks,
					conclusion: r.conclusion || {},
				};

				new eagleBuilder({
					target: "#studentEagleBuilder",
					action: "reader",
					tid: tid,
					with: data,
					tracking: false,
					id: r.pid|| r.id,
					control: true,
					addFeedbacks: false,
					uid: uid,
					topic: topic,
				});


			});
		} catch (error) {
			console.log("Error while fetching Tracker:", error);
		}
	};
	parentDashboard.paginateFeedback = (
		url ,
		data = {}
	) => {
		console.log(data)
		$(".sdlms-container")
			.find(`.${data.parent}`)
			.empty()
			.removeClass("d-flex justify-content-center align-items-center");
		api.get(url, {}).then((res) => {
			console.log(res);
			if (!res.data) {
				return $(".sdlms-container")
					.find(`.${data.parent}`)
					.html("No Feedbacks")
					.addClass("d-flex justify-content-center align-items-center");
			}
			res.data.map((ev) => {
				$(".sdlms-container").find(`.${data.parent}`).append(`
				<li class="d-flex align-items-center">
                                <div class="col-10 d-flex pl-0">
                                    <div class="user-img d-flex align-items-center">
                                        <img src=${ev.feedback_to
						? ev.feedback_to.picture
						: "https://sdlms.deepthought.education/assets/uploads/files/files/files/default_profile.png"
					}
                                            alt = "" />
                                    </div >
					<div class="user-info d-flex flex-column w-100 pl-3">
						<div class="user-name sdlms-text-black-17px text-ellipse font-weight-700">
							${ev.feedback_to ? ev.feedback_to.fullname : "Learner"}
						</div>
						<div class="user-session-info para-ellipse">
							<p class="sdlms-text-tertiary-14px sdlms-font-open-sans text-justify">${ev.content.replaceAll(
						"-_-",
						" "
					)}</p>
						</div>
						<div class="user-for-topic d-flex pt-1 justify-content-between">
							<div class="user-for sdlms-text-tertiary-12px">For: <span
								class="sdlms-sub-text-primary-12px text-capitalize">${ev.feedback_for ? ev.feedback_for : "SDLMS Asset"
					}</span> </div>
							<div class="user-topic sdlms-text-tertiary-12px">Topic: <span
								class="sdlms-sub-text-primary-12px text-capitalize">${ev.topic ? ev.topic : "Topic"
					}</span></div>
						</div>
					</div>
                                </div >

					<div class="col-2 pr-0 d-flex  justify-content-end align-items-center text-right">
						${app.timeFormatter(
						ev.modified,
						`<div class="user-last-activity text-center">
								<div
									class="user-last-activity-time-number font-weight-700 sdlms-sub-text-primary-12px">
									#time#</div>

								<div
									class="user-last-activity-time-minutes text-capitalize font-weight-400 sdlms-sub-text-tertiary-10px">
									#Mins#</div>
								<div
									class="user-last-activity-time-ago text-capitalize font-weight-400 sdlms-sub-text-tertiary-10px">
									ago</div>
							</div>`
					)}
					</div>
                            </li >
					`);
			});
			$(".sdlms-container")
				.find(".feedbacks-page")
				.val(res.current_page + 1);
			$(".sdlms-container")
				.find(".feedback-page-count")
				.text(res.last_page + 1);
			$(".sdlms-container")
				.find(".fb-navigator.next")
				.data("url", res.next_page_url);
			$(".sdlms-container")
				.find(".fb-navigator.prev")
				.data("url", res.prev_page_url);
			parentDashboard.rfeedbacksLoaded = true;
		});
	};
	return parentDashboard;
});