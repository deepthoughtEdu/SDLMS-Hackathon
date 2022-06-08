"use strict";

/* globals define */

define("forum/sdlms/dtthon/creator/profile", ["api"], function(api) {
  var creatorProfile = {};
  creatorProfile.init = function() {

    //CREATOR PROFILE PAGE

    var type;
    var response;
    var learning_outcomes = [];
    var pre_requisites = [];
    let object = {};
    var companyprofile=`<svg width="50" height="49" viewBox="0 0 50 49" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.5526 49C38.1127 49 49.1053 38.031 49.1053 24.5C49.1053 10.969 38.1127 0 24.5526 0C10.9926 0 0 10.969 0 24.5C0 38.031 10.9926 49 24.5526 49Z" fill="#0029FF"/>
    <path d="M13.9133 26.1334C15.2693 26.1334 16.3685 25.0365 16.3685 23.6834C16.3685 22.3303 15.2693 21.2334 13.9133 21.2334C12.5573 21.2334 11.458 22.3303 11.458 23.6834C11.458 25.0365 12.5573 26.1334 13.9133 26.1334Z" fill="white"/>
    <path opacity="0.1" d="M15.55 19.6002C16.906 19.6002 18.0053 18.5033 18.0053 17.1502C18.0053 15.7971 16.906 14.7002 15.55 14.7002C14.194 14.7002 13.0947 15.7971 13.0947 17.1502C13.0947 18.5033 14.194 19.6002 15.55 19.6002Z" fill="white"/>
    <path opacity="0.1" d="M15.55 32.6666C16.906 32.6666 18.0053 31.5697 18.0053 30.2166C18.0053 28.8635 16.906 27.7666 15.55 27.7666C14.194 27.7666 13.0947 28.8635 13.0947 30.2166C13.0947 31.5697 14.194 32.6666 15.55 32.6666Z" fill="white"/>
    <path opacity="0.1" d="M35.1926 32.6666C36.5486 32.6666 37.6478 31.5697 37.6478 30.2166C37.6478 28.8635 36.5486 27.7666 35.1926 27.7666C33.8366 27.7666 32.7373 28.8635 32.7373 30.2166C32.7373 31.5697 33.8366 32.6666 35.1926 32.6666Z" fill="white"/>
    <path opacity="0.1" d="M35.1926 19.6002C36.5486 19.6002 37.6478 18.5033 37.6478 17.1502C37.6478 15.7971 36.5486 14.7002 35.1926 14.7002C33.8366 14.7002 32.7373 15.7971 32.7373 17.1502C32.7373 18.5033 33.8366 19.6002 35.1926 19.6002Z" fill="white"/>
    <path d="M20.4601 37.5665C21.8162 37.5665 22.9154 36.4696 22.9154 35.1165C22.9154 33.7634 21.8162 32.6665 20.4601 32.6665C19.1041 32.6665 18.0049 33.7634 18.0049 35.1165C18.0049 36.4696 19.1041 37.5665 20.4601 37.5665Z" fill="white"/>
    <path d="M30.2814 37.5665C31.6374 37.5665 32.7367 36.4696 32.7367 35.1165C32.7367 33.7634 31.6374 32.6665 30.2814 32.6665C28.9254 32.6665 27.8262 33.7634 27.8262 35.1165C27.8262 36.4696 28.9254 37.5665 30.2814 37.5665Z" fill="white"/>
    <path d="M36.8293 26.1334C38.1853 26.1334 39.2845 25.0365 39.2845 23.6834C39.2845 22.3303 38.1853 21.2334 36.8293 21.2334C35.4733 21.2334 34.374 22.3303 34.374 23.6834C34.374 25.0365 35.4733 26.1334 36.8293 26.1334Z" fill="white"/>
    <path d="M25.3713 26.1334C26.7273 26.1334 27.8265 25.0365 27.8265 23.6834C27.8265 22.3303 26.7273 21.2334 25.3713 21.2334C24.0153 21.2334 22.916 22.3303 22.916 23.6834C22.916 25.0365 24.0153 26.1334 25.3713 26.1334Z" fill="white"/>
    <path d="M30.2814 14.6998C31.6374 14.6998 32.7367 13.6029 32.7367 12.2498C32.7367 10.8967 31.6374 9.7998 30.2814 9.7998C28.9254 9.7998 27.8262 10.8967 27.8262 12.2498C27.8262 13.6029 28.9254 14.6998 30.2814 14.6998Z" fill="white"/>
    <path d="M20.4601 14.6998C21.8162 14.6998 22.9154 13.6029 22.9154 12.2498C22.9154 10.8967 21.8162 9.7998 20.4601 9.7998C19.1041 9.7998 18.0049 10.8967 18.0049 12.2498C18.0049 13.6029 19.1041 14.6998 20.4601 14.6998Z" fill="white"/>
    <path d="M13.9131 23.6831H25.371L30.2815 35.1164H20.4605" stroke="white"/>
    <path d="M20.4609 12.25H30.282" stroke="white"/>
    </svg>`;
    var companyurl='https://deepthought.education/';
    var company_details=`Nurturing Thought Leaders out of children We create leaders for the society and the economy, we bring Ph.D. level rigor and corporate rigor to the school level! Our processes and research do to education what Tesla did to automobiles: we reposition education, we are India's answer to Tesla!`;

    $(".backBtn").on("click", function() {
      ajaxify.go(`/creator/dashboard`);
    });


	//html for list_items boxes
    var listItem1 = `<div class="col-12 pl-0 pr-0 taskAdded">
		                <div class=" add-more-values px-2 pr-4 py-1 mt-1 sdlms-text-tertiary-14px">`;
    var listItem2 = `</div>
                        <svg class="sdlms-floating-right delete" width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.785714 12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111H0.785714V12.4444ZM2.35714 4.66667H8.64286V12.4444H2.35714V4.66667ZM8.25 0.777778L7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25Z" fill="#0029FF" />
                        </svg>
                    </div>`;

    //to add values in the learning outcomes
    $("#learnTask")
      .next()
      .on("click", function() {
        if ($("#learnTask").val() == "") {
          alert("You Can't add a Empty Task");
        } else {
          learning_outcomes.push($("#learnTask").val());
          $("#learnAddedTasks").append(
            listItem1 + $("#learnTask").val() + listItem2
          );
          $("#learnTask").val("");
          var newTaskAdded = $("#learnAddedTasks").find(".taskAdded").last();
          newTaskAdded.find(".delete").on("click", function() {
            $(this).parent().remove();
            learning_outcomes.pop($("#learnTask").val());
          });
        }
      });

    //to add values in pre requisites
    $("#preReqTask")
      .next()
      .on("click", function() {
        if ($("#preReqTask").val() == "") {
          alert("You Can't add a Empty Task");
        } else {
          pre_requisites.push($("#preReqTask").val());
          $("#preReqAddedTasks").append(
            listItem1 + $("#preReqTask").val() + listItem2
          );
          $("#preReqTask").val("");
          var newTaskAdded1 = $("#preReqAddedTasks").find(".taskAdded").last();
          newTaskAdded1.find(".delete").on("click", function() {
            $(this).parent().remove();
            pre_requisites.pop($("#preReqTask").val());
          });
        }
      });

    // to count character in description box
    $(".discript-textarea").on("keyup", function() {
      var characterCount = $(this).val().length,
        current = $("#current"),
        maximum = $("#maximum"),
        theCount = $("#the-count");

      current.text(characterCount);
    });

    //to show custom commitment box
    $("body").on("change", "#custom-commit-dropdown", function() {
      if ($(this).val() == "3"){
        console.log('hello')
        $("#id_commitment").hide();
        $(".custom-commit").show(); 
        }
    });

    //to show dropdown box
    $("body").on("click", ".custom-arrow", function() {
      $("#id_commitment").show();
      $(".custom-commit").hide();
    });

    //to set category
    $("body").on("click", ".p", function() {
      type = "project";
    });
    $("body").on("click", ".c", function() {
      type = "course";
    });
    $("body").on("click", ".s", function() {
      type = "selection";
    });

	//to post data value to post create project API
    $("body").on("click", "#createProject", function(event) {
      event.preventDefault();

      //not to add empty values
      if ($("#pTitle").val() == "" && $("#pDescription").val() == "") {
        alert("Make sure you have a title and description");
      } else {
        var data = {
          title: $("#pTitle").val(),
          project_image:$("#imageURL").val(),
          description: $("#pDescription").val(),
          pre_requisites: pre_requisites,
          learning_outcomes: learning_outcomes,
          type: type,
        };

        api.post(`/apps/project`, data).then(function(res) {
            response = res;
            console.log(response);
            $("#createProject").attr("disabled", true);
          })
          .catch((error) => {
            notify(error.message, "error");
          });

        alert("Your Project is created");

        $("#Preview-btn").attr("disabled", false);
      }
    });

	//when click on next button redirect to storyboard
    $("#Next-btn").on("click", function() {
      ajaxify.go(`/creator/storyboard/${response.tid}`);
    });

	//to preview modal of the project profile
    $("#Preview-btn").on("click", function() {
      object.type = "project";
      object.name = $("#pTitle").val(),
      object.description = $("#pDescription").val();
      object.project_image = $("#imageURL").val();
      object.learning_outcomes = learning_outcomes;
      object.pre_requisites = pre_requisites;
      $("#create-profile-Preview").append(template.aProfile(object));
      $(".cProfile-modal").removeClass("change-class");
    });

    $("body").on("click", "#preview-backbtn", function() {
      $(".cProfile-modal").remove();
      $(".cProfile-modal").addClass("change-class");
    });

	//template for the project profile
    const template = {
      aProfile: (data) => {
        console.log(data);
        let learning_outcomes_html = "";
        let pre_requisites_html = "";
        for (let i = 0; i < data.learning_outcomes.length; i++) {
          learning_outcomes_html += `<li>${data.learning_outcomes[i]}</li>`;
        }

        for (let i = 0; i < data.pre_requisites.length; i++) {
          pre_requisites_html += `<li>${data.pre_requisites[i]}</li>`;
        }

        let html = `<div class="cProfile-modal change-class d-flex justify-content-center align-items-center">
		<div class="cProfile-modal-content">
		  <div class="sdlms-section session-view sdlms-form-elements">
			<div class="sdlms-section-header shadow-none custom-padding-x-40 primary-header align-items-center justify-content-between ">
			  <div id="preview-backbtn" class=" align-items-center sdlms-text-white-20px" style="text-align:center;">
				<span class="sdlms-floating-left">
				  <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10.5261 18L13 15.8849L4.96494 9L13 2.11505L10.5261 0L0 9L10.5261 18Z" fill="white" />
					<line x1="5" y1="9" x2="26" y2="9" stroke="white" stroke-width="4" />
				  </svg>
				</span>
				<div id="pageTitle">${data.type}</div>
			  </div>
			</div>
			<div class="sdlms-section-body">
			  <div id="details">
				<div class="d-flex">
				  <div class="col-md-6 pl-3">
					<div class="col-md-10 p-0 pb-4 project-heading font-weight-medium">${data.name}</div>
					<div>
					  <div class="pb-2 bold-font">Opportunity description</div>
					  <div class="pb-3"> ${data.description} </div>
					</div>
					<div class="bold-font">Learning outcomes</div>
					<div>
					  <ul id="learning_outcomes" style="font-weight: lighter; list-style: disc;">${learning_outcomes_html}</ul>
					</div>
					<div class="bold-font">Pre-requisties</div>
					<div>
					  <ul id="pre_requisites" style="font-weight: lighter; list-style: disc;">${pre_requisites_html}</ul>
					</div>
					<div>
					<div class="pt-3"><b>Deadline:</b>${"deadline"}</div>
					</div>
				  </div>
				  <div class="col-6 pb-3">
					<div class="pb-3">
					  <img src="${data.project_image}" width="300px" height="200px" class="img-fluid profile-image" alt="Responsive image">
					</div>
					<div class="organization-profile card m-2 border-0 shadow rounded-10">
        <div class="row">
          <div class="col-md-3 pr-0">
            <div class="pt-3 d-flex align-items-center justify-content-center">
              <!-- <img class="organization-profile-image" src="${companyprofile}" alt=""> -->

              ${companyprofile}
            </div>
          </div>
          <div class="col-md-9 pl-0 p-3">
            <div class="bold-font pb-1">
              By <a href="${companyurl}">DeepThought</a>
            </div>
            <div class="pr-3 pb-1 organization-font">
            ${company_details}
              <a href="#">Know more</a>
            </div>
						</div>
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			  <div class="col-12 pr-3 d-flex align-items-center justify-content-end">
				<button type="submit" class="button sdlms-button button-lg d-flex align-items-center apply-button" disabled>Let's Start</button>
			  </div>
			</div>
		  </div>
		</div>
	  </div>`;

      return html;
    },
    };
	
  };

  return creatorProfile;
});