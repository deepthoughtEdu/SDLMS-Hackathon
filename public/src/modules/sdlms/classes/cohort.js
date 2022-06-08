
/**
 * @author imshawan
 * @var {class} Cohort
 * @description Contains the @methods or @function - to run the Cohort related operations
 * @function cohort.init
 * @function cohort.unique
 * @function cohort.log
 * @function cohort.builder
 * @function cohort.create
 */

 class Cohort {
	constructor(data = {}) {
		this.isEditor = data.isEditor || false;
		this.slug = data.slug;
        this.name = data.name;
		this.data = data;
		this.assetId = data.assetId;
		this.data.with = data.with || {};

		var b = document.documentElement;
		b.setAttribute("data-useragent", navigator.userAgent);
		b.setAttribute("data-platform", navigator.platform);
		this.data.queue = 0;
		this.builder(this.data.target);
	}

	/**
	 * @author Deepansu
	 * @date 12/2021
	 * @name unique
	 * @type {function} 
	 * @description to get unique id 
	 * @param {String} prefix optional identifier for generated unique id {prefix + id}
	 */

	unique(prefix = "") {
		var dt = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
		});
		return prefix + uuid;
	}
	/**
	 * @author imshawan
	 * @date 12/2021
	 * @name log
	 * @type {function} 
	 * @description To Log 
	 * @param {*} log 
	 */

	log(log) {
		!this.data.log || console.log(log);
	}
	/**
	 * @author imshawan
	 * @date 12/2021
	 * @name builder
	 * @type {function} 
	 * @description Attach an  sdlms-cohort-builder element
	 * @param {HTML ELEMENT} HTML element to render builder default body 
	 */

	builder(target = "body") {

		this.id = this.unique("sdlms-cohort-");
		let $that = this;
		let $target = $(target);
		if (!$target.length) {

			$that.log("No HTML element found For Builder Given ==>" + target);
			throw new Error(`No HTML element found while searching ${target}`);
		}
		$target.empty();
		$target.append(
			$("<sdlms-cohort-builder>")
			.attr({
				id: $that.id,
				class: $that.data.noAction ? "sdlms-readonly" : ''
			})
			.append(`<div class="sdlms-asset-owner" style="display:${$that.data.name || "none"} " name="${$that.data.name}" ></div>`)
			.append(
				$("<form>").attr({
					id: "form-" + $that.id,
					novalidate: true,
					class: 'sdlms-cohort-container border m-3 create p-3 sdlms-cohort-container needs-validation ' + ($that.data.action == 'reader' ? 'readonly' : 'create'),
				})
			)
		);
		let $builder = $(`#form-${$that.id}`);
		$that.$builder = $builder;
		$that[$that.data.action == 'reader' ? 'reader' : 'create']($that.data.with);

	}
	cohort() {
		let $that = this;
		const csvFIleURL = 'https://sdlms.deepthought.education/assets/uploads/files/userlist_template.csv';
		let components = {
			form: function (data) {
				return `<div class="form-group mb-3 col-12">
                <label for="">Cohort name</label>
                <input required value="${data.name || ''}"  name="name" type="text" class="form-control">
            </div>
            
            <div class="form-group mb-3 col-12">
                <label for="">Teaser/Description</label>
                <textarea name="description" style="text-align: left;" id="" class="form-control" rows="5">${data.description || ''}</textarea>
            </div>
        
            <div class="d-flex justify-content-end"> <button type="submit" class="sdlms-button btn button-primary">Create</button></div>
        `
			},

			extendedForm: function (data = {}) {
				return `<div class="form-group mb-3 col-12">
							<label for="">Cohort name</label>
							<input required value="${data.name || ''}"  name="name" type="text" class="form-control">
						</div>
						
						<div class="form-group mb-3 col-12">
							<label for="">Teaser/Description</label>
							<textarea name="description" style="text-align: left;" id="" class="form-control" rows="5">${data.description || ''}</textarea>
						</div>

						<div class="col-md-12 d-flex aling-items-center justify-content-between my-3">
							<h4>Memberlist</h4>
						</div>
						
						<div class="members-area form-group mb-3 col-12 d-flex classes-search-user flex-wrap py-3"></div>

						${$that.isEditor ? components.editorControlTemplate() : ''}
						`
			},
			modal: function () { 
				return `
				<!-- Modal -->
				<div class="modal modal_outer right_modal fade" id="addUsers" tabindex="-1" role="dialog" aria-labelledby="addUsersLabel" aria-hidden="true">
				  <div class="modal-dialog" role="document">
					<div class="modal-content">
					  <div class="modal-header">
						<h5 class="modal-title" id="addUsersLabel">Manage members</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
						</button>
					  </div>
					  <div class="modal-body">
						<div class="col-md-12">
							<div class="">
								<label for="">Search</label>
								<input name="search" id="" placeholder="Search Users" style="border-bottom-left-radius:0;border-bottom-right-radius:0;" type="text" class="form-control border-bottom-0 search-users"></input>
							</div>
			
							<div class="form-group mb-3 col-12 users-area d-flex classes-search-user flex-wrap py-3">
							</div>
						</div>
					  </div>
					  <div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						<button id="add-members" type="button" class="sdlms-button btn button-primary">Add members</button>
					  </div>
					</div>
				  </div>
				</div>
				`
			},
			editorControlTemplate: () => {
				return `
				<div class="col-12 col-md-6 d-flex">
					<button type="button" class="sdlms-button btn button-primary ml-3 mb-4" data-toggle="modal" data-target="#addUsers">
						<i class="fa fa-plus" aria-hidden="true"></i> &nbsp;&nbsp;Add
					</button>
		
					<button type="button" class="sdlms-button remove-members btn button-primary ml-3 mb-4">
						<i class="fa fa-minus" aria-hidden="true"></i> &nbsp;&nbsp;Remove
					</button>
				</div>
				
				<div class="col-md-12 d-flex aling-items-center justify-content-between my-3">
					<h4>Add multiple members</h4>
				</div>

				<div class="col-12 d-flex mb-2">
					Upload a CSV file to add members to this cohort. &nbsp; <a href="${csvFIleURL}"> Download CSV template <a>
				</div>

				<div class="col-12 col-md-6 d-flex form-group">
					<div class="input-group">
						<div class="custom-file">
							<input type="file" class="custom-file-input form-control" name="csv_file" id="choose-csv-file"
							aria-describedby="inputGroupCSV">
							<label class="custom-file-label" for="choose-csv-file">Choose file</label>
						</div>
					</div>
				</div>

				<hr>
				<div class="d-flex justify-content-end">
					<button id="delete-cohort" class="sdlms-button btn mr-2 button-primary">Delete cohort</button>
					<button type="submit" class="sdlms-button btn button-primary">Save</button>
				</div>
				`
			}
		}
		return components;
	}

	create(data = null) {

		let $target = this.$builder,
			components = this.cohort(),
			$that = this;
		$that.categories = [];
		$target.append(components.form(data));


		function save(noti = true) {
			var payload = $target.serializeArray().reduce(function (obj, item) {
				obj[item.name] = item.value;
				return obj;
			}, {});

			require(['api'], function (api) {
				if (!$that.data.slug) {
					api['post'](`/sdlms/cohorts`, payload)
					.then((resp) => {
						location.href = `/cohorts/${resp.name}`;
					})
					.catch((err) => notify(err.message, 'error'));
					if (noti) {
						notify('Created Successfully', 'success');
					}
				} else {
					notify('Unable to create', 'error');
				}
			})

		}

		$target.on("submit", function (e, data = {}) {
			if ($that.data.noAction) {
				alert('Sorry! You can not modify.');
				return;
			}
			e.preventDefault();
			if ($(this).find(':invalid').length) {
				return notify('Fields with Errors are not allowed', 'error');
			}
			save();
		});

	}

	reader(data) {
		let $that = this;
		let $target = this.$builder;
		let cohort = $that.data.with;
        let components = this.cohort();
		var members = $that.data.with.members;
		var memberUids = members;
		if (memberUids) {
			memberUids = memberUids.map(function (item) {
				return item.uid;
			});
		}

		$($target).append(components.extendedForm(cohort));
		$($target).append(components.modal());

		$('#choose-csv-file').on('change',function(){
			//get the file name
			var fileName = $(this).val();
			//replace the "Choose a file" label
			$(this).next('.custom-file-label').html(fileName.replace(/^.*[\\\/]/, ''));
		})

		if (!members.length) {
			$('.remove-members').attr('disabled', true);
		}

		// Render current members
		new Users ({
			target: '.members-area',
			with: members,
			action: 'reader'
		})

		// For addition of members
		let users = new Users ({
			target: '.users-area',
			search: '.search-users',
		})

		$('.remove-members').on('click', function (e) {
			e.preventDefault();
			let values = [];
			$("[name='list-members']:checked").each(function () {
				if ($(this).val() != '') values.push(Number($(this).val()));
			});
			if (!values.length) {
				return notify('Please select the members to remove', 'error');
			}
			let payload = {
				remove_uids: values
			}
			if (confirm('Are you sure to remove selected members?')) {
				notify('Please wait..', 'success');
				require(['api'], function (api) {
					api['put'](`/sdlms/cohorts/${$that.name}/leave`, payload)
					.then(() => {
						location.reload();
					})
					.catch((err) => notify(err.message, 'error'));
				})
			}
		})

		$($target).on("click", '[type="submit"]', function (e) {
			e.preventDefault();
			if ($(this).find(':invalid').length) {
				return notify('Fields with Errors are not allowed', 'error');
			}
			save();
		});

		$($target).on("click", '#delete-cohort', function (e) {
			e.preventDefault();
			let resp = prompt('Are you sure to delete this cohort? Type "YES" to confirm');
			if (resp == 'YES') {
				notify('Please wait..', 'success');
				require(['api'], function (api) {
					api['del'](`/sdlms/cohorts/${$that.name}`)
					.then(() => {
						location.href = '/cohorts';
					})
					.catch((err) => notify(err.message, 'error'));
				})
			}
		});

		$($target).on("click", '#add-members', function (e) {
			$('.members-area').empty();
			let uids = users.getValues();
			let usrs = users.getUserData();

			memberUids = [...new Set([...memberUids, ...uids])];
			members = app.removeDuplicates([...members, ...usrs], 'uid');
			if (members.length) {
				$('.remove-members').attr('disabled', false);
			}
			new Users ({
				target: '.members-area',
				with: members,
				action: 'reader'
			})
			$('.modal').modal('hide');
		})
		
		function save(noti = true) {
			var payload = new FormData();
			$target.serializeArray().reduce(function (obj, item) {
				return payload.append([item.name], item.value);
			}, {});
			if (memberUids.length) { 
				payload.append('members', memberUids);
			}
			if ($('#choose-csv-file').val()) {
				var blob = document.getElementById('choose-csv-file').files[0];
				payload.append('files[csv_file]', blob);
			}
			if ($that.slug && $that.name) {
				payload.append('prev_name', $that.name);
				doAjax({
					type: 'PUT',
					url: `/sdlms/cohorts/${$that.slug}`,
					data: payload,
					cache: false,
					contentType: false,
					processData: false,
				}).then(function (res) {
					location.reload();
				}).catch((err) => {
					if (err.responseJSON && err.responseJSON.status && err.responseJSON.status.message) {
						notify(err.responseJSON.status.message, 'error');
					} else {
					notify(err.message, 'error')
					}
				})
				if (noti) {
					notify('Please wait...', 'success');
				}
				// require(['api'], function (api) {
				// 	payload.prev_name = $that.name;
				// 	// console.log(payload.members)
				// 		api['put'](`/sdlms/cohorts/${$that.slug}`, payload)
				// 		.then(() => location.reload())
				// 		.catch((err) => notify(err.message, 'error'));
				// 		if (noti) {
				// 			notify('Updated Successfully', 'success');
				// 		}
				// })
			} else {
				notify('Unable to modify', 'error');
			}

		}
	}
}