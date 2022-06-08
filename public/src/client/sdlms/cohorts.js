'use strict';

define('forum/sdlms/cohorts', ['api', 'sdlms/cohort', 'sdlms/users'], function (api) {
	var COHORTS = {};
    
    let action_button = $('[component="cohorts"]').find(".add-row");

    COHORTS.cohorts = ajaxify.data.cohorts;
    
	COHORTS.init = function () { 
        COHORTS.render(COHORTS.cohorts);

        $('[component="cohorts"]').find(".add-row").on('click', function () { 
            let action = $(this).find(".cohort-action-text").data('action');
            if (action == 'back') {
                $('[component="cohorts"]').find(".my-cohorts").text('Cohorts');
                COHORTS.render(COHORTS.cohorts);
                action_button.empty();
                action_button.html(`<i class="fa fa-plus"></i>&nbsp;&nbsp;<span data-action="add" class="cohort-action-text">Create</span>`)
            } else {
                $('.cohort-area').empty();
                new Cohort({
                    target: '.cohort-area',
                    action: 'create'
                })

                $('[component="cohorts"]').find(".my-cohorts").text('Create');
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="cohort-action-text">Go Back</span>`)
            }
        });

        $('body').on('click', '[data-cohort-slug]', function () {
            let slug = $(this).data('cohort-slug');
            let name = $(this).find('[data-cohort-name]').text();

            window.location.href = `/cohorts/${name}`;

            // api.get(`/sdlms/cohorts?name=${name}`, {}).then((r) => {
            //     new Cohort ({
            //         target: '.cohort-area',
            //         with: r,
            //         slug: slug,
            //         name: name,
            //         action: 'reader'
            //     })

            //     $('[component="cohorts"]').find(".my-cohorts").empty();
            //     action_button.empty();
            //     action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="cohort-action-text">Go Back</span>`)
            // })
        })
    }

    COHORTS.render = function (data) {
        $('.cohort-area').empty();
        $('.cohort-area').append(`<div class="col-md-12 px-0 pb-3">
        <table class="table mb-0 cohort-table table-bordered" id="editableTable">
        <thead class=" secondary-header sdlms-text-white-18px font-weight-medium">
        <tr class="sdlms-my-upcoming-session-table-header-row" style="cursor: pointer;">
            <th class="font-weight-500">S. NO</th>
            <th class="font-weight-500">Name</th>
            <th class="font-weight-500">Members</th>
        </tr>
        </thead>
            <tbody></tbody>
        </table>
        </div>`);
        let $tbody = $('[component="cohorts"]').find(".cohort-table").find("tbody");
        data.forEach(element => {
            $tbody.append(COHORTS.template('cohort', element, $tbody));
        });
    }

    COHORTS.template = function (part, data, target) {
		let components = {
			cohort: `<tr data-cohort-slug=${data.slug}>
                <td ><index>${(target.find('tr').length + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</index></td>
                <td  data-cohort-name="${data.name}">${data.name}</td>
                <td>${data.memberCount || 0}</td>
             </tr>`
		}

		return components[part];
	}

    return COHORTS;
});