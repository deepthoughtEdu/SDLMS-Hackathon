"use strict";

/* globals define */

define("forum/sdlms/dtthon/applicant/dashboard", ["api"], function (api) {
	var dashboard = {};
	dashboard.init = () => {
		//changing for header
		$("[tabheader]")
			.off("click")
			.on("click", ".sdlms-sessions", function () {
				console.log("hello");
				$(".sdlms-sessions").removeClass("active");
				$(this).addClass("active");
				location.href = location.origin + `/${$(this).data("state")}`;
			});
		dashboard.paginateMicroDashboard(`/apps/project?isRecruiter=true`, {
			parent: "sdlms-my-microdashboard-table-body",
		});

		$("body").on("click", "[change-to-macrodashboard]", function () {
			let tpid = $(this).data("tid");
			console.log(tpid);
			ajaxify.go(`/applicant/storyboard/${tpid}`);

			let status = $(this).data("status");
			if (status == "draft") {
				$(".Dashboard1-state-main").removeClass("change-class");
				$(".Dashboard1-state-detailed").addClass("change-class");
			} else {
				$(".Dashboard1-state-main").addClass("change-class");
				$(".Dashboard1-state-detailed").removeClass("change-class");
				dashboard.paginateMacroDashboard(
					`/apps/submit?isRecruiter=true&tid=${tpid}`,
					{
						parent: "sdlms-my-macrodashboard-table-body",
					}
				);

				$("[editproject]")
					.off("click")
					.on("click", function () {
						location.href = location.origin + "/RoutName/";
					});
				$("[deleteproject]")
					.off("click")
					.on("click", function () {
						api.delete(`apps/project`, { tid: tpid }).then((res) => {
							console.log("deleted" + " " + res);
						});
					});
			}
		});
		$("body").on("click", ".back-to-main", function () {
			$(".Dashboard1-state-main").removeClass("change-class");
			$(".Dashboard1-state-detailed").addClass("change-class");
		});

		/*
		$('body').find('.dropdown').addClass('change-class')
		$("[change-to-macrodashboard]").addClass("change-class");
	*/
	};
	//paginator for dashboard
	$(".Dashboard1-state-main")
		.find(".page-navigator")
		.off("click")
		.on("click", function () {
			let url = $(this).data("url");
			if (url) {
				dashboard.paginateMicroDashboard(url, {
					parent: "sdlms-my-microdashboard-table-body",
				});
				return;
			}
			// data-sdlms-type ==> .data("sdlmsType")
		});
	$(".Dashboard1-state-detailed")
		.find(".page-navigator")
		.off("click")
		.on("click", function () {
			let url = $(this).data("url");
			console.log(url);
			if (url) {
				dashboard.paginateMacroDashboard(url, {
					parent: "sdlms-my-macrodashboard-table-body",
				});
				return;
			}
			// data-sdlms-type ==> .data("sdlmsType")
		});

	dashboard.paginateMicroDashboard = (url, data = {}) => {
		console.log(url);
		$(".Dashboard1-state-main").find(`.${data.parent}`).empty();
			try {
				api.get(`/apps/project`, {}).then((res) => {
					console.log(res);
					res.data.map((ev, index) => {
						$(".Dashboard1-state-main").find(`.${data.parent}`).append(`
								<tr data-id="${ev.tid}" class="sdlms-my-upcoming-session-table-row ">
										  <td class="sdlms-my-upcoming-session-table-Sno font-weight-500 sdlms-text-black-18px dashboard-sessionIndex">
										  ${(index + 1 + res.from).toLocaleString("en-US", {
												minimumIntegerDigits: 2,
												useGrouping: false,
											})}</td>
										  <td class="sdlms-my-upcoming-session-table-Session-topic font-weight-500 sdlms-text-black-18px">
										  ${ev.title ? ev.title : "project"}</td>
										  <td class="sdlms-my-upcoming-session-table-date font-weight-500 sdlms-text-black-18px">
												 ${moment(ev.start_time).format("ddd, DD MMM, YYYY")} <br />
											 <span class="sdlms-my-upcoming-session-table-time font-weight-500 sdlms-text-black-18px"></span>
													${moment(ev.start_time).format("hh:mm A")}
										</td>
										  <td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px" >
										  --
										  </td>
										  <td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px">
										 	 ongoing
										  </td>
											<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px">
											-- </td>
											<td class="sdlms-my-upcoming-session-table-related-sessions font-weight-500 sdlms-text-black-18px"change-to-macrodashboard data-tid=${
												ev.tid
											} data-status=${ev.status}> 
													 <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
													   <path d="M16.6324 16H2.07904V2H9.3557V0H2.07904C0.925175 0 0 0.9 0 2V16C0 17.1 0.925175 18 2.07904 18H16.6324C17.7758 18 18.7114 17.1 18.7114 16V9H16.6324V16ZM11.4347 0V2H15.1666L4.94814 11.83L6.41387 13.24L16.6324 3.41003V7H18.7114V0H11.4347Z" fill="#323232"/>
													</svg>
											</td>  
										</tr>`);
					});

					$(".Dashboard1-state-main")
						.find(".sessions-page")
						.val(res.current_page + 1);
					$(".Dashboard1-state-main")
						.find(".sessions-page-count")
						.text(res.last_page + 1);
					$(".Dashboard1-state-main")
						.find(".page-navigator.next")
						.data("url", res.next_page_url);
					$(".Dashboard1-state-main")
						.find(".page-navigator.prev")
						.data("url", res.prev_page_url);
				});
			} catch (error) {
				console.log("Error while fetching Student thread Builder:", error);
			}
		
	};

	return dashboard;
});
