"use strict";

/* globals define */

define("forum/mobile/support/my_tickets", ["api"], function (api) {
	var myTickets = {};

	myTickets.init = function () {
		// ticket template
		const _template = {
			ticket: function (data) {
				return `<div class="support-card primary-border px-2 py-2 rounded-10-px mb-2" id="${data.id}">
      <div class="d-flex justify-content-between align-items-center font-12" data-toggle="collapse"
        data-target="#cardBody${data.id}" aria-expanded="false" aria-controls="cardBody${data.id}">
        <p class="mb-0 font-medium">${data.subject}</p>
        <i class="fas fa-solid fa-chevron-down chevron-180"></i>
      </div>

      <div class="collapse font-10 mt-1" id="cardBody${data.id}">
        <div class="d-flex justify-content-between">
          <p class="brand-text mb-0">${data.category}</p>
          <p class="mb-0">${data.createdTime}</p>
        </div>
        <div class="details">
          <p class="mb-2">
            ${data.description}
          </p>
        </div>

        <div class="assignment d-flex justify-content-between font-12">
          <div class="assigned-details d-flex align-items-center">
            <img
              src=${data.assignee.photoURL}
              alt="pfp" class="rounded-circle mr-1 circle-sm" />
            <p class="mb-0">
              Assigned to <span class="font-medium">${data.assignee.firstName}</span>
            </p>
          </div>
          <div class="status-details d-flex align-items-center">
            <p class="mb-0 status">${data.status}</p>
            <div
              class="delete-btn circle-sm rounded-circle tertiary-border ml-1 d-flex align-items-center justify-content-center" ticketid="${data.id}">
              <i class="fa-solid fa-trash"></i>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-center">
          <p class="mb-0 mt-1">She will repond you in short time *</p>
        </div>
      </div>
    </div>`;
			},
		};

		// getting and displaying tickets
		api
			.get("/app/searchTickets", { email: `${app.user.email}` })
			.then((res) => {
				console.log(res);
				$.each(res.data, function (i, data) {
					data.createdTime = moment(data.createdTime).format("DD MMMM YY");
					if (data.assignee)
						$(
							".secondary-bg.rounded-10-px.mt-3.px-20-px.pb-1.component-full"
						).append(_template.ticket(data));
				});
			});

		// delete ticket btn working
		// $("body").on("click", ".delete-btn", function () {
		// 	api.post("/app/deleteTickets", $(this).attr("ticketid")).then(() => {
		// 		location.reload();
		// 	});
		// });

    $("body").on("click", ".delete-btn", function () {
      api.post("app/deleteTickets", $(this).attr("ticketid"), () => location.reload(), true)
    })
	};

	return myTickets;
});
