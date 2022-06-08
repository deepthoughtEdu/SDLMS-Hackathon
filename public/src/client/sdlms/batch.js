'use strict';

define('forum/sdlms/batch', ['api', 'sdlms/session', 'sdlms/jquery_dirrty'], function (api) { 
    var Batch = {};
    Batch.batch = ajaxify.data.batch;
    Batch.cohorts = ajaxify.data.cohorts;
    Batch.sessions = ajaxify.data.sessions;
    Batch.selectedCohort = Batch.cohorts.find(cohort => Batch.batch.cohortName == cohort.name);
    let $target = $('#batch-form');
    var { teaching_styles } = ajaxify.data;

    Batch.init = function () {
        $('#update-batch-btn').attr("disabled", "disabled");

        if (Batch.batch.cohortName) {
            $target.find(`[value="${Batch.batch.cohortName}"]`).attr('selected', true);
        }
        if (Batch.batch.batchType) {
            $target.find(`[id="${Batch.batch.batchType}"]`).attr('selected', true);
        }
        if (Batch.batch.teachingStyle) {
            $target.find(`[value="${Batch.batch.teachingStyle}"]`).attr('selected', true);
        }

        $target.on('submit', function (e) {
            e.preventDefault();
            let teachingStyle = $('#select-teachingstyle').val();
            let payload = {
                batchName: $('[name="name"]').val(),
                cohortName: $('#select-cohort').val(),
                description: $('[name="description"]').val(),
                batchType: $('#select-batch-type').val().toLocaleLowerCase(),
                teachingStyle: teachingStyle,
                TeachingStyleId: $(`[value="${teachingStyle}"]`).data('teachingstyle-id'),
            }
            payload.classCategoryId = Batch.batch.parentCid;

            api.put('/sdlms/batch/' + Batch.batch.cid, payload).then(function () { 
                location.reload();
            })
            .catch((err) => {
                notify(err.message, 'error')
            })
            notify('Saving...', 'info');
        })

        if (Batch.sessions.length) { 
            $('.sessions-area').append('<h4>Sessions</h4>');
            Batch.sessions.forEach(session => {
                new Session({
                    target: '.sessions-area',
                    append: true,
                    batch: Batch.batch,
                    cohort: Batch.selectedCohort,
                    with: session,
                    teaching_styles,
                    action: 'editor',
                })
            })
        }

        $('[action="add-session"]').on('click', function () { 
            let teachingStyle = $('#select-teachingstyle').val();
            new Session({
                target: '.sessions-area',
                append: true,
                batch: Batch.batch,
                cohort: Batch.selectedCohort,
                sessions: Batch.sessions,
                teaching_styles,
                TeachingStyleId: teachingStyle,
            })
        })

        $target.dirrty().on("dirty", function(){
            $('#update-batch-btn').removeAttr("disabled");
            }).on("clean", function(){
                $('#update-batch-btn').attr("disabled", "disabled");
            });
      
    };


    return Batch;
});