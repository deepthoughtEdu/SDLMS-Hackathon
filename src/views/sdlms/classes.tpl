<div class="sdlms-section">
	<div class="container sdlms-table" component="sessions">
		<div class="row">
			<div class="col-md-12 d-flex aling-items-center justify-content-between my-3">
				<h4>Manage Sessions</h4>
				<button data-toggle="modal" data-target="#CreateSession" class="btn button-primary sdlms-button add-row" disabled><i class="fa fa-plus"></i>&nbsp;&nbsp;Add Sessions</button>
			</div>
		</div>

		<div class="row">
			<div class="col-md-12 px-0 pb-3">
				<table class="table mb-0 session-table table-bordered" id="editableTable">
					<thead class="secondary-header sdlms-text-white-18px font-weight-medium">
						<tr class="sdlms-my-upcoming-session-table-header-row" style="cursor: pointer;">
							<th class="font-weight-500">S. NO</th>
							<th class="font-weight-500">Topic</th>
							<th class="font-weight-500">Category</th>
							<th class="font-weight-500">Schedule</th>
							<th class="font-weight-500">Members</th>
							<th class="font-weight-500">Edit</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
		</div>
	</div>
</div>
<div class="modal modal_outer right_modal fade" id="CreateSession" tabindex="-1" role="dialog" aria-labelledby="CreateSessionLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content border-0 py-0 rounded-0">
			<div class="modal-header">
				<h4 class="modal-title">Session</h4>
			</div>
			<div class="modal-body overflow-auto p-0 rounded-0 pb-5">
				<form action="" class="p-3" id="createSessionForm">
					<div class="row">
						<div class="col-md-12 mb-3">
							<label>Topic</label>
							<input type="text" name="topic" class="form-control" value="" required />
						</div>
						<div class="col-md-6 mb-3">
							<label>Class</label>
							<select name="classCategoryId" class="form-control" required>
								<option value="">-- Select Class --</option>
							</select>
						</div>
						<div class="col-md-6 mb-3 pl-0">
							<label>Batch</label>
							<select disabled readonly name="batchCategoryId" class="form-control" required>
								<option value="">-- Select Batch --</option>
							</select>
						</div>

						<div class="col-md-6 mb-3">
							<label>Teaser</label>
							<input type="text" name="teaser" class="form-control" value="" required />
						</div>
						<div class="col-md-6 mb-3 pl-0">
							<label>Schedule</label>
							<div class="input-group" schedule>
								<input type="text" name="schedule" readonly value="Instant" class="form-control" required />
								<div class="input-group-append cursor-pointer">
									<label class="input-group-text cursor-pointer" id="date-picker"><i class="fas fa-calendar-alt"></i></label>
								</div>
							</div>
						</div>
						<div class="col-md-12">
							<label class="d-flex justify-content-between">
								<span>Select Members </span>
								<div> <span class="pr-2 pb-1"> Type:</span> 
									<div class="form-check form-check-inline">
										<input class="form-check-input" checked type="radio" name="mode" id="mode_public" value="public">
										<label class="form-check-label" for="mode_public">Public</label>
									</div>
									<div class="form-check form-check-inline">
										<input class="form-check-input" type="radio" name="mode" id="mode_restricted" value="restricted">
										<label class="form-check-label" for="mode_restricted">Restricted</label>
									</div>
								</div>
							</label>
							<input id="search" name="search" placeholder="Search Users" class="form-control border-bottom-0" style="border-bottom-left-radius:0;border-bottom-right-radius:0" />
						</div>
						<div class="col-md-12 mb-3">
							<div id="users" class="d-flex classes-search-user flex-wrap py-3">

							</div>
						</div>
						<div class="col-md-12 mb-3">
							<label>Share Link will be Expire On</label>
							<input type="datetime-local" name="link_expiry" class="form-control" required />
					    </div>
						<div class="d-flex justify-content-end px-3 w-100 ">
							<button type="submit" class="btn button-primary sdlms-button">Save</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<div class="modal modal_outer right_modal fade" id="generateLink" tabindex="-1" role="dialog" aria-labelledby="egenerateLinkLabel">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Generate Shareable Link</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body overflow-auto p-0 rounded-0 pb-5">
				<form action="" class="p-3" id="generateLink">
					<input type="hidden" name="id">
					<div class="col-md-12 mb-3" expiry>
						<label>Expires On</label>
						<input type="datetime-local" name="expiry" class="form-control" required />
					</div>
					<div link></div>
					<div class="d-flex justify-content-end px-3 w-100 ">
						<button type="submit" class="btn button-primary sdlms-button">Save</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>