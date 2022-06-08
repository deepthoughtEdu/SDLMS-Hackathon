'use strict';

define('forum/sdlms/teaching_style/teaching_style', ['api'], function (api) {
    var teachingStyle = {};
    teachingStyle.teachingStyleId = ajaxify.data.teachingStyle.TeachingStyleId
    teachingStyle.teachingStyles = ajaxify.data.teachingStyle
    teachingStyle.init = function () {
        console.log('Viewing single Teaching Style inited');
        let templete = {
            form: (data) => {

                let html = `
                <form id="form-teachingStyle"
                    class=" sdlms-floating-label-input sdlms-section-body border m-3 create p-3 sdlms-session-container needs-validation ">
                    <div class="col-md-12 px-0 pb-3 " id="new-teachingStyle">
                      <div class="form-group mb-3 col-12">
                        <label for="">teachingStyle name</label>
                        <input required name="name" type="text" class="form-control" value="${data.name}">
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
                                  class="form-control intent" rows="1" placeholder="Intent1" required>${data.intents[0] ? data.intents[0] : ""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="intent" style="text-align: left; border-radius:0;" id=""
                                  class="form-control intent" rows="1" placeholder="Intent2" required>${data.intents[1] ? data.intents[1] : ""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="intent" style="text-align: left; border-radius:0;" id=""
                                  class="form-control intent" rows="1" placeholder="Intent3" required>${data.intents[2] ? data.intents[2] : ""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="intent" style="text-align: left; border-radius:0;" id=""
                                  class="form-control intent" rows="1" placeholder="Intent4" required>${data.intents[3] ? data.intents[3] : ""}</textarea>
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
                                  class="form-control process" rows="1" placeholder="process1" required>${data.processes[0]?data.processes[0]:""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="process" style="text-align: left; border-radius:0;" id=""
                                  class="form-control process" rows="1" placeholder="process2" required>${data.processes[1]?data.processes[1]:""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="process" style="text-align: left; border-radius:0;" id=""
                                  class="form-control process" rows="1" placeholder="process3" required>${data.processes[2]?data.processes[2]:""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="process" style="text-align: left; border-radius:0;" id=""
                                  class="form-control process" rows="1" placeholder="process4" required>${data.processes[3]?data.processes[3]:""}</textarea>
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
                                  required>${data.speaker_emotions[0]?data.speaker_emotions[0]:""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="speaker_emotions" style="text-align: left; border-radius:0;" id=""
                                  class="form-control speaker_emotions" rows="1" placeholder="speakerEmotions2"
                                  required>${data.speaker_emotions[1]?data.speaker_emotions[1]:""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="speaker_emotions" style="text-align: left; border-radius:0;" id=""
                                  class="form-control speaker_emotions" rows="1" placeholder="speakerEmotions3"
                                  required>${data.speaker_emotions[2]?data.speaker_emotions[2]:""}</textarea>
                              </div>
                              <div class="form-group mt-3 col-12">
                                <textarea name="speaker_emotions" style="text-align: left; border-radius:0;" id=""
                                  class="form-control speaker_emotions" rows="1" placeholder="speakerEmotions4"
                                  required>${data.speaker_emotions[3]?data.speaker_emotions[3]:""}</textarea>
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
                                  class="form-control feelparameter" rows="1" required placeholder="parameter1">${data.feedbacks[0][0]?data.feedbacks[0][0]:""}</textarea>
                              </div>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control feelparameter" rows="1" required placeholder="parameter2">${data.feedbacks[0][1]?data.feedbacks[0][1]:""}</textarea>
                              </div>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control feelparameter" rows="1" required placeholder="parameter3">${data.feedbacks[0][2]?data.feedbacks[0][2]:""}</textarea>
                              </div>
                              <hr>
                              <p class="sdlms-text-black-22px">How did You want your next session to be?</p>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control wantparameter" rows="1" required placeholder="parameter1">${data.feedbacks[1][0]?data.feedbacks[1][0]:""}</textarea>
                              </div>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control wantparameter" rows="1" required placeholder="parameter2">${data.feedbacks[1][1]?data.feedbacks[1][1]:""}</textarea>
                              </div>
                              <div class="form-group mb-3 col-12">
                                <textarea name="parameter" style="text-align: left; border-radius: 0;" id=""
                                  class="form-control wantparameter" rows="1" required placeholder="parameter3">${data.feedbacks[1][2]?data.feedbacks[1][2]:""}</textarea>
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
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class = "" style="width:100px;height:100px">
                                        <img src=${data.emoticons[0]?data.emoticons[0]:""} alt="emoticons" width="100%" height="100%" style="border-radius:100%">
                                    </div>
                                    <div class = "" style="width:100px;height:100px">
                                        <img src=${data.emoticons[1]?data.emoticons[1]:""} alt="emoticons" width="100%" height="100%" style="border-radius:100%">
                                    </div>
                                    <div class = "" style="width:100px;height:100px">
                                        <img src=${data.emoticons[2]?data.emoticons[2]:""} alt="emoticons" width="100%" height="100%" style="border-radius:100%">
                                    </div>
                                    <div class = "" style="width:100px;height:100px">
                                        <img src=${data.emoticons[3]?data.emoticons[3]:""} alt="emoticons" width="100%" height="100%" style="border-radius:100%">
                                    </div>
                                    <div class = "" style="width:100px;height:100px">
                                        <img src=${data.emoticons[4]?data.emoticons[4]:""} alt="emoticons" width="100%" height="100%" style="border-radius:100%" >
                                    </div>
                                    <div class = "" style="width:100px;height:100px">
                                        <img src=${data.emoticons[5]?data.emoticons[5]:""} alt="emoticons" width="100%" height="100%" style="border-radius:100%">
                                    </div>
                                </div>

                                <div class="mt-3">
                                <div class="form-group mt-3 col-12">
                                <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                                class="form-control emoticons" rows="1" placeholder="emoticons"
                                required>${data.emoticons[0]?data.emoticons[0]:""}</textarea>
                            </div>
                            <div class="form-group mt-3 col-12">
                                <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                                class="form-control emoticons" rows="1" placeholder="emoticons"
                                required>${data.emoticons[1]?data.emoticons[1]:""}</textarea>
                            </div>
                            <div class="form-group mt-3 col-12">
                                <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                                class="form-control emoticons" rows="1" placeholder="emoticons"
                                required>${data.emoticons[2]?data.emoticons[2]:""}</textarea>
                            </div>
                            <div class="form-group mt-3 col-12">
                                <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                                class="form-control emoticons" rows="1" placeholder="emoticons"
                                required>${data.emoticons[3]?data.emoticons[3]:""}</textarea>
                            </div>
                            <div class="form-group mt-3 col-12">
                                <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                                class="form-control emoticons" rows="1" placeholder="emoticons"
                                required>${data.emoticons[4]?data.emoticons[4]:""}</textarea>
                            </div>
                            <div class="form-group mt-3 col-12">
                                <textarea name="emoticons" style="text-align: left; border-radius:0;" id=""
                                class="form-control emoticons" rows="1" placeholder="emoticons"
                                required>${data.emoticons[5]?data.emoticons[5]:""}</textarea>
                            </div>

                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex justify-content-end">
					        <button id="delete-teachingStyle" btn-delete="${data.teachingStyleId}" class="sdlms-button btn mr-2 button-primary">Delete teachingStyle</button>
					        <button  class="sdlms-button btn button-primary" id="saveteachingStyle">Save</button>
				    </div>
                  </form>`
                return html
            }
        }
        $('.teachingStyle-area').html(templete.form(teachingStyle.teachingStyles))
        $('#saveteachingStyle').on('click', function (e) {
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

            api.put(`/sdlms/teachingstyles/${ajaxify.data.teachingStyle.TeachingStyleId}`, data).then(function (res) {
                console.log(res);
                 location.href = `/teachingstyles/`
            });
        })
        $('#delete-teachingStyle').on("click", function (e) {
            e.preventDefault();
            let resp = prompt('Are you sure to delete this teachingstyles? Type "YES" to confirm');
            if (resp == 'YES') {
                api.del(`/sdlms/teachingstyles/${ajaxify.data.teachingStyle.TeachingStyleId}`).then(function (res) {
                    console.log(res)
                      location.href = `/teachingstyles`
                });
            }
        });
    }

    return teachingStyle;
});