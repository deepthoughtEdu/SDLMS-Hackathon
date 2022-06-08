<div class="primary-bg">
    <div class="secondary-bg p-3 rounded-10-px my-3 primary-shadow">
      <h1 class="brand-text font-24">Create Nudge</h1>
      <form id="nudgeCreate" class="needs-validation font-12" novalidate>
        <div class="form-group">
          <label for="nudge-title">Choose a Title</label>
          <input
            type="text"
            class="form-control font-12 secondary-border font-12 rounded-10-px"
            id="title"
            required
            pattern="[a-zA-Z][a-zA-Z ]{3,100}"
            name="title"
          />
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please enter a valid Title</div>
        </div>
        <div class="form-group">
          <label for="">Add a description</label>
          <textarea
            class="form-control font-12 secondary-border font-12 rounded-10-px"
            id="description"
            rows="4"
            required
            name="description"
          ></textarea>
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please enter a description</div>
        </div>

        <div class="form-check form-check-inline">
          <label class="d-inline" for="asset_type"
            >I want to create Nudges for</label
          >
          <input
            class="form-check-input mb-2 ml-2"
            type="radio"
            name="asset_type"
            id="inlineRadio1"
            value="article"

          />
          <label class="form-check-label mb-2" for="inlineRadio1"
            >Article</label
          >
          <input
            class="form-check-input mb-2 ml-2"
            type="radio"
            name="asset_type"
            id="inlineRadio2"
            value="event"
          />
          <label class="form-check-label mb-2" for="inlineRadio2">Event</label>
        </div>
        <div class="form-group">
          <input
            class="form-control mr-sm-2 font-12 secondary-border font-12 rounded-10-px"
            type="search"
            placeholder="@ an Article / Event"
            aria-label="Search"
            name="assetId"
            id="assetId"
          />
        </div>
        <div class="form-group">
          <label for="invitation_text">Choose a one line invitation</label>
          <input
            type="text"
            class="form-control font-12 secondary-border font-12 rounded-10-px"
            id="invitation_text"
            required
             name="invitation_text"
          />
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please enter a one liner</div>
        </div>
        <div class="row">
          <div class="col-6">
            <div class="file-input">
              <p class="mb-2">Choose a Image</p>
              <input type="file" id="file" class="file invisible position-absolute"  name="files[image]"  />
              <label for="file" class="secondary-border primary-text justify-content-center d-flex align-items-center secondary-bg rounded-10-px position-relative py-2"
                ><i class="fa fa-picture-o" aria-hidden="true"></i> Select</label
              >
            </div>
         
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="schedule">Select Timings</label>
              <input
                type="time"
                class="form-control font-12 secondary-border font-12 rounded-10-px"
                id="schedule"
                value="12:00:00"
                required
                 name="schedule"
              />
              <div class="valid-feedback">Looks good!</div>
              <div class="invalid-feedback">Please enter a valid Title</div>
            </div>
          </div>
        </div>
        <div>
            </button>
            <div class="form-group">
              <label for="">Choose an Icon for</label>
              <select id="fav_icon" class="custom-select font-12 secondary-border font-12 rounded-10-px" id="validationCustom04" required  name="fav_icon">
                <option>Article</option>
                <option>Event</option>
              </select>
            </div>
        </div>
        <div class="d-flex justify-content-between py-3">
          <button
            type="submit"
            class="btn btn-sm btn-outline-secondary shadow-sm px-4"
          >
            Preview
          </button>
          <button type="submit" class="button-brand rounded-lg btn btn-sm shadow-sm px-4">
            Publish
          </button>
        </div>
      </form>
    </div>
</div>