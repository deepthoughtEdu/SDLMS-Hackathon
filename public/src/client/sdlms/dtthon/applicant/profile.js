"use strict";

/* globals define */

define("forum/sdlms/dtthon/applicant/profile", ["api"], function (api) {
	var profile = {};
	profile.init = function () {

    $("[aProfile-back-btn]").on("click", function () {
      ajaxify.go(`/applicant/dashboard`);
    })
var title = ajaxify.data.project.title;
var learning_outcomes=[] ;
var pre_requisites=[] ;
var deadline='3 may 2022';
var img_url=ajaxify.data.project.project_image;
var profile_pic=`<svg width="80" height="80" viewBox="0 0 18 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.60526 27C13.3578 27 17.2105 20.9558 17.2105 13.5C17.2105 6.04416 13.3578 0 8.60526 0C3.85271 0 0 6.04416 0 13.5C0 20.9558 3.85271 27 8.60526 27Z" fill="#0029FF"/>
<path d="M4.87632 14.4C5.35157 14.4 5.73684 13.7956 5.73684 13.05C5.73684 12.3044 5.35157 11.7 4.87632 11.7C4.40106 11.7 4.01579 12.3044 4.01579 13.05C4.01579 13.7956 4.40106 14.4 4.87632 14.4Z" fill="white"/>
<path opacity="0.1" d="M5.45 10.8001C5.92526 10.8001 6.31053 10.1957 6.31053 9.4501C6.31053 8.70451 5.92526 8.1001 5.45 8.1001C4.97475 8.1001 4.58948 8.70451 4.58948 9.4501C4.58948 10.1957 4.97475 10.8001 5.45 10.8001Z" fill="white"/>
<path opacity="0.1" d="M5.45 18C5.92526 18 6.31053 17.3956 6.31053 16.65C6.31053 15.9044 5.92526 15.3 5.45 15.3C4.97475 15.3 4.58948 15.9044 4.58948 16.65C4.58948 17.3956 4.97475 18 5.45 18Z" fill="white"/>
<path opacity="0.1" d="M12.3342 18C12.8095 18 13.1947 17.3956 13.1947 16.65C13.1947 15.9044 12.8095 15.3 12.3342 15.3C11.8589 15.3 11.4737 15.9044 11.4737 16.65C11.4737 17.3956 11.8589 18 12.3342 18Z" fill="white"/>
<path opacity="0.1" d="M12.3342 10.8001C12.8095 10.8001 13.1947 10.1957 13.1947 9.4501C13.1947 8.70451 12.8095 8.1001 12.3342 8.1001C11.8589 8.1001 11.4737 8.70451 11.4737 9.4501C11.4737 10.1957 11.8589 10.8001 12.3342 10.8001Z" fill="white"/>
<path d="M7.17104 20.6999C7.6463 20.6999 8.03157 20.0955 8.03157 19.3499C8.03157 18.6044 7.6463 17.9999 7.17104 17.9999C6.69579 17.9999 6.31052 18.6044 6.31052 19.3499C6.31052 20.0955 6.69579 20.6999 7.17104 20.6999Z" fill="white"/>
<path d="M10.6132 20.6999C11.0884 20.6999 11.4737 20.0955 11.4737 19.3499C11.4737 18.6044 11.0884 17.9999 10.6132 17.9999C10.1379 17.9999 9.75262 18.6044 9.75262 19.3499C9.75262 20.0955 10.1379 20.6999 10.6132 20.6999Z" fill="white"/>
<path d="M12.9079 14.4C13.3832 14.4 13.7684 13.7956 13.7684 13.05C13.7684 12.3044 13.3832 11.7 12.9079 11.7C12.4326 11.7 12.0474 12.3044 12.0474 13.05C12.0474 13.7956 12.4326 14.4 12.9079 14.4Z" fill="white"/>
<path d="M8.8921 14.4C9.36735 14.4 9.75262 13.7956 9.75262 13.05C9.75262 12.3044 9.36735 11.7 8.8921 11.7C8.41684 11.7 8.03157 12.3044 8.03157 13.05C8.03157 13.7956 8.41684 14.4 8.8921 14.4Z" fill="white"/>
<path d="M10.6132 8.0999C11.0884 8.0999 11.4737 7.49549 11.4737 6.7499C11.4737 6.00432 11.0884 5.3999 10.6132 5.3999C10.1379 5.3999 9.75262 6.00432 9.75262 6.7499C9.75262 7.49549 10.1379 8.0999 10.6132 8.0999Z" fill="white"/>
<path d="M7.17104 8.0999C7.6463 8.0999 8.03157 7.49549 8.03157 6.7499C8.03157 6.00432 7.6463 5.3999 7.17104 5.3999C6.69579 5.3999 6.31052 6.00432 6.31052 6.7499C6.31052 7.49549 6.69579 8.0999 7.17104 8.0999Z" fill="white"/>
<path d="M4.87631 13.0499H8.8921L10.6132 19.3499H7.17105" stroke="white"/>
<path d="M7.17105 6.75H10.6132" stroke="white"/>
</svg>`;
var company_site='https://deepthought.education/';
var company_details=`Nurturing Thought Leaders out of children We create leaders for the society and the economy, we bring Ph.D. level rigor and corporate rigor to the school level! Our processes and research do to education what Tesla did to automobiles: we reposition education, we are India's answer to Tesla!`;
var pageTitle= ajaxify.data.project.type;
var description = ajaxify.data.project.description;

		$("#pageTitle").append(`${pageTitle}`);
		$("#details").append(`<div class="d-flex">
    <div class="col-md-8 pl-3">
      <div class="col-md-10 p-0 pb-4 project-heading font-weight-medium">
        ${title}
      </div>
      <div>
        <div class="pb-2 bold-font">
          Opportunity description
        </div>
        <div class="pb-3"> ${description} </div>
      </div>
      <div class="bold-font">
        Learning outcomes
      </div>
      <div>
        <ul id="learning_outcomes" style="font-weight: lighter; list-style: disc;">
          ${learning_outcomes}
        </ul>
      </div>
      <div class="bold-font">
        Pre-requisties
      </div>
      <div>
        <ul id="pre_requisites" style="font-weight: lighter; list-style: disc;">
        ${pre_requisites}
        </ul>
      </div>
      <div>
        <!-- <div class="pt-3">
          <b>Deadline:</b>${deadline}
        </div> -->
      </div>
    </div>
    <div class="col-4 pb-3">
      <div class="pb-3">
        <img src="${img_url}" class="img-fluid profile-image" alt="Responsive image"/>
      </div>
      <div class="organization-profile card m-2 border-0 shadow rounded-0">
        <div class="row">
          <div class="col-md-3 pr-0">
            <div class="pt-3 pl-3">
              <!-- <img class="organization-profile-image" src="${profile_pic}" alt=""> -->

              ${profile_pic}
            </div>
          </div>
          <div class="col-md-9 pl-0 p-3">
            <div class="bold-font pb-1">
              By <a href="${company_site}">DeepThought</a>
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
`);

		for (let i = 0; i < ajaxify.data.project.learning_outcomes.length; i++) {
			$("#learning_outcomes").append(
				`<li>${ajaxify.data.project.learning_outcomes[i]}</li>`
			);
		}
		for (let i = 0; i < ajaxify.data.project.pre_requisites.length; i++) {
			$("#pre_requisites").append(
				`<li>${ajaxify.data.project.pre_requisites[i]}</li>`
			);
		}

		$(".select-box").on("change", function () {
			if ($(".select-box").val() == "Y") {
				$(".button")
					.toggleClass("button-primary apply-button")
					.attr("disabled", false);
			}
			if ($(".select-box").val() == "N") {
				$(".button")
					.toggleClass(" apply-button  button-primary")
					.attr("disabled", true);
			}
		});
	};

  $(".apply-button").on("click", function () {
    ajaxify.go(`/applicant/storyboard/${ajaxify.data.project.tid}`);
  });

	return profile;
});