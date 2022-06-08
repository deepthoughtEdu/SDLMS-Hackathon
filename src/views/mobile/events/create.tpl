<!-- categories modal -->
<div class="modal fade" id="categories-modal" tabindex="-1" aria-labelledby="categories-modal-label"
                aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable rounded-10-px p-4 m-0">
        <div class="modal-content secondary-bg">
            <div class="modal-body">
                <div class="categories-tree font-12">
                    <ul>
                        <li>
                            <div id="opener" data-toggle="collapse" data-target="#open-categories"
                                aria-expanded="false" aria-controls="open-categories">
                                <p>Category</p>
                                <i class="fas fa-solid fa-chevron-down chevron-180 mr-2"></i>
                            </div>
                            <ul class="collapse" id="open-categories">
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="d-flex justify-content-center mt-3">
                    <button type="submit" class="button-brand button-md-p font-12"
                        id="submit-categories">Submit selection</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- rr modal -->
<div class="modal fade" id="rr-modal" tabindex="-1" aria-labelledby="rr-modal-label" aria-hidden="true">
    <div class="modal-dialog rounded-10-px p-4 m-0">
        <div class="modal-content secondary-bg">
            <div class="modal-body">
                <div class="d-flex justify-content-center mb-3">
                    <p class="font-18 font-medium">Select Rigor Rank</p>
                </div>
                <form>
                    <div class="d-flex justify-content-around">
                        <div class="inc-btn">
                            <i class="fas fa-solid fa-plus"></i>
                        </div>
                        <input type="text" name="rr" id="rr-select" value="5">
                        <div class="dec-btn">
                            <i class="fas fa-solid fa-minus"></i>
                        </div>
                    </div>

                    <div class="d-flex justify-content-center mt-3">
                        <button class="button-brand button-md-p" id="submit-rr">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="primary-bg d-flex justify-content-center">
  <div class="container secondary-bg rounded-10-px mt-3">
    <p class="brand-text font-20 mb-4 mt-2">Create Event</p>

    <form class="pb-3" id="create-event">
      <div class="form-group">
        <label for="event-title" class="font-12 primary-text font-medium">
          Enter the title of your event:
        </label>
        <input type="text" class="form-control font-12 primary-border" id="event-title" name="name" />
      </div>

      <div id="btn-rack">
        <div class="buttons d-flex justify-content-between align-items-center">
          <div class="form-group">
            <input type="file" accept="image/*" class="form-control-file d-none" id="event-img" name="files[image]" />
            <label for="event-img"
              class="primary-shadow button-secondary circle-sm rounded-circle d-flex justify-content-center align-items-center mb-0">
              <i class="fas fa-solid fa-image"></i>
            </label>
          </div>

          <div class="form-group">
            <input type="time" name="time" id="event-time"
              class="invisible position-absolute primary-shadow button-secondary circle-sm rounded-circle justify-content-center align-items-center" />
            <label for="event-time"
              class="primary-shadow button-secondary circle-sm rounded-circle d-flex justify-content-center align-items-center mb-0">
              <i class="fas fa-solid fa-clock"></i>
            </label>
          </div>

          <div class="form-group">
            <input type="date"
              class="invisible position-absolute primary-shadow button-secondary circle-sm rounded-circle d-flex justify-content-center align-items-center d-none"
              id="event-date" name="date" />
            <label for="event-date"
              class="primary-shadow button-secondary circle-sm rounded-circle d-flex justify-content-center align-items-center mb-0">
              <i class="fas fa-solid fa-calendar font-14"></i>
            </label>
          </div>

          <div class="form-group">
            <button type="button"
              class="primary-shadow button-secondary rounded-lg border-0 d-flex justify-content-around align-items-center py-2 px-2 font-12"
              id="event-rr">
              Set Rigor rank
            </button>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="event-type" class="font-12 font-medium">Select event type</label>
        <select class="form-control font-12" id="event-type" name="event_type">
          <option selected disabled>Select event type</option>
          <option>Socratic Discussion</option>
          <option>Debate</option>
          <option>Improv Session</option>
        </select>
      </div>

      <div class="form-group">
          <label for="event-type" class="font-12 font-medium">Select event category</label>
          <select class="form-control font-12" id="events-category">
              <option selected disabled>Select category</option>
          </select>
      </div> 

      <div class="form-group">
        <label for="event-description" class="font-12 primary-text font-medium">Describe your event:</label>
        <textarea class="form-control font-12 primary-border" id="event-description" rows="5" name="description"></textarea>
      </div>

      <div class="form-group">
        <label for="learning-value" class="font-12 primary-text font-medium">What are the learning values we can attain from this event:</label>
        <textarea class="form-control font-12 primary-border" id="learning-value" rows="5" name="description_1"></textarea>
      </div>

      <div class="form-group">
        <label for="growth-value" class="font-12 primary-text font-medium">What are the growth values we can attain from this event:</label>
        <textarea class="form-control font-12 primary-border" id="growth-value" rows="5" name="description_2"></textarea>
      </div>

      <div class="hold d-flex">
        <p class="pb-4"></p>
        <button type="submit"
          class="button-brand d-flex align-items-center justify-content-around button-lg-p font-12 position-self-end">
          <i class="fas fa-solid fa-arrow-up-from-bracket"></i>
          <p class="mb-0 pl-2">Host</p>
        </button>
      </div>
    </form>
  </div>
</div>