  <!-- preview modal -->
  <div class="modal fade w-90" id="previewModal" tabindex="-1" role="dialog" aria-labelledby="previewModalLabel"
    aria-display-none="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body bg-light">

          <!-- nav btns -->
          <div class="display-flex jc-between margin-bottom-3 ai-center">
            <i id="prev-carousal" class="fa fa-chevron-left"></i>
            <p id="page-count-car" class="margin-bottom-0"></p>
            <i id="next-carousal" class="fa fa-chevron-right"></i>
          </div>

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
                    <span class="multi-dropdown-option "><label><input class="input-checkbox margin-right-2" type="checkbox"
                          value="login">Login</label></span>
                    <span class="multi-dropdown-option text__black text__black--sm"><label><input
                          class="input-checkbox margin-right-2" type="checkbox" value="signup">Sign
                        Up</label></span>
                    <span class="multi-dropdown-option text__black text__black--sm"><label><input
                          class="input-checkbox margin-right-2" type="checkbox" value="create_event">Create
                        Event</label></span>
                    <span class="multi-dropdown-option text__black text__black--sm"><label><input
                          class="input-checkbox margin-right-2" type="checkbox" value="create_event">Create
                        Event</label></span>
                    <span class="multi-dropdown-option text__black text__black--sm"><label><input
                          class="input-checkbox margin-right-2" type="checkbox" value="create_event">Create
                        Event</label></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- bottom btns -->
          <div class="display-flex jc-between">
            <button type="button" class="btn margin-right-3 btn-warning"
              data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success" id="draft-car">Save as draft</button>
            <button type="button" class="btn btn-success" id="publish-car">Publish</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- delete modal -->
  <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
    aria-display-none="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <p class="font-20 font-semi-bold margin-bottom-3">Are you Sure you want to remove <span id="anecdote-meta"></span>
          </p>
          <div class="display-flex jc-between">
            <button type="button" class="btn margin-right-3 btn-warning"
              data-dismiss="modal" id="cancel-delete">Cancel</button>
            <button type="button" class="btn btn-danger margin-right-3"
              id="confirm-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container pt-5">
    <h1 class="heading font-30 font-bold primary-text mb-5">Saved Anecdotes</h1>

    <table id="table-2" class="table table-striped">
      <thead class="secondary-text">
        <tr>
          <th scope="col">
            <input type="checkbox" name="" id="all-check">
          </th>
          <th scope="col">Author</th>
          <th scope="col">Anecdotes heading</th>
          <th scope="col">Anecdotes content</th>
          <th scope="col">Deployed on(pages)</th>
        </tr>
      </thead>
      <tbody class="tertiary-bg" id="table-body">
      </tbody>
    </table>

    <div class="btn-container display-flex justify-content-between ai-center">
      <button class="btn btn-danger margin-right-3" id="delete-btn">Delete</button>
        <button class="btn btn-warning margin-right-3" id="edit-btn">Edit</button>
    </div>

  </div>

  <div id="input" class="display-none column-flex jc-center ai-center p-3 margin-vertical-4">
    <div class="display-flex w-50 jc-between ai-center">
      <i id="prev" class="fa fa-chevron-left"></i>
      <p id="page-count" class="margin-bottom-0"></p>
      <i id="next" class="fa fa-chevron-right"></i>
    </div>

    <div class="container-input  w-50  margin-vertical-3">
      <form action="" class="anecdote-input-form form-group margin-bottom-0">
        <input type="text" placeholder="Enter Anecdote title here" id="title-input" class="form-control margin-bottom-3">
        <textarea name="content-input" id="content-input" cols="30" rows="5" class="form-control"
          placeholder="Enter Anecdote content here"></textarea>
      </form>
    </div>
    <div class="anecdotes-button display-flex w-50 jc-between">
      <button class="btn margin-right-3 btn-warning" id="cancel-btn">Cancel</button>
      <button class="btn btn-info" data-toggle="modal"
        data-target="#previewModal" id="preview-btn">Preview</button>
      <div>
        <button class="btn margin-right-3 btn-success" id="draft-btn">Save as draft</button>
        <button class="btn btn-success" id="publish-btn">Publish</button>
      </div>
    </div>
  </div>