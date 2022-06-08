<div class="container pt-5">
    <h1 class="heading font-30 font-bold primary-text margin-bottom-5">Add Anecdotes</h1>
    <div class="container-all display-flex jc-between">
      <div class="container-left display-flex column-flex w-50 margin-right-5">

        <form class="form-group display-flex jc-between margin-bottom-5">
          <label class="primary-text primary-text font-medium margin-right-3 margin-bottom-0" for="username-search">Tag a user who's post you want to
            select</label>
          <div class="w-50">
            <input type="text" id="username-search" class="form-control border-0 bg-layer ps-1 primary-text">
            <div class="display-none background-white border border-radius-bottom-5px" id="users-menu">
              <div id="menu-content">
              </div>
              <p class="margin-bottom-0 text-center border">===</p>
            </div>
          </div>
        </form>

        <form class="form-group h-100 jc-between margin-bottom-5 multi-dropdown-form display-none" id="filters-dropdown">
          <label class=" w-50 primary-text primary-text font-medium ">Filter Reflections By</label>
          <div class=" multi-dropdown dropdown w-50">
            <div class=" h-100 w-100">
              <div
                class="dropdown-toggle multi-dropdown-btn  border-0  bg-layer  primary-text text-center  py-2 margin-bottom-2 w-100"
                type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown button
              </div>
              <div class=" dropdown-menu  bg-white  shadow-sm px-3" aria-labelledby="dropdownMenuButton">
                <div class="display-flex column-flex">
                  <input type="text" class="form-control border-0 gray-bg margin-bottom-2" placeholder="Search">
                  <p class="secondary-text margin-vertical-1">Select By Time Range</p>
                  <div class="pl-2 display-flex column-flex">
                    <span class="multi-dropdown-option "><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="In last day">In last day</label></span>
                    <span class="multi-dropdown-option"><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="In last week">In last week</label></span>
                    <span class="multi-dropdown-option "><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="In last month">In last month</label></span>
                  </div>
                  <p class="secondary-text margin-vertical-1">Select Event</p>
                  <div class="pl-2 display-flex column-flex">
                    <span class="multi-dropdown-option"><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="Workshop">Workshop</label></span>
                    <span class="multi-dropdown-option "><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="Hackathon">Hackathon</label></span>
                    <span class="multi-dropdown-option "><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="Socratic Dialouge">Socratic Dialouge</label></span>
                  </div>
                  <p class="secondary-text margin-vertical-1">Select By Post Type</p>
                  <div class="pl-2 display-flex column-flex">
                    <span class="multi-dropdown-option"><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="Post">Post</label></span>
                    <span class="multi-dropdown-option "><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="Thread">Thread</label></span>
                    <span class="multi-dropdown-option "><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="Article">Article</label></span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </form>

        <table id="table" class="table table-striped display-none">
          <thead class="secondary-text">
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Reflection(to be added into anecodote)</th>

            </tr>
          </thead>
          <tbody id="table-body" class="tertiary-bg">
            <tr class="reflection-listing">
              <th scope="row">1</th>
              <td>Mark</td>

            </tr>
            <tr class="reflection-listing">
              <th scope="row">2</th>
              <td>Jacob</td>


            </tr>
            <tr class="reflection-listing">
              <th scope="row">3</th>
              <td>Jake</td>

            </tr>
            <tr class="reflection-listing">
              <th scope="row">4</th>
              <td>Blake</td>

            </tr>
          </tbody>
        </table>
      </div>

      <div class="container-right column-flex w-50 display-none" id="container-right">
        <div id="user-info" class="user-info display-flex  bg-layer w-100 border-0 p-3 user-info-border margin-bottom-3">
        </div>
        <div class="anecdote-inputs">
          <form action="" class="anecdote-input-form form-group margin-bottom-0">
            <input type="text" name="title-input" placeholder="Enter Anecdote title here" id="title-input" class="form-control margin-bottom-3">
            <textarea name="content-input" id="content-input" cols="30" rows="5" class="form-control margin-bottom-4"
              placeholder="Enter Anecdote content here"></textarea>
            <div class="anecdotes-button display-flex jc-between">
              <button type="button" class="btn btn-info margin-right-3" id="save-btn">Save as Draft</button>
              <button type="button" class="btn btn-info" data-toggle="modal"
                data-target="#previewModal" id="modal-btn">Make as Anecdote</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>


<!-- preview modal -->
  <div class="modal fade w-90" id="previewModal" tabindex="-1" role="dialog" aria-labelledby="previewModalLabel"
    aria-display-none="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body bg-light">

          <!-- carousal content -->
          <div class="p-3 bg-white rounded-15-px margin-bottom-4" id="carousal-content">
          </div>

          <!-- deployment dropdown -->
          <div class="display-flex jc-center">
            <div class=" multi-dropdown dropdown w-50">
              <div>
                <div class="dropdown-toggle border-0 p-2 margin-bottom-2 bg-white" type="button" id="dropdownMenuButton"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Deploy to
                </div>
                <div class=" dropdown-menu  bg-white  shadow-sm px-2 pb-0" aria-labelledby="dropdownMenuButton">
                  <div class="display-flex column-flex">
                    <span class="multi-dropdown-option "><label><input class="input-checkbox placement-option margin-right-2" type="checkbox"
                          value="login">Login</label></span>
                    <span class="multi-dropdown-option text__black text__black--sm"><label><input
                          class="input-checkbox placement-option margin-right-2" type="checkbox" value="signup">Sign
                        Up</label></span>
                    <span class="multi-dropdown-option text__black text__black--sm"><label><input
                          class="input-checkbox placement-option margin-right-2" type="checkbox" value="create_event">Create
                        Event</label></span>
                    <span class="multi-dropdown-option text__black text__black--sm"><label><input
                          class="input-checkbox placement-option margin-right-2" type="checkbox" value="create_event">Create
                        Event</label></span>
                    <span class="multi-dropdown-option text__black text__black--sm"><label><input
                          class="input-checkbox placement-option margin-right-2" type="checkbox" value="create_event">Create
                        Event</label></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- bottom btns -->
          <div class="display-flex jc-between margin-top-4">
            <button type="button" class="btn margin-right-3 btn-warning"
              data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-info" id="save-btn-car">Save as Draft</button>
            <button type="button" class="btn btn-success" id="submit-btn-car">Submit as Final</button>
          </div>
        </div>
      </div>
    </div>
  </div>