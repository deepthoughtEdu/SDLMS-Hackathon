'use strict';

define('forum/sdlms/quizPage', ['api', 'sdlms/quiz'], function (api, quiz) {
	var Quizzes = {};
    
    let action_button = $('[component="quizzes"]').find(".add-row");

    Quizzes.quizzes = ajaxify.data.quizzes;

    
	Quizzes.init = function () {
        Quizzes.renderQuizzes(Quizzes.quizzes);
        
        $('[component="quizzes"]').find(".add-row").on('click', function () {
            let action = $(this).find(".quiz-action-text").data('action');
            if (action == 'back') {
                Quizzes.renderQuizzes(Quizzes.quizzes);
                action_button.empty();
                action_button.html(`<i class="fa fa-plus"></i>&nbsp;&nbsp;<span data-action="add" class="quiz-action-text">Create</span>`)
            } else {
                $('.quiz-area').empty();
                new Quiz('.quiz-area', {tid: 1});
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="quiz-action-text">Go Back</span>`)
            }
        })

        $('body').on('click', '[data-quiz-id]', function () {
            let id = $(this).data('quiz-id');

            api.get(`/sdlms/1/quiz/${id}`, {}).then((r) => {

                new Quiz('.quiz-area', {...r[0], extr: {
                    closable: true,
                    onClose: () => { 
                        return Quizzes.renderQuizzes = (Quizzes.quizzes);
                    }
                }} );
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="quiz-action-text">Go Back</span>`)
            })
        })

        $('body').on('click', '[data-edit-id]', function () {
            let id = $(this).data('edit-id');
            
            api.get(`/sdlms/1/quiz/${id}`, {}).then((r) => {
                new Quiz('.quiz-area', $.extend({}, r[0], { assetId: r._id, data: r[0].data }))
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="quiz-action-text">Go Back</span>`)
            })
        })
	}

    Quizzes.template = function (part, data, target) {
		let components = {
			quiz: `<tr>
                <td ><index>${(target.find('tr').length + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</index></td>
                <td  data-quiz-id="${data._id}">${data.data[0].question}</td>
                <td data-edit-id="${data._id}"><a class='button edit' title='Edit' ><i class='fa fa-pencil'></i></a> 
                </td>
             </tr>`
		}

		return components[part];
	}

    Quizzes.renderQuizzes = (quizzes) => {
        $('.quiz-area').empty();
        $('.quiz-area').append(`<div class="col-md-12 px-0 pb-3">
        <table class="table mb-0 quiz-table table-bordered" id="editableTable">
        <thead class=" secondary-header sdlms-text-white-18px font-weight-medium">
        <tr class="sdlms-my-upcoming-session-table-header-row" style="cursor: pointer;">
            <th class="font-weight-500">S. NO</th>
            <th class="font-weight-500">Quiz</th>
            <th class="font-weight-500">Edit</th>
        </tr>
        </thead>
            <tbody></tbody>
        </table>
        </div>`);
        let $tbody = $('[component="quizzes"]').find(".quiz-table").find("tbody");
        quizzes.forEach(element => {
            $tbody.append(Quizzes.template('quiz', element, $tbody));
        });
    }

	return Quizzes
})