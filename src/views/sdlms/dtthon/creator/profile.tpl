   <div id="create-profile-Preview" class="sdlms-section session-view sdlms-form-elements">
      <div class="sdlms-section-header shadow-none custom-padding-x-40 primary-header align-items-center justify-content-between ">
        <div class=" align-items-center sdlms-text-white-20px" style="text-align:center;"><span class="sdlms-floating-left"><svg class="backBtn" width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5261 18L13 15.8849L4.96494 9L13 2.11505L10.5261 0L0 9L10.5261 18Z" fill="white" />
              <line x1="5" y1="9" x2="26" y2="9" stroke="white" stroke-width="4" />
            </svg></span>
          Create Profile page of your Project</div>
      </div>
      <div class="sdlms-section-body">
        <div class="d-flex">
          <div class="col-6 pl-0">
            <div class="col-12 p-0">
              <div class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
                <div class="sdlms-floating-label label-style">Title</div>
                <textarea id="pTitle" class="form-control label-text" placeholder="Enter Text Here" name="project-title" rows="2"></textarea>
              </div>
            </div>
            <div class="col-12 p-0">
              <div class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
                <div class="sdlms-floating-label label-style">Image <span class="secondary-text"> (Optional) </span>
                </div>
                <textarea id="imageURL" class="form-control image-placeholder label-text" placeholder="Image URL" name="content" rows="2"></textarea>
              </div>
            </div>
          </div>
          <div class="col-6 pr-0">
            <div class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
              <div class="sdlms-floating-label label-style">Description</div>
              <textarea id="pDescription" class="form-control discript-textarea label-text" placeholder="Please enter description of the project" name="content" rows="6" maxlength="500"></textarea>
              <label class="holder"><span class="secondary-text">
                  <div id="the-count"><span id="current">0</span><span id="maximum">/500</span></div></label>
            </div>
          </div>
        </div>
        <div class="d-flex">
          <div class="col-6 pl-0">
            <div class="d-flex flex-column sdlms-floating-label-input mt-4 justify-content-between">
              <div class="sdlms-floating-label">Learning Outcomes
              </div>
              <div class="sdlms-form-elements container col-12 pl-0 pr-0">
                <textarea id=learnTask class="form-control add-more-values" placeholder="Please enter the learning outcomes for the project" name="content" rows="1"></textarea>
                <svg class="sdlms-floating-right" width="10" height="10" viewBox="0 0 10 10" class="mr-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.29703 4.13574V5.66504H0.525543V4.13574H9.29703ZM5.72867 0.400391V9.7168H4.10269V0.400391H5.72867Z" fill="#0029FF"></path>
                </svg>
              </div>
              <div id="learnAddedTasks"></div>
            </div>
          </div>
          <div class="col-6 pr-0">
            <div class="d-flex flex-column sdlms-floating-label-input mt-4 justify-content-between">
              <div class="sdlms-floating-label">Pre-requisites
              </div>
              <div class="sdlms-form-elements container col-12 pl-0 pr-0">
                <textarea id=preReqTask class="form-control add-more-values" placeholder="Please enter the pre-requisites for the project" name="content" rows="1"></textarea>
                <svg class="sdlms-floating-right" width="10" height="10" viewBox="0 0 10 10" class="mr-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.29703 4.13574V5.66504H0.525543V4.13574H9.29703ZM5.72867 0.400391V9.7168H4.10269V0.400391H5.72867Z" fill="#0029FF"></path>
                </svg>
              </div>
              <div id="preReqAddedTasks"></div>
            </div>
          </div>
        </div>

      <div class="d-flex">
        <div class="col-6 pl-0">


          <div class="row">

            <div class="col-3 pr-0">
              <div id="id_category" class="d-flex flex-column align-items-center mt-4 justify-content-between">
                  <select class="custom-select border-0" style="background-color:rgba(0, 0, 0, 0.05);  font-size: var(--sdlms-font-size-18); border-radius:0.50rem;">
                  <option selected>Category</option>
                  <option value="1" class="dropdown-item p">Project</option>
                  <option value="2" class="dropdown-item c">Course</option>
                  <option value="3" class="dropdown-item s">Selection</option>
                  </select>
              </div>
            </div>

            <div class="col-6">
              <div class="custom-commit" style="display:none">
                <div class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
                  <div class="sdlms-floating-label label-style">Commit: Custom
                      <svg class="sdlms-floating-right custom-arrow" width="10" height="8" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.11523 10L9 3.81909L15.8848 10L18 8.09713L9 0L0 8.09713L2.11523 10Z" fill="black"/>
                      </svg>
                  </div>
                  <input type="date" id="pDeadline" class="form-control label-text m-2" placeholder="Please enter commitment" name="content" rows="1" >
                </div>
              </div>

               <div id="id_commitment" class="mt-4">
                  <select id="custom-commit-dropdown" class="custom-select border-0" style="background-color:rgba(0, 0, 0, 0.05);  font-size: var(--sdlms-font-size-18); border-radius:0.50rem;"">
                  <option selected>Commitment</option>
                  <option value="1" class="dropdown-item">Part Time</option>
                  <option value="2" class="dropdown-item">Full Time</option>
                  <hr class="m-0">
                  <option value="3" class="dropdown-item custom-dropdown">Custom</option>
                  </select>
               </div>
            </div>


              <div>
              </div>
         </div>
      </div>
      <div class="col-6 pr-0">
          <div class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
              <div class="sdlms-floating-label label-style">Deadline <span class="secondary-text"> (Optional) </span>
              </div>
              <input type="date" id="pDeadline" class="form-control label-text m-2" placeholder="Please Enter the deadline of the project (dd-mm-yyyy)" name="content" rows="2">
           </div>
        </div>
      </div>
      <div class="row pr-0 pt-4 m-4 d-flex align-items-center justify-content-between">
       <div class="justify-content-end">
          <button type="button" id="createProject" class="sdlms-button button-primary button-md d-flex align-items-center">Create Project</button>
        </div>
        <div class="justify-content-start">
          <button type="button" id="Preview-btn" class="sdlms-button button-primary button-md d-flex align-items-center">Preview Profile</button>
        </div>
        </div>
    </div>
    <div class="pl-0 mt-4 d-flex align-items-center justify-content-end">
      <button type="submit" id="Next-btn" class="sdlms-button button-primary button-lg d-flex align-items-center">Next</button>
    </div>
  </div>