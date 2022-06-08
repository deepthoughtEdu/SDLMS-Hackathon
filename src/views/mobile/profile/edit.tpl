<div class="primary-bg">
    <div class="secondary-bg p-3 rounded-10-px my-3 primary-shadow">
      <h1 class="brand-text font-24">Edit Profile</h1>

      <form id="profileEdit" class="needs-validation font-12" novalidate>
        <div
          class="d-inline-block d-flex justify-content-center"
        >
          <img
            class="rounded-circle"
            width="100px"
            height="100px"
            alt=""
            id="profilePicture"
          />
          <div class="form-group align-self-end mb-0">
              <input
                type="file"
                accept="image/*"
                class="form-control-file d-none"
                id="uploadpicture"
                name="files[]"
              />
              <label
                for="uploadpicture"
                class="font-12 font-medium mb-0 button-sm-p button-tertiary primary-shadow"
              >
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </label>
            </div>
        </div>
        <div class="mt-4">
          <div class="form-group">
            <label for="first-name" >Full Name</label>
            <input
              type="text"
              pattern="[a-zA-Z][a-zA-Z ]{3,16}"
              class="form-control secondary-border font-12 rounded-10-px"
              id="fullname"
              required
              name="fullname"
              value="{user.fullname}"

            />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please enter a valid Name.</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-6">
            <label for="birthday" >Date of Birth</label>
            <input
              type="date"
              class="form-control font-12 rounded-10-px secondary-border"
              id="birthday"
              value="2000-01-01"
              name="birthday"
            />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please enter a valid D.O>B.</div>
          </div>
          <div class="form-group col-6">
            <label for="pronoun" >Preferred Pronoun</label>
            <select
              class="custom-select font-12 rounded-10-px secondary-border"
              id="pronoun"
              required
              name="pronoun"
             
            >
              <option selected>{user.pronoun}</option>
              <option >Him / Her</option>
              <option>She / Her</option>
              <option>They / Them</option>
              <option>Don't share</option>
            </select>
          </div>
        </div>
        <div class="dropdown row px-3">
          <label for="location">Country</label>
          <div class="input-group">
            <select
              class="custom-select w-50 secondary-border font-12 rounded-10-px"
              id="location" name="location"  
            >
          
            </select>
          </div>
        </div>
        <div class="form-group mt-3">
          <label for="social_designation">Job Description</label>
          <input
            type="text"
            class="form-control font-12 secondary-border font-12 rounded-10-px"
            id="social_designation"
            placeholder="Tell us what awesome work you do"
            name="social_designation"

          />
        </div>
        <div class="form-group">
          <label for="signature">Choose a one liner</label>
          <input
            type="text"
            class="form-control font-12 secondary-border font-12 rounded-10-px"
            id="signature"
            placeholder="Give us a one line that represents you"
            name="signature"
          />
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">
            Please give a oneliner for yourself.
          </div>
        </div>
        <div class="form-group">
          <label for="aboutme">Tell us more</label>
          <textarea
            class="form-control font-12 secondary-border font-12 rounded-10-px overflow-auto"
            id="aboutMe"
            rows="4"
            required
            name="aboutme"
          ></textarea>
          <div class="valid-feedback">Looks good!</div>
          <div class="invalid-feedback">Please tell us about yourself.</div>
        </div>
        <div class="d-flex justify-content-between">
          <button
            type="submit"
            class=" btn btn-outline-secondary rounded-lg btn-sm shadow-sm"
            onclick="window.location.href='view'"
          >
            cancel
          </button>
          <button
            type="submit"
            class=" btn button-brand rounded-lg btnbtn-sm shadow-sm px-5"
          >
            save
          </button>
        </div>
      </form>
    </div>
</div>