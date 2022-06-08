
'use strict';


define('forum/sdlms/curriculum/curriculums', ['api','sdlms/session'], function (api) {
	var Curriculums = {};
	Curriculums.Curriculums = ajaxify.data.curriculums

	Curriculums.teachingStyles = (data) => {
		let optionList = '';
		data.forEach(function (item) {
			optionList += `<option id="" data-teachingstyle-id="${item.TeachingStyleId}" value="${item.name}">${item.name}</option>`
		})
		return optionList;
	}
	Curriculums.init = function () {
		let { teaching_styles } = ajaxify.data;
		console.log('curriculums inited');
		Curriculums.initCurriculums(Curriculums.Curriculums)
		$('[component="Curriculum"]').find(".add-row").on('click', function () {
			let action = $(this).find(".Curriculum-action-text").data('action');
			if (action == 'back') {
			  $('[component="Curriculum"]').find(".my-Curriculum").text('Curriculum');
			  //render 
			  $('#curriculum-table').removeClass('change-class')
			  $('#new-curriculum').addClass('change-class')
			  $('.Curriculum-area').find('#form-curriculum').remove()
			  $('[selectCurriculum]').show() 
			  $(this).empty();
			  $(this).html(`<i class="fa fa-plus"></i>&nbsp;&nbsp;<span data-action="add" class="Curriculum-action-text">create</span>`)
			} else {
			  //render
			  $('.Curriculum-area').append(templete.form())
			  $(this).empty();
			  $('[selectCurriculum]').hide()
			  $('#curriculum-table').addClass('change-class')
			  $('#new-curriculum').removeClass('change-class')
			  $(this).html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="Curriculum-action-text">Go Back</span>`)
			}
		  });
		$('#curriculum-table').on('click', '[redirect="curriculum"]', function () {
			console.log("clicked")
			 let name = $(this).data('curriculum-slug');
			 console.log(name)
			 window.location.href = `/curriculums/${name}`;
		})
		
		const templete ={
			form: () => {
				let html=`
				<form id="form-curriculum"
		class=" sdlms-floating-label-input sdlms-section-body border m-3 create p-3 sdlms-session-container needs-validation ">
		<div class="col-md-12 px-0 pb-3 change-class" id="new-curriculum">
		  <div class="form-group mb-3 col-12">
			<label for="">Curriculum name</label>
			<input required value="" name="name" type="text" class="form-control">
		  </div>
		  <div class="form-group mb-3 col-12">
			<label for="">Teaser/Description</label>
			<textarea name="teaser" style="text-align: left;" id="" class="form-control" rows="5" required></textarea>
		  </div>

		  <div class="form-group mb-3 col-12">
			<label for=""> Teaching Style </label>
			<select name="teaching_style" id="select-teachingstyle" class="form-control" data-name="teaching-style" required>
				<option value="">SELECT</option>
				${Curriculums.teachingStyles(teaching_styles || [])}
			</select>
		  </div>
		  <div class="sessions-area"></div>
		  <div class="add-sessions d-flex ml-3">
			<button type="button" action="add-session" class="sdlms-button btn button-primary">Add session</button>
		  </div>
		  <div class="d-flex justify-content-end">
			<button type="submit" class="sdlms-button btn button-primary" id="create-curriculum">Create</button>
		  </div>
	  			</form>`
				  return html
			}
		}
		
		//trying..
		$('.Curriculum-area').on('click','[action="add-session"]',function(e){
			e.preventDefault()
			let TeachingStyleId = $('#select-teachingstyle').val();
			 new Session({
				target: '.sessions-area',
				append: true,
				strictMode:true,
				teaching_styles,
				TeachingStyleId
			})
		})
		$('.Curriculum-area').on('click','#create-curriculum',function (e) {	
			e.preventDefault()
			let TeachingStyleId = $('#select-teachingstyle').find('[selected="selected"]').data('teachingstyle-id');

				let sessions = []	
				 let form = $('.sessions-area').find('form');
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
						$(form_data).find('#sessionlistitem').each((e)=>{
							let sessionresource={}
							sessionresource.sessionResourceType=$(form_data).find('#SessionResourceType').text()
							sessionresource.sessionResourceLink=$(form_data).find('#SessionResourceLink').text()
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


			let data = $($(this).parents('form')).serializeArray().reduce(function (obj, item) {
				obj[item.name] = item.value;
				return obj;
			  }, {});
			  data.sessions = sessions
			  data.TeachingStyleId = TeachingStyleId;
			  console.log(data)
			  api.post(`/sdlms/curriculums`,data).then(function (res) {
				console.log(res);
				 location.href=`/curriculums`
			});
		})
	}
	 Curriculums.initCurriculums = (data) => {
	 	$("#curriculum-table").find('.sdlms-my-curriculum-body').empty();
		 data.map((ev, index) => {
			$("#curriculum-table").find('.sdlms-my-curriculum-body').append(`
			<tr redirect="curriculum" data-curriculum-slug="${ev.slug}">
		  <td>${index +1}</td>
		  <td data-Curriculum-name="${ev.name}">${ev.name}</td>
		</tr>
		`)
		})
		
	 }
	return Curriculums;
})