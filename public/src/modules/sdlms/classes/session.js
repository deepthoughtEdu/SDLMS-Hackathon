/**
 * @author imshawan
 * @date 21-04-2022
 * @var {class} Session
 * @description Contains the @methods or @function - to run the Session creator
 */
class Session {
	constructor(data) {
		this.data = data;
		this.tid = data.tid;
		this.data.with = data.with || {};
		this.batch = data.batch || {};
		this.cohort = data.cohort || {};
		this.sessions = data.sessions || [];
		this.strictMode = data.strictMode || false;
		this.teaching_styles = data.teaching_styles || [];
		this.TeachingStyleId = data.TeachingStyleId;
		var b = document.documentElement;
		b.setAttribute("data-useragent", navigator.userAgent);
		b.setAttribute("data-platform", navigator.platform);
		this.data.queue = 0;
		this.builder(this.data.target);
	}

	unique(prefix = "") {
		var dt = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
		});
		return prefix + uuid;
	}

	log(log) {
		!this.data.log || console.log(log);
	}

	renderTeachingStyles () {
		let teaching_styles = this.teaching_styles;
		let optionList = '';
		teaching_styles.forEach(function (item) {
			optionList += `<option id="" data-teaching-style-id="${item.TeachingStyleId}" value="${item.name}">${item.name}</option>`
		})
		return optionList;
	}

	builder(target = "body") {

		this.id = this.unique("sdlms-session-");
		let $that = this;
		let $target = $(target);
		if (!$target.length) {
			$that.log("No HTML element found For Builder Given ==>" + target);
			throw new Error(`No HTML element found while searching ${target}`);
		}
		if (!$that.data.append) {
			$target.empty();
		}
		$target.append(
			$("<sdlms-session-builder>")
				.attr({
					id: $that.id,
					class: $that.data.noAction ? "sdlms-readonly" : ''
				})
				.append(`<div class="sdlms-asset-owner" style="display:${$that.data.name || "none"} " name="${$that.data.name}" ></div>`)
				.append($(`<form data-session-tid="${$that.tid || null}">`).attr({
					id: "form-" + $that.id,
					//class: 'sdlms-session-container sdlms-floating-label-input sdlms-section-body border m-3 create p-3 sdlms-session-container needs-validation ' + ($that.data.action == 'editor' ? 'readonly' : 'create'),
					class: 'sdlms-session-container sdlms-floating-label-input sdlms-section-body border m-3 create p-3 sdlms-session-container needs-validation position-relative',
				})
				).append('<hr>')
		);
		let $builder = $(`#form-${$that.id}`);
		$that.$builder = $builder;
		$that[$that.data.action == 'editor' ? 'editor' : 'create']($that.data.with);
	}

	session() {
		let $that = this;
		let components = {

			reource: function (data = {}) {
				let resource = `
				<li class="list-group-item col-md-12 d-flex align-items-center justify-content-between" id="sessionlistitem">
					<span class="border border-secondary p-2" id="SessionResourceType"  data-SessionResourceType="${data.sessionResourceType}">${data.sessionResourceType}</span>
					<a target="_blank" href="${data.sessionResourceLink}" class="w-75 mx-3 text-ellipse-2" id="SessionResourceLink" data-SessionResourceLink="${data.sessionResourceLink}">${data.sessionResourceLink}</a>
				<div class="mr-4 cursor-pointer" id="delresource"><i class="fa fa-solid fa-trash" aria-hidden="true"></i></div>
			  </li>`
				return resource
			},
			form: function (data) {
				let link = '';
				if (data.sharer && data.sharer.link) {
					link = `${window.location.origin}${data.sharer.link}`;
				}
				return `
				<div btn-delete="${$that.id}" data-tid=${data.tid} style="position: absolute;right: 0; cursor: pointer; z-index: 5; height: 40px; width: 40px;" class="mr-4"><i class="fa fa-solid fa-trash" aria-hidden="true"></i></div>
				<div class="row mt-2">
					<div class="form-group mb-3 col-12 col-md-6">
						<label for="">Topic</label>
						<input required value="${data.topic || ''}" name="topic" type="text" class="form-control">
					</div>

					<div class="form-group mb-3 col-12 col-md-6">
						<label for="">Teaser</label>
						<input required value="${data.teaser || ''}" name="teaser" type="text" class="form-control">
					</div>

					<div class="form-group mb-3 col-12 col-md-6">
						<label for="">Schedule</label>
						<input id="schedule-${$that.id}" required value="${data.schedule ? moment(data.schedule).format("YYYY-MM-DDTkk:mm") : ''}" name="schedule" type="datetime-local" class="form-control">
					</div>

					<div class="form-group mb-3 col-12 col-md-6">
						<label for=""> Session type </label>
						<select ${data.session_type ? 'disabled' : ''} name="session_type" id="select-session-type" class="form-control" data-name="session-type">
							<option value="">SELECT</option>
							<option id="public" value="Public">Public</option>
							<option id="restricted" value="Restricted">Private</option>
						</select>
					</div>

					<div class="form-group mb-3 col-12 col-md-6">
						<label for=""> Teaching Style </label>
						<select name="teaching_style" id="select-teaching-style" class="form-control" data-name="teaching-style">
							<option value="">SELECT</option>
							${$that.renderTeachingStyles()}
						</select>
					</div>

					<div class="form-group mb-3 col-12 col-md-6">
						<div>
							<div>
								<label for="">Sharer link</label>
								<div class="d-flex">
									<input ${link ? '' : 'disabled'} value="${link || ''}" name="link" type="text" class="form-control">
									<button ${link ? '' : 'disabled'} link-btn-id="${$that.id}" class="sdlms-button btn ml-2 button-primary d-flex"><i class="fa fa-solid fa-copy m-auto"></i>&nbsp;&nbsp;Copy</button>
								</div>
							</div>
						</div>
					</div>

					<div class="form-group mb-3 col-12 col-md-12" sessionResrouce>
					<span class="my-2">Add Resource</span>
					<div class="form-group my-2 mb-3 col-12 col-md-12 px-0 d-flex align-items-center justify-content-between">
						
					<div class="d-flex col-md-10 pl-0">
					  	<select name="sessionresources" id="select-session-resource" class="form-control col-md-3" data-name="session-resource">
							<option value="">SELECT</option>
							<option id="" value="threadbuilder">Threadbuilder</option>
							<option id="" value="eaglebuilder">Eaglebuilder</option>
							<option id="" value="spreadsheet">Spreadsheet</option>
					  	</select>
					  	<input value="" name="topic" type="text" class="form-control col-md-10" id="resourceLink">
						</div>
						<button style="width: 68px;" id="addSessionResource" class="sdlms-button btn button-primary">ADD</button>
				  		</div>
				
						</div>
					</div>

				<ul class="list-group m-1" id="showresources">
					<span class="mb-2">Session Resources</span>
			  	</ul>

				<div class="d-flex justify-content-end">
					<button btn-id="${$that.id}" style="width: 68px;" id="save-session-btn" type="submit" class="sdlms-button btn button-primary">Save</button>
				</div>
                `
			}
		}
		return components;
	}

	create(data = null) {

		let $target = this.$builder,
			components = this.session(),
			$that = this;
		let strictMode = this.strictMode
		let sessionresource = []

		$target.append(components.form(data));
		if ($that.TeachingStyleId) {
			$target.find(`[value="${$that.TeachingStyleId}"]`).attr('selected', true);
		}
		$(`[btn-id="${$that.id}"]`).attr("disabled", "disabled").css({ display: 'none' });

		$target.dirrty();
		$target.on("dirty", function () {
			if (!$that.strictMode) {
				$target.find(`[btn-id="${$that.id}"]`).removeAttr("disabled").css({ display: 'block' });
			}
		})
		$target.on("clean", function () {
			$target.find(`[btn-id="${$that.id}"]`).attr("disabled", "disabled").css({ display: 'none' });
		});

		$target.find(`[btn-delete="${$that.id}"]`).on('click', function (e) {
			$(`#${$that.id}`).remove();
			notify('Removed successfully', 'success');
		})
		$target.on('click', '#addSessionResource',function (e) {
			e.preventDefault()
			let SessionResourceData = {}
			SessionResourceData.sessionResourceType = $(this).parent().find('#select-session-resource').val()
			SessionResourceData.sessionResourceLink = $(this).parent().find('#resourceLink').val()
			$(this).parents($that).next('#showresources').append(components.reource(SessionResourceData))
			sessionresource.push(SessionResourceData)
			
		})
		$target.on('click', '#delresource', function (e) {
			e.preventDefault()
			$(this).parents('li').remove()
			let link = $(this).parents('li').find('[resourcelink]').text()
			sessionresource.splice(sessionresource.findIndex(object => {
				return object.SessionResourceLink === link;
			}), 1);
		})

		$target.on('submit', function (e) {
			e.preventDefault();
			var { session } = $that.getJSON()
			if (strictMode == false) {
				notify('Please wait...', 'info');
				require(['api'], function (api) {
					api.post('/sdlms/monitor', session).then((response) => {
						if (response.tid) notify('Session created successfully', 'success');
						location.reload();
					}).catch((e) => {
						notify(e.message, 'error');
					});
				})
			} else {
				console.log(session)
			}

		})

		if ($that.batch.batchType) {
			$target.find(`[id="${$that.batch.batchType}"]`).attr('selected', true);
		}
	}

	editor(data = {}) {
		
		let $that = this;
		let $target = this.$builder;
		let components = this.session();
		let sessionresource = []
		let strictMode = this.strictMode
		$target.append(components.form(data));
		
		if(data.sessionresource){
			data.sessionresource.map((element,index)=>{
				$target.find('#showresources').append(components.reource(element));
			})
			
		}
		
		$target.find(`[btn-id="${$that.id}"]`).attr("disabled", "disabled").css({ display: 'none' });
		if (data.session_type) {
			$target.find(`[id="${data.session_type}"]`).attr('selected', true);
		}
		if (data.teaching_style) {
			$target.find(`[value="${data.teaching_style}"]`).attr('selected', true);
		}
		$target.on('click', `[link-btn-id="${$that.id}"]`, function (e) {
			e.preventDefault();
			if (data.sharer && data.sharer.link) {
				app.copyText(`${window.location.origin}${data.sharer.link}`);
			}
		})

		$target.dirrty();
		$target.on("dirty", function () {
			if (!$that.strictMode) {
				$target.find(`[btn-id="${$that.id}"]`).removeAttr("disabled").css({ display: 'block' });
			}
		})
		$target.on("clean", function () {
			console.log(this, 'is Clean');
			$target.find(`[btn-id="${$that.id}"]`).attr("disabled", "disabled").css({ display: 'none' });
		});

		$target.find(`[btn-delete="${$that.id}"]`).on('click', function (e) {
			let tid = $(this).data('tid');
			let resp = prompt('Are you sure to delete this session? Type "YES" to confirm');
			if (resp == 'YES' && tid && tid > 0) {
				notify('Please wait..', 'success');
				require(['api'], function (api) {
					api['del'](`/sdlms/monitor/${tid}`)
						.then(() => {
							location.reload();
						})
						.catch((err) => notify(err.message, 'error'));
				})
			}
		})
		$target.on('click','#addSessionResource' ,function (e) {
			e.preventDefault()
			let SessionResourceData = {}
			SessionResourceData.sessionResourceType = $(this).parent().find('#select-session-resource').val()
			SessionResourceData.sessionResourceLink = $(this).parent().find('#resourceLink').val()
			$(this).parents($target).next('#showresources').append(components.reource(SessionResourceData))
			sessionresource.push(SessionResourceData)
		})
		$target.on('click', '#delresource', function (e) {
			e.preventDefault()
			$(this).parents('li').remove()
			let link = $(this).parents('li').find('[resourcelink]').text()
			sessionresource.splice(sessionresource.findIndex(object => {
				return object.SessionResourceLink === link;
			}), 1);
		})
		$target.on('submit', function (e) {
			e.preventDefault();
			//let tid = $(this).
			var { session } = $that.getJSON();
			if (strictMode == false) {
				require(['api'], function (api) {
					if ($that.data.with.tid) {
						session.tid = $that.data.with.tid;
						notify('Saving...', 'info');
						api.put('/sdlms/monitor', session).then(() => {
							location.reload();
						}).catch((error) => {
							notify(error.message, 'error');
						})

					} else {
						return notify('tid was not found for the session', 'error');
					}
				})
			} else {
				console.log(session)
			}
		})
	}
	getJSON() {
		let $that = this;
		let $target = this.$builder;
		let components = this.session();
		let strictMode = this.strictMode
		let _session={}
		$target.each(function(){
			_session.sessionresource=[]
			_session.id=$(this).index() + 1
			_session.topic=$(this).find('[name="topic"]').val()
			_session.teaser=$(this).find('[name="teaser"]').val()
			_session.schedule=$(this).find('[name="schedule"]').val()
			_session.session_type=$(this).find('[name="session_type"]').val()
			_session.teaching_style=$(this).find('[name="teaching_style"]').val()
			_session.TeachingStyleId=$(this).find(`[value="${_session.teaching_style}"]`).data('teaching-style-id')
			_session.sessionresource.push()
			_session.members = $that.cohort.members;
			_session.schedule = (new Date(_session.schedule)).getTime();
			_session.session_type = _session.session_type.toLowerCase();
			_session.mode = _session.session_type.toLowerCase();
			_session.classCategoryId = $that.batch.parentCid;
			_session.batchCategoryId = $that.batch.cid;
			_session.ended_on = moment(_session.schedule).add(1, 'hour').valueOf();
			$(this).find('#showresources #sessionlistitem').each((e,data)=>{
				let _sessionresource={}
				_sessionresource.sessionResourceType=$(data).find('#SessionResourceType').text()
				_sessionresource.sessionResourceLink=$(data).find('#SessionResourceLink').text()
				_session.sessionresource.push(_sessionresource)
			})
		})
		let payload = {
			session: _session
		}
		return payload;
	}
}