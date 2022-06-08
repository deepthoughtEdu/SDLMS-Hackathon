<div class="sdlms-section">
    <div class="container sdlms-table" component="batch">
        <div class="row">
            <div class="col-md-12 d-flex aling-items-center justify-content-between my-3">
                <h4 class="mt-4">Batch: {batch.name}</h4>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12 px-0 pb-3">
                <div class="batch-area">
                    <form id="batch-form" class="batch-form sdlms-section-body" action="">
                        <div class="form-group mb-3 col-12">
                            <label for="">Batch name</label>
                            <input required value="{batch.name}" name="name" type="text" class="form-control">
                        </div>

                        <div class="form-group mb-3 col-12">
                            <label for=""> Select cohort </label>
                            <select id="select-cohort" class="form-control" data-name="cohort">
                                <option value="">SELECT</option>
                                <!-- BEGIN cohorts -->
                                    <option id="{cohorts.slug}" value="{cohorts.name}">{cohorts.name}</option>
                                <!-- END cohorts -->
                            </select>
                        </div>
                        
                        <div class="form-group mb-3 col-12">
                            <label for="">Teaser/Description</label>
                            <textarea name="description" style="text-align: left;" id="" class="form-control" rows="2">{batch.description}</textarea>
                        </div>

                        <div class="form-group mb-3 col-12">
                            <label for=""> Batch type </label>
                            <select name="batch_type" id="select-batch-type" class="form-control" data-name="batch-type">
                                <option value="">SELECT</option>
                                <option id="public" value="Public">Public</option>
                                <option id="restricted" value="Restricted">Private</option>
                            </select>
                        </div>

                        <div class="form-group mb-3 col-12">
                            <label for=""> Teaching Style </label>
                            <select name="teaching_style" id="select-teachingstyle" class="form-control" data-name="teaching-style">
                                <option value="">SELECT</option>
                                <!-- BEGIN teaching_styles -->
                                    <option id="" data-teachingstyle-id="{teaching_styles.TeachingStyleId}" value="{teaching_styles.name}">{teaching_styles.name}</option>
                                <!-- END teaching_styles -->
                            </select>
                        </div>
                    
                        <div class="d-flex justify-content-end">
                            <button id="update-batch-btn" type="submit" class="sdlms-button btn mr-3 button-primary">Save</button>
                        </div>
                    </form>

                    <hr>

                    <div class="sessions-area mt-4"></div>
                    <div class="add-sessions d-flex ml-3">
                        <button action="add-session" class="sdlms-button btn button-primary">Add session</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
