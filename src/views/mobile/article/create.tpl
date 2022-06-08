<div class="primary-bg">
  <div class="secondary-bg p-3 rounded-10-px my-3 primary-shadow">
    <h1 class="brand-text font-24 mb-4">Create Article</h1>
    <form class="needs-validation font-12" id="create-article" novalidate>
      <div class="form-group">
        <input type="text" class="form-control font-12 secondary-border font-12 rounded-10-px" id="nudge-title"
          placeholder="Choose a Title" required pattern="[A-Z,a-z]{4,100}" name="title" />
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please enter a valid Title</div>
      </div>
      <div class="form-group">
        <textarea class="form-control font-12 secondary-border font-12 rounded-10-px" id="nudge-description" rows="10"
          placeholder="Share your wisdom with the world" name="content" required></textarea>
        <div class="valid-feedback">Looks good!</div>
        <div class="invalid-feedback">Please enter a description</div>
      </div>

      <!-- initial state -->
      <div class="row img-open">
        <div class="col-7">
          <div class="file-input">
            <input type="file" name="files[image]" accept="image/*" class="file invisible position-absolute" id="img-input" />
            <label for="img-input"
              class="secondary-border primary-text justify-content-center d-flex align-items-center secondary-bg rounded-10-px position-relative py-2 mt-1"><i
                class="fa-solid fa-image mr-2"></i>Add Header Image</label>
          </div>
        </div>
        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0" id="categories-btn">
            <i class="fa-solid fa-tags"></i>
          </button>
        </div>
        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0">
            <i class="fa-solid fa-brain"></i>
          </button>
        </div>
        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0"
            id="nudge-btn">
            <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/Mask-Group-1.png" alt="" />
          </button>
        </div>
      </div>

      <!-- nudges open -->
      <div class="row nudge-open d-none">
        <div class="col-7">
          <div class="input-group">
            <input type="search" class="form-control rounded-10-px font-12 secondary-border" id="search-nudge"
              placeholder="Search existing nudge" aria-label="Search existing nudge" aria-describedby="button-addon2" />
            <div class="input-group-append">
              <button class="btn button-secondary border-0 rounded-10-px font-12" type="button" id="button-addon2">
                <i class="fas fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <div id="nudges-list" class="secondary-bg px-1 py-2 rounded-bottom shadow-sm">
          </div>
        </div>

        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0"
            id="img-btn">
            <i class="fas fa-solid fa-image"></i>
          </button>
        </div>

        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0"
            id="categories-btn">
            <i class="fa-solid fa-tags"></i>
          </button>
        </div>

        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0">
            <i class="fa-solid fa-brain"></i>
          </button>
        </div>
      </div>

      <!-- categories open -->
      <div class="row categories-open d-none">
        <div class="col-7">
          <div class="categories-tree font-12">
            <ul>
              <li>
                <div id="opener" data-toggle="collapse" data-target="#open-categories" aria-expanded="false"
                  aria-controls="open-categories">
                  <p>Category</p>
                  <i class="fas fa-solid fa-chevron-down chevron-180 mr-2"></i>
                </div>
                <ul class="collapse" id="open-categories">
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0"
            id="img-btn">
            <i class="fas fa-solid fa-image"></i>
          </button>
        </div>

        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0">
            <i class="fa-solid fa-brain"></i>
          </button>
        </div>

        <div class="col-1 mx-2 px-0">
          <button type="button" class="btn-icon rounded-circle button-secondary font-14 p-2 border-0"
            id="nudge-btn">
            <img src="https://blog.deepthought.education/wp-content/uploads/2022/04/Mask-Group-1.png" alt="" />
          </button>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-3">
        <button type="submit" class="button-brand rounded-lg btn-sm shadow-sm px-4">
          Publish
        </button>
      </div>
    </form>
  </div>
</div>