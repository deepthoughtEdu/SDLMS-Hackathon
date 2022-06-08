'use strict';
define('forum/sdlms/curriculum/curriculum', ['api','sdlms/session'], function (api) {
	var Curriculum = {};
	Curriculum.curriculumId = ajaxify.data.curriculum.curriculumId;
	Curriculum.sessions = ajaxify.data.curriculum.sessions;
	Curriculum.Curriculum= ajaxify.data.curriculum
	Curriculum.init = function () {
		Curriculum.teachingStyles = (data) => {
			let optionList = '';
			data.forEach(function (item) {
				optionList += `<option id="" data-teachingstyle-id="${item.TeachingStyleId}" value="${item.name}">${item.name}</option>`
			})
			return optionList;
		}

		let templete={
			form: (data) => {
				let teaching_styles = data.teaching_styles || [];
				console.log(teaching_styles)
				let html=`<form id="curriculum-form" data-id=${data.curriculumId} class="curriculum-form sdlms-section-body" action="">
				<div class="form-group mb-3 col-12">
					<label for="">curriculum name</label>
					<input required value="${data.name || ''}" name="name" type="text" class="form-control">
				</div>
				<div class="form-group mb-3 col-12">
					<label for="">Teaser/Description</label>
					<textarea name="teaser" style="text-align: left;" id="" class="form-control" rows="5" required>${data.teaser || ''}</textarea>
				</div>
				<div class="form-group mb-3 col-12">
					<label for=""> Teaching Style </label>
					<select name="teaching_style" id="select-teachingstyle" class="form-control" data-name="teaching-style" required>
						<option value="">SELECT</option>
						${Curriculum.teachingStyles(teaching_styles)}
					</select>
				</div>
				<div class="session-area"></div>
				<div class="add-sessions d-flex ml-3">
				  <button action="add-session" class="sdlms-button btn button-primary">Add session</button>
				</div>
				

				<div class="d-flex justify-content-end">
					<button id="delete-curriculum" btn-delete="${data.curriculumId}" class="sdlms-button btn mr-2 button-primary">Delete curriculum</button>
					<button  class="sdlms-button btn button-primary" id="savecurriculum">Save</button>
				</div>
	  </form>`
				return html
			},
		}
		
		let data = ajaxify.data.curriculum
		let { teaching_styles } = ajaxify.data;
		$('.Curriculum-area').html(templete.form({ ...data, teaching_styles}))
		if (data.curriculum_type) {
			$('#curriculum-form').find(`[value="${data.curriculum_type}"]`).attr('selected', true);
		 }
		 if (data.teaching_style) {
			$('#curriculum-form').find(`[value="${data.teaching_style}"]`).attr('selected', true);
		 }
		let sessions=[]
		
		if (Curriculum.sessions.length) { 
            $('.session-area').append('<h4>Sessions</h4>');
            Curriculum.sessions.forEach(session => {
            	 new Session({
                    target: '.session-area',
                    append: true,
                    Curriculum: Curriculum.Curriculum,
					teaching_styles,
                    with: session,
                    action: 'editor',
					strictMode:true
                })
				

            })
        }
		$('.session-area').append('<h4>New Sessions</h4>');
			$('[action="add-session"]').on('click', function (e) {
				e.preventDefault() 
				let TeachingStyleId = $('#select-teachingstyle').val();
				new Session({
					target: '.session-area',
					append: true,
					teaching_styles,
					strictMode:true,
					TeachingStyleId
				})
				
			})
			$('#savecurriculum').on('click',function(e){
				e.preventDefault() 
				let sessions = []	
				 let form = $('.session-area').find('form');
				 for (let i = 0; i < form.length; i++) {
				 	let form_data = form[i];
					let data={}
					 data.sessionresource=[]
						data.id=$(form_data).index() + 1
						data.topic=$(form_data).find('[name="topic"]').val()
						data.teaser=$(form_data).find('[name="teaser"]').val()
						data.schedule=$(form_data).find('[name="schedule"]').val()
						data.session_type=$(form_data).find('[name="session_type"]').val()
						data.teaching_style=$(form_data).find('[name="teaching_style"]').val()
						data.TeachingStyleId = $(form_data).find(`[value="${data.teaching_style}"]`).data('teaching-style-id')
						data.sessionresource.push()
						// data.members = $that.cohort.members;
						// data.schedule = (new Date(data.schedule)).getTime();
						// data.session_type = data.session_type.toLowerCase();
						// data.mode = data.session_type.toLowerCase();
						// data.classCategoryId = $that.batch.parentCid;
						// data.batchCategoryId = $that.batch.cid;
						// data.ended_on = moment(data.schedule).add(1, 'hour').valueOf();
						$(form_data).find('#showresources #sessionlistitem').each((i,ele)=>{
							let sessionresource={}
							sessionresource.sessionResourceType=$(ele).find('#SessionResourceType').text()
							sessionresource.sessionResourceLink=$(ele).find('#SessionResourceLink').text()
							data.sessionresource.push(sessionresource)
						})
					 sessions.push(data)
				 	//  data = $(form_data).serializeArray().reduce(function (obj, item) {
				 	// 	obj[item.name] = item.value;
				 	// 	return obj;
				 	//   }, {});
					//    let sessionresource={}
					// 		sessionresource.sessionResourceType=$(this).find('#SessionResourceType').text()
					// 		sessionresource.SessionResourceLink=$(this).find('#SessionResourceLink').text()
					// 		_session.sessionresource.push(sessionresource)
				 	//   sessions.push(data)
				 }
				let data ={
					name: $('[name="name"]').val()?$('[name="name"]').val():notify('field is empty') ,
					teaser: $('[name="teaser"]').val()?$('[name="teaser"]').val():notify('field is empty'),
					teaching_style: $('#select-teachingstyle').val(),
					TeachingStyleId: $('#select-teachingstyle').find('[selected="selected"]').data('teachingstyle-id'),
					sessions : sessions
				} 
				console.log(data)
				    api.put(`/sdlms/curriculums/${Curriculum.curriculumId}`, data).then(function (res) {
				  	console.log(res);
				  	 location.href=`/curriculums/`
				  });
				console.log(data)
			})
			$('#delete-curriculum').on("click", function (e) {
				e.preventDefault();
				let resp = prompt('Are you sure to delete this curriculum? Type "YES" to confirm');
				if (resp == 'YES') {
					api.del(`/sdlms/curriculums/${Curriculum.curriculumId}`).then(function (res) {
						location.href=`/curriculums`
					});
				}
			});
	}
	return Curriculum;
})