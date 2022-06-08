"use strict";

/* globals define */

define("forum/mobile/events/saved", function () {
	var saved = {};

	saved.init = function () {

        console.log("saved events");

        const listingHeader = document.querySelector("#listing-header");

        $("body").on("click", "#listing-header", function () {
            $("#listing-options").toggleClass("d-none");
        });

        $("body").on("click", ".listing-opt", function () {
            $(".active.font-bold.primary-bg").removeClass("font-bold active primary-bg");
            $(this).addClass("font-bold active primary-bg");
            $("#selected-listing-opt").empty();
            $("#selected-listing-opt").append($(this).text());
            $("#listing-options").toggleClass("d-none");

            // filter events by date
            let dateNow = new Date();
            dateNow = Number(moment(dateNow).format("x"));
            
            if ($(".listing-opt.active").text().replace(/\s+/g, '') == "UpcomingEvents") {
                let listedEvents = $(".event-listing");
                for (let index = 0; index < listedEvents.length; index++) {
                    const listedEvent = listedEvents[index];
                    if(Number($(listedEvent).attr("timestamp")) < dateNow){
                        $(listedEvent).removeClass("d-flex")
                        $(listedEvent).addClass("d-none")
                    } else {
                        $(listedEvent).addClass("d-flex")
                        $(listedEvent).removeClass("d-none")
                    }
                }
            } else {
                let listedEvents = $(".event-listing");
                for (let index = 0; index < listedEvents.length; index++) {
                    const listedEvent = listedEvents[index];
                    if(Number($(listedEvent).attr("timestamp")) >= dateNow){
                        $(listedEvent).removeClass("d-flex")
                        $(listedEvent).addClass("d-none")
                    } else {
                        $(listedEvent).addClass("d-flex")
                        $(listedEvent).removeClass("d-none")
                    }
                }
            }
        });

        $("body").on("click", function (e) {
        if (!listingHeader.contains(e.target)) {
            $("#listing-options").addClass("d-none");
        }
        });

        const _templates = {
            listing: function(data) {
                return `<div class="d-flex justify-content-between align-items-center mt-3 mb-1 container event-listing" tid="${data.tid}" timestamp="${data.timestamp}" cid="${data.cid}" subcid="${data.sub_cid}">
                            <img src="${data.image}" alt="random-img"
                                class="img-cover listing-img rounded-lg">
                            <div class="event-details ml-2 mr-1">
                                <p class="font-14 font-medium mb-0">${data.name}</p>
                                <p class="font-12 brand-text mb-0">${moment(data.timestamp).format("MMMM DD, YYYY")}</p>
                                <p class="mb-0 mt-3 font-12 truncate-line-2">${data.description}</p>
                            </div>
                            <i class="fa-solid fa-chevron-right"></i>
                        </div>
                        <hr class="mt-2">`
            }
        }

        async function appendEvents(pageNumber = 0) {

			let getEvents = new Promise((resolve, reject) => {
				doAjax({
					type: 'GET',
					url: `/app/saved/event?page=${pageNumber}`,
					data: {},
				}).then(function (res) {
					let pageCount = res.response.last_page + 1;
					let pageData = res.response.data;
					let events = {
						pageCount,
						pageData
					}

					resolve(events);
					reject("no data");
				})
			})

			let events = await getEvents;

            console.log("pagedata", events.pageData);

			events.pageData.map((data) => $("#page-container").append(_templates.listing(data)));
			return events;
		}

		appendEvents().then(
			function(events) {
				console.log("Events", events);

				// lazy load events
				let check = {
					root: null,
					rootMargin: "0px",
					threshold: 0.1,
				};
				let eventPage = 1;

				let eventsObserver = new IntersectionObserver((entries) =>{
					if(entries[0].isIntersecting && eventPage < events.pageCount){
						appendEvents(eventPage);
						eventPage ++;
					}
				}, check);
				eventsObserver.observe(document.getElementById("page-checker"));
			}
		)
    };

	return saved;
});
