<div class="primary-bg">
    <div class="secondary-bg rounded-10-px">
      <div class="container d-flex align-items-center pt-1 mb-5">
        <a href="faq" class="primary-text">
          <i class="fas fa-solid fa-arrow-left-long"></i>
        </a>
        <p class="font-14 font-medium primary-text mb-0 position-self-center">
          Create Ticket
        </p>
      </div>

      <div class="container mt-30-px">
        <p class="font-medium mb-30-px">Good Afternoon, How may I help you</p>

        <form class="mt-4" id="create-ticket">
          <div class="form-group">
            <select
              class="form-control font-12 primary-border component-md"
              id="categorySelect" name="category"
            >
              <option selected disabled>Select Category</option>
              <option>Event Registration</option>
              <option>Asset Creation</option>
              <option>Privacy Concern</option>
              <option>Admin Problem</option>
            </select>
          </div>

          <div class="form-group">
            <label for="phone" class="font-12 primary-text font-medium"
              >Enter your phone number:</label
            >
            <input
              type="number"
              class="form-control font-12 primary-border"
              id="phone"
              name="phone"
            />
          </div>

          <div class="form-group">
            <label for="placeOfProblem" class="font-12 primary-text font-medium"
              >Where are you stuck?</label
            >
            <input
              type="text"
              class="form-control font-12 primary-border"
              id="placeOfProblem" name="subject"
            />
          </div>

          <div class="form-group">
            <label for="eloberation" class="font-12 primary-text font-medium"
              >Can You elaborate so we can reach to you?</label
            >
            <textarea
              class="form-control font-12 primary-border"
              id="eloberation" name="description"
              rows="5"
            ></textarea>
          </div>

          <div class="d-flex">
            <div class="form-group">
              <input
                type="file"
                accept="image/*"
                class="form-control-file d-none"
                id="imageInput"
                name="files[image]"
              />
              <label
                for="imageInput"
                class="font-12 font-medium button-sm-p button-tertiary primary-shadow"
              >
                Add Pictures
              </label>
            </div>

            <button
              type="submit"
              class="brand-bg border-0 rounded-circle btn-30-px pl-1 pt-1 position-self-end"
            >
              <i class="fas fa-solid fa-paper-plane secondary-text"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
</div>