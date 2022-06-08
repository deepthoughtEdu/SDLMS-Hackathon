'use strict';

define('forum/sdlms/teaching_style/index', ['api'], function (api) {
  var teachingStyles = {};
  teachingStyles.teachingstyles = ajaxify.data.teachingStyles
  teachingStyles.init = function () {
    teachingStyles.initteachingStyles(teachingStyles.teachingstyles)
    console.log('Viewing all Teaching Styles page inited');
    $('[component="teachingStyle"]').find(".add-row").on('click', function () {
      let action = $(this).find(".teachingStyle-action-text").data('action');
      if (action == 'back') {
        $('[component="teachingStyle"]').find(".my-teachingStyle").text('teachingStyle');
        //render 
        $('#teachingStyle-table').removeClass('change-class')
        $('#new-teachingStyle').addClass('change-class')
        $('.teachingStyle-area').find('#form-teachingStyle').remove()
        $('[teachingStyle]').show()
        $(this).empty();
        $(this).html(`<i class="fa fa-plus"></i>&nbsp;&nbsp;<span data-action="add" class="teachingStyle-action-text">create</span>`)
      } else {
        //render
        $('.teachingStyle-area').append(templete.form())
        $(this).empty();
        $('[teachingStyle]').hide()
        $('#teachingStyle-table').addClass('change-class')
        $('#new-teachingStyle').removeClass('change-class')
        $(this).html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="teachingStyle-action-text">Go Back</span>`)
      }
    });
    $('#teachingStyle-table').on('click', '[redirect="teachingStyles"]', function () {
      console.log("clicked")
      let name = $(this).data('teachingstyles-slug');
      console.log(name)
      window.location.href = `/teachingStyles/${name}`;
    })

    const templete = {
      form: () => {
        let html = `
				<form id="form-teachingStyle"
                    class=" sdlms-floating-label-input sdlms-form-elements sdlms-section-body border m-3 create p-3 sdlms-session-container needs-validation ">
                    <div class="col-md-12 px-0 pb-3 " id="new-teachingStyle">
                      <div class="form-group mb-3 col-12">
                        <label for="">teachingStyle name</label>
                        <input required value="" name="name" type="text" class="form-control">
                      </div>
                      <div class="row mx-0 my-4">
                        <div class="form-group mb-3 col-4 id="intents">
                          <div class="sdlms-section d-block overflow-auto pb-0" style="min-height: calc(100% - 70px);">
                            <div
                              class="align-items-center cursor-pointer d-flex font-weight-500 justify-content-around justify-content-between sdlms-section-header sdlms-text-white-17px secondary-header">
                              <div class="align-items-center d-flex pt-1 justify-content-center">
                                <span class="active" data-fb-type="">Intents</span>
                              </div>
                            </div>
                            <div class="sdlms-section-body px-3 pt-2  position-relative">
                              <div class="form-group mt-3 col-12">
                                <textarea name="intent" style="text-align: left; border-radius:0;" id=""
                                  class="form-control intent" rows="1" placeholder="Intent1" required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="intent" style="text-align: left; border-radius:0;" id=""
                                  class="form-control intent" rows="1" placeholder="Intent2" required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="intent" style="text-align: left; border-radius:0;" id=""
                                  class="form-control intent" rows="1" placeholder="Intent3" required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="intent" style="text-align: left; border-radius:0;" id=""
                                  class="form-control intent" rows="1" placeholder="Intent4" required></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="form-group mb-3 col-4" id="processes">
                          <div class="sdlms-section d-block overflow-auto pb-0" style="min-height: calc(100% - 70px);">
                            <div
                              class="align-items-center cursor-pointer d-flex font-weight-500 justify-content-around justify-content-between sdlms-section-header sdlms-text-white-17px secondary-header">
                              <div class="align-items-center d-flex pt-1 justify-content-center">
                                <span class="active">processes</span>
                              </div>
                            </div>
                            <div class="sdlms-section-body px-3 pt-2  position-relative">
                              <div class="form-group mt-3 col-12">
                                <textarea name="process" style="text-align: left; border-radius:0;" id=""
                                  class="form-control process" rows="1" placeholder="process1" required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="process" style="text-align: left; border-radius:0;" id=""
                                  class="form-control process" rows="1" placeholder="process2" required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="process" style="text-align: left; border-radius:0;" id=""
                                  class="form-control process" rows="1" placeholder="process3" required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="process" style="text-align: left; border-radius:0;" id=""
                                  class="form-control process" rows="1" placeholder="process4" required></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="form-group mb-3 col-4" id="speakerEmotion">
                          <div class="sdlms-section d-block overflow-auto pb-0" style="min-height: calc(100% - 70px);">
                            <div
                              class="align-items-center cursor-pointer d-flex font-weight-500 justify-content-around justify-content-between sdlms-section-header sdlms-text-white-17px secondary-header">
                              <div class="align-items-center d-flex pt-1 justify-content-center">
                                <span class="active">speakerEmotions</span>
                              </div>
                            </div>
                            <div class="sdlms-section-body px-3 pt-2  position-relative">
                              <div class="form-group mt-3 col-12">
                                <textarea name="speaker_emotions" style="text-align: left; border-radius:0;" id=""
                                  class="form-control speaker_emotions" rows="1" placeholder="speakerEmotions1"
                                  required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="speaker_emotions" style="text-align: left; border-radius:0;" id=""
                                  class="form-control speaker_emotions" rows="1" placeholder="speakerEmotions2"
                                  required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="speaker_emotions" style="text-align: left; border-radius:0;" id=""
                                  class="form-control speaker_emotions" rows="1" placeholder="speakerEmotions3"
                                  required></textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="speaker_emotions" style="text-align: left; border-radius:0;" id=""
                                  class="form-control speaker_emotions" rows="1" placeholder="speakerEmotions4"
                                  required></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mx-0 my-4">
                        <div class="form-group mb-3 col-4" id="feedbacks">
                          <div class="sdlms-section d-block overflow-auto pb-0" style="min-height: calc(100% - 70px);">
                            <div
                              class="align-items-center cursor-pointer d-flex font-weight-500 justify-content-around justify-content-between sdlms-section-header sdlms-text-white-17px secondary-header">
                              <div class="align-items-center d-flex pt-1 justify-content-center">
                                <span class="active" data-fb-type="">Feedbacks (optional)</span>
                              </div>
                            </div>
                            <div class="sdlms-section-body px-3 pt-2  position-relative">
                              <p class="sdlms-text-black-22px">How did You feel in Class?</p>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control feelparameter" rows="1" required placeholder="parameter1"></textarea>
                              </div>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control feelparameter" rows="1" required placeholder="parameter2"></textarea>
                              </div>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control feelparameter" rows="1" required placeholder="parameter3"></textarea>
                              </div>
                              <hr>
                              <p class="sdlms-text-black-22px">How did You want your next session to be?</p>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control wantparameter" rows="1" required placeholder="parameter1"></textarea>
                              </div>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control wantparameter" rows="1" required placeholder="parameter2"></textarea>
                              </div>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control wantparameter" rows="1" required placeholder="parameter3"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="form-group mb-3 col-8">
                          <div class="sdlms-section d-block overflow-auto pb-0" style="min-height: calc(100% - 70px);">
                            <div
                              class="align-items-center cursor-pointer d-flex font-weight-500 justify-content-around justify-content-between sdlms-section-header sdlms-text-white-17px secondary-header">
                              <div class="align-items-center d-flex pt-1 justify-content-center">
                                <span class="active">Emotiicons</span>
                              </div>
                            </div>
                            <div class="sdlms-section-body px-3 pt-2  position-relative">
                        <div class="mt-3">
                        <div class="form-group mt-3 col-12">
                        <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                        class="form-control emoticons" rows="1" placeholder="speakerEmotions4"
                        required></textarea>
                    </div>
                    <div class="form-group mt-3 col-12">
                        <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                        class="form-control emoticons" rows="1" placeholder="speakerEmotions4"
                        required></textarea>
                    </div>
                    <div class="form-group mt-3 col-12">
                        <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                        class="form-control emoticons" rows="1" placeholder="speakerEmotions4"
                        required></textarea>
                    </div>
                    <div class="form-group mt-3 col-12">
                        <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                        class="form-control emoticons" rows="1" placeholder="speakerEmotions4"
                        required></textarea>
                    </div>
                    <div class="form-group mt-3 col-12">
                        <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                        class="form-control emoticons" rows="1" placeholder="speakerEmotions4"
                        required></textarea>
                    </div>
                    <div class="form-group mt-3 col-12">
                        <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                        class="form-control emoticons" rows="1" placeholder="speakerEmotions4"
                        required></textarea>
                    </div>

                        </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex justify-content-end">
                        <button type="submit" class="sdlms-button btn button-primary"
                          id="create-teachingStyle">Create</button>
                      </div>
                  </form>`
        return html
      }
    }
    $('.teachingStyle-area').on('click', '#create-teachingStyle', function (e) {
      e.preventDefault()
      e.preventDefault()
      let target = $(this).parents('form')
      let data = {}
      data.name = $(target).find('[name="name"]').val();
      data.intents = []
      data.processes = []
      data.speaker_emotions = []
      let feelparameter = []
      let wantparameter = []
      data.feedbacks = [feelparameter, wantparameter]
      data.emoticons = []
      $(target).find('.intent').each((i, ele) => {
        data.intents.push($(ele).val())
    })
    $(target).find('.process').each((i, ele) => {
        data.processes.push($(ele).val())
    })
    $(target).find('.speaker_emotions').each((i, ele) => {
        data.speaker_emotions.push($(ele).val())
    })
    $(target).find('.feelparameter').each((i, ele) => {
        data.feedbacks[0].push($(ele).val())
    })
    $(target).find('.wantparameter').each((i, ele) => {
        data.feedbacks[1].push($(ele).val())
    })
    $(target).find('.emoticons').each((i, ele) => {
        data.emoticons.push($(ele).val())
    })
      console.log(data)
       api.post(`/sdlms/teachingstyles`, data).then(function (res) {
         console.log(res);
          location.href = `/teachingstyles`
       });
    })
  }
  teachingStyles.initteachingStyles = (data) => {
    $("#teachingStyle-table").find('.sdlms-my-teachingStyle-body').empty();
    data.map((ev, index) => {
     $("#teachingStyle-table").find('.sdlms-my-teachingStyle-body').append(`
     <tr redirect="teachingStyles" data-teachingStyles-slug="${ev.slug}">
     <td>${index +1}</td>
     <td data-teachingStyles-name="${ev.name}">${ev.name}</td>
   </tr>
   `)
   })
   
  }
  return teachingStyles;
});