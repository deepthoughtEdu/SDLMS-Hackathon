<div class="tmb">
    <div class="px-0">
        <div class="row sdlms-sections">
                <div class="col-12 col-md-6">
                    <div class="sdlms-section">
                        <div class="sdlms-section-header primary-header cursor-pointer d-flex align-items-center justify-content-between font-weight-500 sdlms-text-white-20px px-4 px-1-8"
                            collapse>
                            <div class="d-flex align-items-center">
                                <div class="d-flex align-items-center mr-2">
                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.1925 1.58636H9.74597C9.39967 0.666273 8.49267 0 7.42078 0C6.34889 0 5.4419 0.666273 5.0956 1.58636H1.64906C0.742078 1.58636 0 2.30023 0 3.17273V14.2773C0 15.1498 0.742078 15.8636 1.64906 15.8636H13.1925C14.0995 15.8636 14.8416 15.1498 14.8416 14.2773V3.17273C14.8416 2.30023 14.0995 1.58636 13.1925 1.58636ZM7.42078 1.58636C7.87428 1.58636 8.24532 1.9433 8.24532 2.37955C8.24532 2.8158 7.87428 3.17273 7.42078 3.17273C6.96729 3.17273 6.59625 2.8158 6.59625 2.37955C6.59625 1.9433 6.96729 1.58636 7.42078 1.58636ZM7.42078 4.75909C8.78951 4.75909 9.89438 5.82196 9.89438 7.13864C9.89438 8.45532 8.78951 9.51819 7.42078 9.51819C6.05206 9.51819 4.94719 8.45532 4.94719 7.13864C4.94719 5.82196 6.05206 4.75909 7.42078 4.75909ZM12.368 14.2773H2.47359V13.1668C2.47359 11.5805 5.77172 10.708 7.42078 10.708C9.06985 10.708 12.368 11.5805 12.368 13.1668V14.2773Z" fill="white"/>
                                        </svg>
                                </div>   
                                Student Details
                            </div>
                            <span class="sdlms-floating-right">
                                <img src="https://sdlms.deepthought.education/assets/uploads/files/files/up-arrow-icon.svg"
                                    collapse-icon alt="" />
                            </span>
                        </div>
                        <div class="sdlms-section-body" collapse-body>
                            <!-- BEGIN user -->
                            <div class="row">
                                <div class="col-12 mx-auto font-open-sans">
                                    <div class="user-session d-flex">
                                        <div class="w-25"><img class="w-100" src={user.picture} alt=""
                                                style="border-radius: 50%;max-width:100px"></div>
                                        <div class="pl-4">
                                            <div class="user-session-heading sdlms-text-black-20px font-weight-medium">
                                                {user.fullname}</div>
                                            <p class="sdlms-text-tertiary-14px font-weight-400">{user.signature}</p>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between col-9 mx-auto mt-3">
                                        <div class="tracker-state active">
                                            <div class="text-center font-weight-400 sdlms-text-tertiary-28px">
                                                {user.assetsCount}</div>
                                            <div class="session-state-label sdlms-text-tertiary-12px font-weight-600">
                                                Assets created</div>
                                        </div>
    
                                        <div class="tracker-state mx-3">
    
                                            <div class="text-center font-weight-400 sdlms-text-tertiary-28px">
                                                <!-- IF user.classes_attended -->
                                                {user.classes_attended}
                                                <!-- ELSE -->
                                                
                                                <!-- ENDIF user.classes_attended -->
                                            </div>
                                            <div class="session-state-label sdlms-text-tertiary-12px font-weight-600">
                                                Sessions Attened</div>
                                        </div>
                                        <div class="tracker-state">
                                            <div class="text-center font-weight-400 sdlms-text-tertiary-28px">
                                               {feedbackCount}</div>
                                            <div class="session-state-label sdlms-text-tertiary-12px font-weight-600">New
                                                Comments</div>
                                        </div>
                                    </div>
    
                                </div>
                            </div>
                            <!-- End user -->
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="sdlms-section">
                        <div class="sdlms-section-header primary-header cursor-pointer d-flex align-items-center justify-content-between font-weight-500 sdlms-text-white-20px" collapse>
                            <div class="d-flex align-items-center">
                                <div class="d-flex align-items-center mr-2">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.4743 1.5H9.21537C8.88792 0.63 8.03031 0 7.01678 0C6.00324 0 5.14563 0.63 4.81818 1.5H1.55928C0.701678 1.5 0 2.175 0 3V13.5C0 14.325 0.701678 15 1.55928 15H12.4743C13.3319 15 14.0336 14.325 14.0336 13.5V3C14.0336 2.175 13.3319 1.5 12.4743 1.5ZM7.01678 1.5C7.44558 1.5 7.79642 1.8375 7.79642 2.25C7.79642 2.6625 7.44558 3 7.01678 3C6.58797 3 6.23713 2.6625 6.23713 2.25C6.23713 1.8375 6.58797 1.5 7.01678 1.5ZM8.57606 12H3.11857V10.5H8.57606V12ZM10.915 9H3.11857V7.5H10.915V9ZM10.915 6H3.11857V4.5H10.915V6Z" fill="white"/>
                                        </svg>
                                                 
                                </div>                         
                                Report card
                            </div>
                            <span class="sdlms-floating-right">
                               <img src="https://sdlms.deepthought.education/assets/uploads/files/files/up-arrow-icon.svg"
                                    collapse-icon alt="" />
                            </span>
                        </div>
                        <div class="sdlms-section-body" collapse-body>
                            <div class="row">
                                <div class="col-12 col-md-16 mx-auto">
                                    <div class="d-flex justify-content-around col-lg-10 mx-auto">
                                        <button class="button-primary button-lg sdlms-button">Basic</button>
                                        <button class="button-primary button-lg sdlms-button">Details</button>
                                        <button class="button-primary button-lg sdlms-button">Deep Dive</button>
                                    </div>
                                    <div class="sdlms-reportcard-detials d-flex justify-content-between col-12 mx-auto mt-3 p-3">
                                        <div class="tracker-state active">
                                            <div class="session-state-label sdlms-text-tertiary-16px font-weight-500">
                                                Threads captured</div>
                                            <div class="text-center font-weight-400 sdlms-text-tertiary-16px">
                                                150</div>
                                        </div>
    
                                        <div class="tracker-state mx-3">
                                            <div class="session-state-label sdlms-text-tertiary-16px font-weight-500">
                                                Session Attended</div>
                                            <div class="text-center font-weight-400 sdlms-text-tertiary-16px">
                                                <!-- IF user.classes_attended -->
                                                 {user.classes_attended}
                                                <!-- ELSE -->
                                                
                                                <!-- ENDIF user.classes_attended -->
                                            </div>
                                            
                                        </div>
                                        <div class="tracker-state">
                                            <div class="session-state-label sdlms-text-tertiary-16px font-weight-500">Characters written</div>
                                            <div class="text-center font-weight-400 sdlms-text-tertiary-16px">
                                               500</div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="sdlms-spacer"></div>
        <div class="row sdlms-sections">
                <div class="col-12 col-md-11 mx-auto sdlms-parentDashboard-view " data-view="expanded" id="expanded-view">
                    <div class="sdlms-section session-view">
                        <div class="sdlms-section-header cursor-pointer justify-content-between font-weight-500 sdlms-text-white-20px">
                            <div class="sdlms-assets-tab position-relative d-flex align-items-center sdlms-sessions-control ">
                                <div class="d-flex sdlms-asset-tab w-50  tab1 justify-content-center sdlms-sessions active"
                                data-type='navigation' data-navigate="-1" data-state="previous" SessionStatistics>Session statistics
                            </div>
                            <div class="d-flex sdlms-asset-tab w-50  tab3 justify-content-center sdlms-sessiosn"
                                data-type="navigation" data-navigate="1" data-state="feedback">Feedbacks</div>
                            <div class="d-flex sdlms-asset-tab w-50  tab2 justify-content-center sdlms-sessiosn"
                                data-type="navigation" data-navigate="2" data-state="Questions" questions>Questions</div>
                                <!-- <div class="sdlms-add-assets">
                                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.69175 7.008H15.7397V10.432H9.69175V16.448H6.26775V10.432H0.21975V7.008H6.26775V0.927999H9.69175V7.008Z" fill="white" />
                                        </svg>
                                    </div> -->
                            </div>
                        </div>
                        <div class="sdlms-section-body" collapse-body>
                            <div class="px-3 pt-0">
                                <div class="row col-equal-h" style="min-height: 33rem;">
                                    <div class="sdlms-assets-tab-content w-100">
                                        <div>
                                            <div>
                                                <table class="sdlms-my-upcoming-session-table w-100">
                                                    <thead class="sdlms-my-upcoming-session-table-head secondary-header sdlms-text-white-18px font-weight-medium">
                                                        <tr class="sdlms-my-upcoming-session-table-header-row">
                                                            <th class="font-weight-500" style="color: white;">S. No</th>
                                                            <th class="font-weight-500"style="color: white;">Session Topic</th>
                                                            <th class="font-weight-500"style="color: white;">Date and Time</th>
                                                            <th class="font-weight-500"style="color: white;"   id="change-header1">words Typed</th>
                                                            <th class="font-weight-500"style="color: white;" id="change-header2">Thread Captured</th>
                                                            <th class="font-weight-500">
                                                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                     <path d="M18.4805 0H2.31006C1.02798 0 0 1 0 2.22222V17.7778C0 19 1.02798 20 2.31006 20H18.4805C19.751 20 20.7906 19 20.7906 17.7778V2.22222C20.7906 1 19.7626 0 18.4805 0ZM18.4805 17.7778H2.31006V4.44444H10.3953H18.4805V17.7778ZM16.1704 10H4.62013V7.77778H16.1704V10ZM11.5503 14.4444H4.62013V12.2222H11.5503V14.4444Z" fill="white"/>
                                                                </svg>
                                                            </th>
                                                        </tr>
                                                        
                                                    </thead>
                                                    <tbody class="sdlms-my-upcoming-session-table-body">
                                                    </tbody>
                                                </table>
                                            </div>
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
                                        <svg width="15" height="24" viewBox="0 0 15 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15 21.1797L5.72863 12L15 2.82031L12.1457 -1.24766e-07L-5.24537e-07 12L12.1457 24L15 21.1797Z"
                                                fill="#0029FF" fill-opacity="0.8" />
                                        </svg>
    
                                    </span>
                                </a>
                            </li>
                            <li class="page-item"><input
                                    class="page-link-1 sdlms-text-black-16px font-weight-500 sessions-page p-0 text-center"
                                    href="#" contenteditable="true" style="width: 2rem;"></input>/<span
                                    class="sessions-page-count ml-1"></span>
                            </li>
                            <li class="page-item page-navigator next" data-url="">
                                <a class="" href="#" aria-label="Next">
                                    <span aria-hidden="true" class="p-2">
                                        <svg width="15" height="24" viewBox="0 0 15 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M-9.25794e-07 2.82031L9.27137 12L-1.2328e-07 21.1797L2.85431 24L15 12L2.85431 -1.24766e-07L-9.25794e-07 2.82031Z"
                                                fill="#0029FF" fill-opacity="0.8" />
                                        </svg>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="col-12 col-md-6 smaller-view sdlms-parentDashboard-view change-class" data-view="smaller" smaller-view>
                    <div class="sdlms-section">
                        <div class="sdlms-section-header primary-header cursor-pointer d-flex align-items-center justify-content-between font-weight-500 sdlms-text-white-20px px-4 px-1-8"
                            >
                            <div class="d-flex align-items-center">
                                <div class="d-flex align-items-center mr-2">
                                </div>
    
                                Sessions
                            </div>
                            <span class="sdlms-floating-right" exittomain>
                                <svg width="25" height="19" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24.2676 10.2061L16.0645 18.4092C15.332 19.1417 14.0625 18.629 14.0625 17.5792V12.8917H7.42188C6.77246 12.8917 6.25 12.3692 6.25 11.7198V7.03229C6.25 6.38287 6.77246 5.86041 7.42188 5.86041H14.0625V1.17291C14.0625 0.127992 15.3271 -0.389587 16.0645 0.342835L24.2676 8.54596C24.7217 9.00494 24.7217 9.74713 24.2676 10.2061ZM9.375 18.1651V16.212C9.375 15.8897 9.11133 15.626 8.78906 15.626H4.6875C3.82324 15.626 3.125 14.9278 3.125 14.0635V4.68854C3.125 3.82428 3.82324 3.12604 4.6875 3.12604H8.78906C9.11133 3.12604 9.375 2.86237 9.375 2.5401V0.586976C9.375 0.26471 9.11133 0.0010385 8.78906 0.0010385H4.6875C2.09961 0.0010385 0 2.10065 0 4.68854V14.0635C0 16.6514 2.09961 18.751 4.6875 18.751H8.78906C9.11133 18.751 9.375 18.4874 9.375 18.1651Z" fill="white"/>
                                </svg>

                            </span>
                        </div>
                        <div class="sdlms-section-body">
                            <div>
                                <div class="row col-equal-h" style="min-height: 33rem;">
                                    <div class="sdlms-assets-tab-content w-100">
                                        <div>
                                            <div>
                                                <table class="sdlms-my-upcoming-session-table w-100">
                                                    <thead
                                                        class="sdlms-my-upcoming-session-table-head secondary-header sdlms-text-white-18px font-weight-medium">
                                                        <tr class="sdlms-my-upcoming-session-table-header-row ">
                                                            <th class="font-weight-500" style="color: white;">Session Topic
                                                            </th>
                                                            <th class="font-weight-500" style="color: white;">Date and Time
                                                            </th>
                                                            <th class="font-weight-500">
                                                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M18.4805 0H2.31006C1.02798 0 0 1 0 2.22222V17.7778C0 19 1.02798 20 2.31006 20H18.4805C19.751 20 20.7906 19 20.7906 17.7778V2.22222C20.7906 1 19.7626 0 18.4805 0ZM18.4805 17.7778H2.31006V4.44444H10.3953H18.4805V17.7778ZM16.1704 10H4.62013V7.77778H16.1704V10ZM11.5503 14.4444H4.62013V12.2222H11.5503V14.4444Z"
                                                                        fill="white" />
                                                                </svg>
                                                            </th>
                                                        </tr>
    
                                                    </thead>
                                                    <tbody class="sdlms-my-upcoming-session-table-body">
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
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
                                        <svg width="15" height="24" viewBox="0 0 15 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15 21.1797L5.72863 12L15 2.82031L12.1457 -1.24766e-07L-5.24537e-07 12L12.1457 24L15 21.1797Z"
                                                fill="#0029FF" fill-opacity="0.8" />
                                        </svg>
    
                                    </span>
                                </a>
                            </li>
                            <li class="page-item"><input
                                    class="page-link-1 sdlms-text-black-16px font-weight-500 sessions-page p-0 text-center"
                                    href="#" contenteditable="true" style="width: 2rem;"></input>/<span
                                    class="sessions-page-count ml-1"></span>
                            </li>
                            <li class="page-item page-navigator next" data-url="">
                                <a class="" href="#" aria-label="Next">
                                    <span aria-hidden="true" class="p-2">
                                        <svg width="15" height="24" viewBox="0 0 15 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M-9.25794e-07 2.82031L9.27137 12L-1.2328e-07 21.1797L2.85431 24L15 12L2.85431 -1.24766e-07L-9.25794e-07 2.82031Z"
                                                fill="#0029FF" fill-opacity="0.8" />
                                        </svg>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="col-12 col-md-6 feedback-sections change-class">
                <div class="sdlms-section feedback-section d-block overflow-auto">
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
                    <div class="sdlms-section-body px-3 pt-2 col-equal-h position-relative" style="min-height: 34rem;">
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
                
                <div class=" col-12 col-md-6 sdlms-asset-view change-class"student-assets>
                        <div class="sdlms-section">
                            <div class="sdlms-section-header cursor-pointer justify-content-between font-weight-500 sdlms-text-white-20px">
                                <div class="sdlms-assets-tab position-relative d-flex align-items-center" id="nav-tab"
                                    role="tablist">
                                   
                                    <a class="d-flex sdlms-asset-tab w-50 tab1 justify-content-center sdlms-sessions active"
                                        id="nav-student-thread-tab" data-toggle="tab"
                                        href="#nav-student-thread-tab-panel" role="tab" aria-controls="nav-home"
                                        aria-selected="true">
                                        <!-- IF isTeacher --> Planned <span class="hidden-on-collapsed">&nbsp;Eagle
                                            Builder</span><span class="shown-on-collapsed">&nbsp;EB</span>
                                        <!-- ELSE --> Thread Builder
                                        <!--END isTeacher -->
                                    </a>
                                    <a
                                        class="d-flex sdlms-asset-tab w-50 tab2 justify-content-center sdlms-sessiosn"
                                        id="nav-student-eagle-tab"
                                        data-toggle="tab"
                                        data-href="#nav-student-eagle-tab-panel"
                                        href="javascript:void(0)"
                                        role="tab"
                                        aria-controls="nav-profile"
                                        aria-selected="false"
                                    >
                                        <!-- IF isTeacher -->
                                        Actual <span class="hidden-on-collapsed">&nbsp;Eagle Builder</span><span class="shown-on-collapsed">&nbsp;EB</span>
                                        <!-- ELSE -->
                                        Eagle Builder
                                        <!--END isTeacher -->
                                    </a>
                                </div>
                            </div>

                            <div class="sdlms-section-body px-3 pt-4">
                                <div class="row">
                                    <div class="tab-content w-100" id="nav-tabContent">
                                        <div class="sdlms-assets-tab-content tab-pane fade show active w-100"
                                            id="nav-student-thread-tab-panel" role="tabpanel"
                                            aria-labelledby="nav-student-thread-tab">
                                            <div class="sdlms-asset sdlms-thread-builder" id="studentThreadBuilder">

                                            </div>
                                        </div>
                                        <div class="sdlms-assets-tab-content tab-pane fade show w-100"
                                            id="nav-student-eagle-tab-panel" role="tabpanel"
                                            aria-labelledby="nav-student-eagle-tab">
                                            <div class="sdlms-asset sdlms-eagle-builder" id="studentEagleBuilder">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
		</div>        
    </div>
</div>