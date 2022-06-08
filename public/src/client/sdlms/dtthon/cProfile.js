"use strict";

/* globals define */

define("forum/sdlms/dtthon/cProfile", ["api"], function (api) {
	var cProfile = {};
	cProfile.init = function () {
		//CREATOR PROFILE PAGE
		var type;
		var response;
		var learning_outcomes = [];
		var pre_requisites = [];
		let object={}
		//in later stages it wiill be chnaged
		

		var listItem1 = `<div class="col-12 pl-0 pr-0 taskAdded">
      <div class=" add-more-values px-2 pr-4 py-1 mt-1 sdlms-text-tertiary-14px">`;
		var listItem2 = `</div>
      <svg class="sdlms-floating-right delete" width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.785714 12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111H0.785714V12.4444ZM2.35714 4.66667H8.64286V12.4444H2.35714V4.66667ZM8.25 0.777778L7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25Z" fill="#0029FF" />
      </svg>
    </div>`;

		$('.backBtn').on('click', function () {
			console.log('hello shagun')
			location.href = `/dashboard`;
		})

		//to add values in the learning outcomes
		$("#learnTask")
			.next()
			.on("click", function () {
				if ($("#learnTask").val() == "") {
					alert("You Can't add a Empty Task");
				} else {
					learning_outcomes.push($("#learnTask").val());
					$("#learnAddedTasks").append(
						listItem1 + $("#learnTask").val() + listItem2
					);
					$("#learnTask").val("");
					var newTaskAdded = $("#learnAddedTasks").find(".taskAdded").last();
					newTaskAdded.find(".delete").on("click", function () {
						$(this).parent().remove();
						learning_outcomes.pop($("#learnTask").val());

					});
				}
			});

		//to add values in pre requisites
		$("#preReqTask")
			.next()
			.on("click", function () {
				if ($("#preReqTask").val() == "") {
					alert("You Can't add a Empty Task");
				} else {
					pre_requisites.push($("#preReqTask").val());
					$("#preReqAddedTasks").append(
						listItem1 + $("#preReqTask").val() + listItem2
					);
					$("#preReqTask").val("");
					var newTaskAdded1 = $("#preReqAddedTasks").find(".taskAdded").last();
					newTaskAdded1.find(".delete").on("click", function () {
						$(this).parent().remove();
						pre_requisites.pop($("#preReqTask").val());
					});
				}
			});

		// to count character in description box
		$(".discript-textarea").on("keyup", function () {
			var characterCount = $(this).val().length,
				current = $("#current"),
				maximum = $("#maximum"),
				theCount = $("#the-count");

			current.text(characterCount);
		});

		//to show custom commitment box
		$("body").on("click", ".custom-dropdown", function () {
			$("#id_commitment").hide();
			$(".custom-commit").show();
		});

		//to show dropdown box
		$("body").on("click", ".custom-arrow", function () {
			$("#id_commitment").show();
			$(".custom-commit").hide();
		});

		//to set category
		$("body").on("click", ".p", function () {
			type = "project";
		});
		$("body").on("click", ".c", function () {
			type = "course";
		});
		$("body").on("click", ".s", function () {
			type = "selection";
		});


		$("body").on("click", "#createProject", function (event) {
			event.preventDefault();

			//not to add empty values
			if (($("#pTitle").val() == "") && ($("#pDescription").val() == "")) {
				alert("Make sure you have a title and description");

			} else {

				var data = {
					title: $("#pTitle").val(),
					uploaded_images: JSON.stringify({
						name: "",
						url: $("#imageURL").val(),
						description: "",
					}),
					description: $("#pDescription").val(),
					pre_requisites: JSON.stringify(pre_requisites),
					learning_outcomes: JSON.stringify(learning_outcomes),
					type: type,
				};

				console.log(data)

				api.post(`/apps/project`, data).then(function (res) {
					response = res
					console.log(response);
					$('#createProject').attr('disabled', true);

				}).catch((error) => {
					notify(error.message, 'error');
				});

				alert("Your Project is created");
				console.log('hello')

				$('#Preview-btn').attr('disabled', false);

			}

		});



		$('#Next-btn').on('click', function () {
			console.log(response)
			location.href = `/cStoryboard/${response.tid}`;
		})


		$('#Preview-btn').on('click', function () {
		object.type="project"
		object.name =$("#pTitle").val(),
		object.description=$("#pDescription").val()
		object.uploaded_images={
				name: "",
				url: $("#imageURL").val(),
				description: "",
			}
		
		object.learning_outcomes = learning_outcomes
		object.pre_requisites = pre_requisites
		console.log(object)

			$('#create-profile-Preview').append(template.aProfile(object))
			$('.cProfile-modal').removeClass('change-class')
		})

		$('body').on('click', '#preview-backbtn',function () {
			$('.cProfile-modal').remove()
			$('.cProfile-modal').addClass('change-class')
		})

		const template = {
			aProfile: (data) => {
				console.log(data)
				let learning_outcomes_html=''
				let pre_requisites_html=''
				for (let i = 0; i < data.learning_outcomes.length; i++) {
					learning_outcomes_html+=(`<li>${data.learning_outcomes[i]}</li>`);
					console.log(data.learning_outcomes[i])
				  }
				  
				  for (let i = 0; i <data.pre_requisites.length; i++) {
					pre_requisites_html+=(`<li>${data.pre_requisites[i]}</li>`);
				  }

				let html = `
				<div class="cProfile-modal change-class">
				<div class="cProfile-modal-content">
				<div class="sdlms-section session-view sdlms-form-elements">
      <div class="sdlms-section-header shadow-none custom-padding-x-40 primary-header align-items-center justify-content-between ">
        <div id="preview-backbtn" class=" align-items-center sdlms-text-white-20px" style="text-align:center;"><span class="sdlms-floating-left"><svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5261 18L13 15.8849L4.96494 9L13 2.11505L10.5261 0L0 9L10.5261 18Z" fill="white" />
              <line x1="5" y1="9" x2="26" y2="9" stroke="white" stroke-width="4" />
            </svg></span>
        <div id="pageTitle">${data.type}</div>
      </div>
      </div>
      <div class="sdlms-section-body">
        <div id="details"><div class="d-flex">
		<div class="col-md-8 pl-3">
		  <div class="col-md-10 p-0 pb-4 project-heading font-weight-medium">
			${data.name}
		  </div>
		  <div>
			<div class="pb-2 bold-font">
			  Opportunity description
			</div>
			<div class="pb-3"> ${data.description} </div>
		  </div>
		  <div class="bold-font">
			Learning outcomes
		  </div>
		  <div>
			<ul learning_outcomes>
				  ${learning_outcomes_html}
			</ul>
		  </div>
		  <div class="bold-font">
			Pre-requisties
		  </div>
		  <div>
			<ul pre_requisites>
			${pre_requisites_html}
			</ul>
		  </div>
		  <div>
			<!-- <div class="pt-3">
			  <b>Deadline:</b>${"deadline"}
			</div> -->
		  </div>
		</div>
		<div class="col-4 pb-3">
		  <div class="pb-3">
			<img src="${data.uploaded_images.url}" class="img-fluid profile-image" alt="Responsive image">
		  </div>
		  <div class="organization-profile">
			<div class="row">
			  <div class="col-md-3 pr-0">
				<div class="pt-3 pl-3">
				  <img class="organization-profile-image" src="${'compnay details'}" alt="">
				</div>
			  </div>
			  <div class="col-md-9 pl-0 p-3">
				<div class="bold-font pb-1">
				  By <a href="#">${'company url'}</a>
				</div>
				<div class="pr-3 pb-1 organization-font">
				hello
				  <a href="#">Know more</a>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  </div> </div>
       
        <div class="col-12 pr-3 d-flex align-items-center justify-content-end">
          <button type="submit" class="button sdlms-button button-lg d-flex align-items-center apply-button" disabled>Let's Start</button>
        </div>
      </div>
    </div>
  </div>
			  </div>
				</div>
			 `

				return html;
			}
		}


	};
	return cProfile;
});