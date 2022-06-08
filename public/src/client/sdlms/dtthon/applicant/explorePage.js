"use strict";

/* globals define */

define("forum/sdlms/dtthon/applicant/explorePage", ["api"], function (api) {
	var explorePage = {};

	explorePage.init = function () {
		console.log("function inited");
		$("[tabheader]")
			.off("click")
			.on("click", ".sdlms-sessions", function () {
				console.log("hello");
				$(".sdlms-sessions").removeClass("active");
				$(this).addClass("active");
				location.href = location.origin + `/${$(this).data("state")}`;
			});

		let DtthonArray = [];
		$(".Dtthon-filter").on("click", ".dtthon-filter-icon", function () {
			$(".Dtthon-filter-body").slideToggle("slow");
			DtthonArray = [];
			$("input[type='checkbox']").prop("checked", false);
			$(".dtthon-filters-array").find("button").remove();
		});

		$($(".type .type-body"))
			.off("click")
			.on("click", "input[type='checkbox']", function () {
				let value = $(this).val();

				if ($(this).is(":checked")) {
					DtthonArray.push(value);
				} else {
					DtthonArray.pop(value);
				}
				console.log(DtthonArray);
			});
		$("[ApplyFilter]").on("click", function () {
			let html;
			DtthonArray.map(function (val, i) {
				html = `
              <button type="button" class="sdlms-button button-primary button-md d-flex align-items-center mx-2">
              <span class="sdlms-text-white-20px">${val}</span>
              <span class="ml-2" delete-filter>
                <svg width="10" height="3" viewBox="0 0 10 3" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path d="M9.28572 0H0.714286C0.319866 0 0 0.447812 0 1V2C0 2.55219 0.319866 3 0.714286 3H9.28572C9.68013 3 10 2.55219 10 2V1C10 0.447812 9.68013 0 9.28572 0Z" fill="white"/>
                  </svg>                        
              </span>
            </button>
              `;
				$(".dtthon-filters-array").append(html);
			});
            DtthonArray
			$(".Dtthon-filter-body").slideToggle("slow");
            explorePage.paginateExplorePage(`/apps/project?title=${name}`, {
                parent: "dtthon-explore-page",
            });

		});
		$(".dtthon-filters-array")
			.off("click")
			.on("click", "[delete-filter]", function () {
				console.log($(this).prev().text());
				if (DtthonArray.length) {
					DtthonArray.pop($(this).prev().text());
					$(this).parent().remove();
				}
			});

		$("[resetFilter]").on("click", function () {
			DtthonArray = [];
			$("input[type='checkbox']").prop("checked", false);
		});
		explorePage.paginateExplorePage(`/apps/project`, {
			parent: "dtthon-explore-page",
		});

        $('.sdlms-assest-search-bar').off('keyup').on('keyup',function(e){
            
            let name =$("input[type='search']").val();
            explorePage.paginateExplorePage(`/apps/project?title=${name}`, {
              parent: "dtthon-explore-page",
          });
        
      })

	};

	$(".sdlms-container")
		.find(".page-navigator")
		.off("click")
		.on("click", function () {
			let url = $(this).data("url");
			if (url) {
				explorePage.paginateExplorePage(url, {
					parent: "dtthon-explore-page",
				});
				return;
			}
			// data-sdlms-type ==> .data("sdlmsType")
		});

		$("body").on("click", "[change-to-aProfile]", function () {
			let tpid = $(this).data("tid");
			console.log(tpid);
			location.href = `/applicant/profile/${tpid}`
		})



	explorePage.paginateExplorePage = (
		url,
		data = {}
	) => {
		$(".sdlms-container").find(`.${data.parent}`).empty();

		api.get(url, {}).then((res) => {
			console.log(res);


			res.data.map((ev, index) => {
                let learning_outcomes =ev.learning_outcomes?ev.learning_outcomes.join(','):""; 
                let Pre_requisites =ev.pre_requisites?ev.pre_requisites.join(','):""; 


				$(".sdlms-container")
					.find(`.${data.parent}`)
					.append(
					`<div class="my-2">
                        <div class="box-shadow(if needed)">
                            <div class="sdlms-section-body" style="border-radius: var(--primary-border-radius)">
                                <div class="row">
                                    <div class="col-md-8" style="border-right: 0.1px solid #33333317;">
                                        <div class="row">
                                            <div class="col-12 mx-auto font-open-sans">
                                                <div class=" d-flex">
                                                <div class="Dtthon-explore-profile"><img class="w-100 h-100" src="{user.picture}"
                                                    alt="" /></div>
                                                <div class="w-mw-55px pl-3">
                                                    <div class="sdlms-text-black-22px font-weight-medium">
                                                        ${ev.title}
                                                    </div>
                                                     <p class="sdlms-text-tertiary-14px font-weight-400 sdlms-font-open-sans">
                                                        ${ev.description}
                                                    </p>

                                                    <div class="d-flex align-items-center pl-0">
                                                        <div class="sdlms-text-black-20px font-weight-medium pr-2">
                                                             ${ev.type} by
                                                        </div>
                                                        <div class="user-img position-relative">
                                                            <img src="${ev.recruiter.picture}" alt="" />
                                                        </div>
                                                    <div class="user-info pl-2">
                                                        <div class="user-name sdlms-text-tertiary-16px font-weight-medium text-left">
                                                                ${ev.recruiter.fullname}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mt-3">
                                <div class=" d-flex">
                                    <div class="d-block pl-3 w-100">
                                        <div class="box d-flex align-items-center ">
                                            <div class="sdlms-text-black-18px font-weight-medium col-5">
                                                Level
                                            </div>
                                            <p class="sdlms-text-tertiary-14px font-weight-400 sdlms-font-open-sans m-0 pl-3">
                                                Easy
                                            </p>
                                        </div>
                                        <div class="box d-flex align-items-center ">
                                            <div class="sdlms-text-black-18px font-weight-medium col-5">
                                                Learning OutComes
                                            </div>
                                            <p class="sdlms-text-tertiary-14px font-weight-400 sdlms-font-open-sans m-0 pl-3">
                                                ${learning_outcomes}
                                            </p>
                                        </div>
                                        <div class="box d-flex align-items-center ">
                                            <div class="sdlms-text-black-18px font-weight-medium col-5">
                                                Pre-requisites
                                            </div>
                                            <p class="sdlms-text-tertiary-14px font-weight-400 sdlms-font-open-sans m-0 pl-3">
                                                ${Pre_requisites}
                                            </p>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-end mt-3" change-to-aProfile data-tid=${ev.tid}>
                                            <button  type="button" class="sdlms-button button-primary button-lg">Explore</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
					);
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
	return explorePage;
});




