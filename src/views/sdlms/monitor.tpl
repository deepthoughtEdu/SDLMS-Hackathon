<div class="tmb">
    <div class="px-0">
        <div class="row sdlms-sections">
            <div class="col-12 col-lg-6 pl-lg-2">
                <div class="sdlms-section">
                    <div class="sdlms-section-header shadow-none custom-padding-x-40 primary-header cursor-pointer d-flex align-items-center justify-content-between font-weight-500 sdlms-text-white-22px" collapse>
                        <div class="d-flex align-items-center">
                            Hello!
                        </div>
                        <span class="sdlms-floating-right">
                            <img src="https://sdlms.deepthought.education/assets/uploads/files/files/up-arrow-icon.svg" collapse-icon alt="" />
                        </span>
                    </div>
                    <div class="sdlms-section-body custom-padding-x-40" collapse-body>
                        <!-- BEGIN user -->
                        <div class="row">
                            <div class="col-12 mx-auto font-open-sans">
                                <div class="user-session d-flex">
                                    <div class="user-profile"><img class="w-100 h-100" src="{user.picture}" alt="" /></div>
                                    <div class="w-mw-55px pl-3">
                                        <div class="user-session-heading sdlms-text-black-22px font-weight-medium">
                                            {user.fullname}
                                        </div>
                                        <p class="sdlms-text-tertiary-14px font-weight-400 sdlms-font-open-sans">
                                            <!-- IF user.signature -->
                                            {user.signature}
                                            <!-- ELSE -->
                                            I've always loved the Victorian period in English literature. Even as a kid, Dickens captured my imagination more thoroughly than the Harry Potter stories or anything else.
                                            <!-- ENDIF user.signature -->
                                        </p>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between w-mw-55px pl-3 ml-auto mt-2">
                                    <div class="tracker-state active">
                                        <div class="text-center font-weight-400 sdlms-text-tertiary-28px">
                                            <!-- IF user.assetsCount -->
                                            {user.assetsCount}
                                            <!-- ELSE -->
                                            0
                                            <!-- ENDIF user.classes_attended -->
                                        </div>
                                        <div class="session-state-label sdlms-text-tertiary-12px font-weight-600">
                                            Assets Created
                                        </div>
                                    </div>

                                    <div class="tracker-state mx-3">
                                        <div class="text-center font-weight-400 sdlms-text-tertiary-28px">
                                            <!-- IF user.classes_attended -->
                                            {user.classes_attended}
                                            <!-- ELSE -->
                                            0
                                            <!-- ENDIF user.classes_attended -->
                                        </div>
                                        <div class="session-state-label sdlms-text-tertiary-12px font-weight-600">
                                            Sessions Attended
                                        </div>
                                    </div>
                                    <div class="tracker-state">
                                        <div class="text-center font-weight-400 sdlms-text-tertiary-28px">
                                            <!-- IF feedbackCount -->
                                            {feedbackCount}
                                            <!-- ELSE -->
                                            0
                                            <!-- ENDIF feedbackCount -->
                                        </div>
                                        <div class="session-state-label sdlms-text-tertiary-12px font-weight-600">New Comments</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- End user -->
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-6 pr-lg-2 mt-3 mt-lg-0">
                <div class="sdlms-section">
                    <div class="sdlms-section-header shadow-none custom-padding-x-40 primary-header cursor-pointer d-flex align-items-center justify-content-between font-weight-500 sdlms-text-white-22px" collapse>
                        <div class="d-flex align-items-center">
                            <svg width="20" class="mr-3" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3.09246 0.171468C3.20452 0.0593279 3.35517 -0.00232524 3.5113 6.71111e-05C3.66743 0.00245946 3.81624 0.0687011 3.92501 0.184225C4.04394 0.312131 4.1092 0.483215 4.10665 0.6604C4.10411 0.837586 4.03395 1.0066 3.9114 1.13081C2.31171 2.79993 1.41585 5.05294 1.41871 7.39972C1.41871 9.93841 2.44548 12.2296 4.09573 13.8549C4.15945 13.9156 4.2108 13.9888 4.24678 14.0702C4.28277 14.1516 4.30267 14.2396 4.30532 14.329C4.30797 14.4185 4.29331 14.5075 4.26221 14.5911C4.23111 14.6746 4.18419 14.7509 4.12418 14.8155C4.01776 14.9289 3.87266 14.995 3.71973 14.9997C3.5668 15.0045 3.4181 14.9476 3.30524 14.841C2.31791 13.8876 1.53115 12.7351 0.993819 11.455C0.456484 10.1749 0.18004 8.79459 0.181648 7.39972C0.181648 4.57527 1.29501 2.01872 3.09246 0.171468ZM16.245 1.13081C16.1226 1.00643 16.0526 0.837322 16.0503 0.660138C16.048 0.482954 16.1135 0.311965 16.2326 0.184225C16.3413 0.0690889 16.4899 0.00309467 16.6457 0.000703406C16.8015 -0.00168785 16.9519 0.0597192 17.0639 0.171468C17.9878 1.11846 18.7207 2.24477 19.2203 3.48539C19.7199 4.72601 19.9763 6.05638 19.9747 7.39972C19.9747 10.3339 18.7748 12.9797 16.8511 14.841C16.7383 14.9476 16.5896 15.0045 16.4366 14.9997C16.2837 14.995 16.1386 14.9289 16.0322 14.8155C15.9724 14.7509 15.9256 14.6747 15.8946 14.5913C15.8636 14.5079 15.849 14.419 15.8517 14.3297C15.8543 14.2404 15.8742 14.1526 15.91 14.0713C15.9459 13.99 15.9971 13.9169 16.0606 13.8562C16.9079 13.0233 17.5821 12.0215 18.0423 10.9116C18.5025 9.80164 18.7391 8.60683 18.7376 7.39972C18.7376 4.95543 17.7863 2.74333 16.245 1.12954V1.13081ZM5.29321 2.41164C5.40344 2.30337 5.55087 2.2447 5.70306 2.24852C5.85525 2.25235 5.99973 2.31837 6.10472 2.43205C6.36203 2.6974 6.33605 3.1337 6.08245 3.4016C5.07298 4.47187 4.50917 5.90667 4.51138 7.39972C4.51138 9.0454 5.18311 10.5303 6.26059 11.5777C6.53275 11.8418 6.56986 12.2934 6.30389 12.5677C6.20194 12.677 6.06312 12.7417 5.91619 12.7483C5.76926 12.755 5.62548 12.7031 5.51464 12.6034C4.80847 11.9463 4.24411 11.1436 3.85817 10.2471C3.47222 9.35066 3.2733 8.38056 3.27431 7.39972C3.27431 5.44786 4.04624 3.68354 5.29321 2.41164ZM14.0739 3.4016C13.8203 3.1337 13.7943 2.6974 14.0516 2.43205C14.1566 2.31837 14.3011 2.25235 14.4533 2.24852C14.6055 2.2447 14.7529 2.30337 14.8632 2.41164C15.5037 3.0634 16.0121 3.84009 16.3587 4.69645C16.7053 5.55282 16.8832 6.47175 16.882 7.39972C16.8834 8.38067 16.6847 9.35096 16.299 10.2476C15.9133 11.1443 15.349 11.9474 14.643 12.6047C14.5317 12.7048 14.3872 12.7567 14.2396 12.7496C14.0921 12.7424 13.953 12.6768 13.8512 12.5664C13.5865 12.2934 13.6236 11.8418 13.8958 11.5777C14.4488 11.0416 14.8894 10.3943 15.1903 9.67568C15.4911 8.95707 15.6459 8.18245 15.645 7.39972C15.6472 5.90667 15.0834 4.47187 14.0739 3.4016V3.4016ZM10.0782 5.80506C9.66806 5.80506 9.27475 5.97307 8.98476 6.27213C8.69476 6.57118 8.53185 6.97679 8.53185 7.39972C8.53185 7.82265 8.69476 8.22826 8.98476 8.52731C9.27475 8.82637 9.66806 8.99437 10.0782 8.99437C10.4883 8.99437 10.8816 8.82637 11.1716 8.52731C11.4616 8.22826 11.6245 7.82265 11.6245 7.39972C11.6245 6.97679 11.4616 6.57118 11.1716 6.27213C10.8816 5.97307 10.4883 5.80506 10.0782 5.80506Z"
                                    fill="white"
                                />
                            </svg>
                            Your Live Session
                        </div>
                        <span class="sdlms-floating-right">
                            <img src="https://sdlms.deepthought.education/assets/uploads/files/files/up-arrow-icon.svg" collapse-icon alt="" />
                        </span>
                    </div>
                    <div class="sdlms-section-body custom-padding-x-40" collapse-body>
                        <div class="d-flex" upcoming-session>
                            <div class="sdlms-calendar d-flex align-items-center justify-content-center position-relative">
                                <img src="https://sdlms.deepthought.education/assets/uploads/files/files/calender.svg" alt="" />
                                <div class="sdlms-calender-date position-absolute sdlms-text-white-22px sdlms-calender-date pt-1"></div>
                                <div class="sdlms-calender-month position-absolute sdlms-text-white-16px mt-3 sdlms-calender-month"></div>
                            </div>

                            <div class="d-flex flex-column pl-2 pt-2 w-100 justify-content-between">
                                <div class="d-flex justify-content-between">
                                    <div class="sdlms-session-content  d-flex justify-content-between flex-column">
                                        <div class="d-flex">
                                            <div class="sdlms-session-title sdlms-text-black-25px line-height-1 font-weight-medium sdlms-upcoming-session-topic text-ellipse-2"></div>
                                           
                                        </div>

                                        <div class="sdlms-sub-text-secondary-13px mt-1 font-weight-500 sdlms-session-schedule"></div>

                                        <!-- <div class="sdlms-text-tertiary-18px font-weight-medium line-height-1-2">Stepping Stones</div>
                                        <div class="sdlms-text-tertiary-14px font-weight-500">Powerpuff Girls</div> -->
                                    </div>
                                    <div class="sdlms-session-title-name sdlms-session-content pr-md-2 d-flex justify-content-between flex-column">
                                        <div class="mt-1">
                                            <div class="sdlms-text-tertiary-18px font-weight-medium line-height-1-2 sdlms-upcoming-session-sub-category"></div>

                                            <div class="sdlms-sub-text-secondary-13px font-weight-500 sdlms-upcoming-session-category"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex pl-0 pl-sm-4 justify-content-between align-items-end align-items-sm-start">
                                    <div>
                                        <!-- IF isTeacher -->
                                        <!-- IF Sessions.isLive -->
                                        <button class="sdlms-button button-primary px-3-2 py-1-2 sdlms-text-white-16px d-flex align-items-center justify-content-center font-weight-500 sdlms-join-class-button" disabled>
                                            Join Live Session
                                        </button>
                                        <!-- ELSE -->
                                        <button class="sdlms-button button-primary px-3-2 py-1-2 sdlms-text-white-16px d-flex align-items-center justify-content-center font-weight-500 sdlms-start-class-button" disabled>
                                            Start Live Session
                                        </button>
                                        <!-- END Sessions.isLive -->

                                        <!-- ELSE -->
                                        <button
                                            class="sdlms-button button-primary px-3-2 py-1-2 sdlms-text-white-16px d-flex align-items-center justify-content-center font-weight-500 sdlms-join-class-button"
                                            data-toggle="tooltip"
                                            data-placement="left"
                                            title="Hakuna Matata"
                                            disabled
                                        >
                                            Join Live Session
                                        </button>
                                        <!-- END isTeacher -->
                                    </div>
                                    <div>
                                        <!-- IF isTeacher -->
                                        <div data-toggle="modal" data-target="#information_modal" class="start-session sdlms-text-tertiary-12px font-weight-medium d-flex align-items-center justify-content-center cursor-pointer mb-2">
                                            + E
                                        </div>
                                        <div class="modal modal_outer right_modal fade" id="information_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2">
                                            <div class="modal-dialog" role="document">
                                                <div class="modal-content border-0 py-0 rounded-0">
                                                    <div class="modal-body get_quote_view_modal_body overflow-auto p-0 rounded-0 pb-5"  id="sdlms-teacher-eaglebuilder"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- END isTeacher -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sdlms-spacer"></div>
        <div class="row">
            <div class="col-12 col-md-4 pl-md-2" style="min-height: 500px;">
                <div class="sdlms-section feedback-section d-block overflow-auto pb-0" style="min-height: calc(100% - 70px);">
                    <div class="align-items-center cursor-pointer d-flex font-weight-500 justify-content-around justify-content-between sdlms-section-header sdlms-text-white-17px secondary-header">
                        <div class="sdlms-floating-left">
                            <svg width="9" sdlms-toggle-members-list style="display: none;" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.48828 11.4515L3.54355 6.4882L8.48828 1.5249L6.96598 0L0.488281 6.4882L6.96598 12.9764L8.48828 11.4515Z" fill="white" />
                            </svg>
                        </div>
                        <div class="align-items-center d-flex pt-1 justify-content-center">
                            <span asset-selection-label class="active" data-fb-type="">Feedback Received</span>
                            <img src="https://sdlms.deepthought.education/assets/uploads/files/files/up-arrow-icon.svg" class="ml-2" />
                        </div>
                    </div>
                    <div class="sdlms-section-body px-3 pt-2  position-relative" >
                        <div class="assetSelectionDropDown" style="display: none;">
                            <div class="sdlms-text-black-16px text-center py-3 font-weight-bold" data-type="fr" get-asset>
                                Feedback Received
                            </div>
                            <div class="sdlms-text-black-16px text-center py-3 font-weight-bold" data-type="fg" get-asset>
                                Feedback Given
                            </div>
                        </div>
                        <ul class="sdlms-section-list sdlms-collapse sdlms-mb-feedback-section h-100 overflow-auto"></ul>
                    </div>
                </div>
                <nav aria-label="Page navigation example" class="d-flex justify-content-center pt-4">
                    <ul class="pagination">
                        <li class="page-item fb-navigator prev" data-url="">
                            <a class="" href="#" aria-label="Previous">
                                <span aria-hidden="true" class="p-2">
                                    <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 21.1797L5.72863 12L15 2.82031L12.1457 -1.24766e-07L-5.24537e-07 12L12.1457 24L15 21.1797Z" fill="#0029FF" fill-opacity="0.8" />
                                    </svg>
                                </span>
                            </a>
                        </li>

                        <li class="page-item">
                            <input class="page-link-1 sdlms-text-black-16px font-weight-500 feedback-page feedbacks-page p-0 text-center" href="#" contenteditable="true" style="width: 2rem;" /> /
                            <span class="feedback-page-count ml-1"></span>
                        </li>
                        <li class="page-item fb-navigator next" data-url="">
                            <a class="" href="#" aria-label="Next">
                                <span aria-hidden="true" class="p-2">
                                    <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M-9.25794e-07 2.82031L9.27137 12L-1.2328e-07 21.1797L2.85431 24L15 12L2.85431 -1.24766e-07L-9.25794e-07 2.82031Z" fill="#0029FF" fill-opacity="0.8" />
                                    </svg>
                                </span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="col-12 col-md-8 pr-md-2" style="min-height: 500px;">
                <div class="sdlms-section" style="min-height: calc(100% - 70px);">
                    <div class="sdlms-section-header cursor-pointer justify-content-between font-weight-500 sdlms-text-white-20px">
                        <div class="sdlms-assets-tab position-relative d-flex align-items-center sdlms-sessions-control">
                            <div class="d-flex sdlms-asset-tab w-50 tab1 justify-content-center sdlms-sessions active" data-type="navigation" data-navigate="1" data-state="upcoming">My upcoming sessions</div>
                            <div class="d-flex sdlms-asset-tab w-50 tab2 justify-content-center sdlms-sessiosn" data-type="navigation" data-navigate="-1" data-state="previous">My previous sessions</div>
                            <!-- <div class="sdlms-add-assets">
                                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.69175 7.008H15.7397V10.432H9.69175V16.448H6.26775V10.432H0.21975V7.008H6.26775V0.927999H9.69175V7.008Z" fill="white" />
                                    </svg>
                                </div> -->
                        </div>
                    </div>
                    <div class="px-3 pt-4">
                        <div class="row ">
                            <div class="sdlms-assets-tab-content w-100">
                                <div>
                                    <div>
                                        <table class="sdlms-my-upcoming-session-table w-100">
                                            <thead class="sdlms-my-upcoming-session-table-head secondary-header sdlms-text-white-18px font-weight-medium">
                                                <tr class="sdlms-my-upcoming-session-table-header-row">
                                                    <th class="font-weight-500">S. NO</th>
                                                    <th class="font-weight-500">Session Topic</th>
                                                    <th class="font-weight-500">Date And Time</th>
                                                    <th class="font-weight-500">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody class="sdlms-my-upcoming-session-table-body"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <nav aria-label="Page navigation example" class="d-flex justify-content-center pt-4">
                    <ul class="pagination">
                        <li class="page-item page-navigator prev" data-url="">
                            <a class="" href="#" aria-label="Previous">
                                <span aria-hidden="true" class="p-2">
                                    <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 21.1797L5.72863 12L15 2.82031L12.1457 -1.24766e-07L-5.24537e-07 12L12.1457 24L15 21.1797Z" fill="#0029FF" fill-opacity="0.8" />
                                    </svg>
                                </span>
                            </a>
                        </li>
                        <li class="page-item">
                            <input class="page-link-1 sdlms-text-black-16px font-weight-500 sessions-page p-0 text-center" href="#" contenteditable="true" style="width: 2rem;" /> / <span class="sessions-page-count ml-1"></span>
                        </li>
                        <li class="page-item page-navigator next" data-url="">
                            <a class="" href="#" aria-label="Next">
                                <span aria-hidden="true" class="p-2">
                                    <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M-9.25794e-07 2.82031L9.27137 12L-1.2328e-07 21.1797L2.85431 24L15 12L2.85431 -1.24766e-07L-9.25794e-07 2.82031Z" fill="#0029FF" fill-opacity="0.8" />
                                    </svg>
                                </span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</div>
