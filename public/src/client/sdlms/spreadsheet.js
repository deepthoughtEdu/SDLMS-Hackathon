define('forum/sdlms/spreadsheet', ['api', 'sdlms/spreadsheet'], function (api, spreadsheet) {
	var Spreadsheet = {};
    
    let action_button = $('[component="spreadsheet"]').find(".add-row");

    Spreadsheet.spreadsheet = ajaxify.data.spreadsheet;

    
	Spreadsheet.init = function () {
        

        Spreadsheet.renderSpreadsheets(Spreadsheet.spreadsheet);
        
        $('[component="spreadsheet"]').find(".add-row").on('click', function () {
            let action = $(this).find(".spreadsheet-action-text").data('action');
            console.log(action)
            if (action == 'back') {
                Spreadsheet.renderSpreadsheets(Spreadsheet.spreadsheet);
                action_button.empty();
                action_button.html(`<i class="fa fa-plus"></i>&nbsp;&nbsp;<span data-action="add" class="spreadsheet-action-text">Create New Spreadsheet</span>`)
            } else {
               // $('.spreadsheet-area').empty();
                new spreadSheet({target:'.spreadsheet-area', tid:1});
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="spreadsheet-action-text">Go Back</span>`)
            }
        })

        $('body').on('click', '[redirect= "data-spreadsheet-id"]', function () {
            let pid = $(this).data("id");
            if (pid) {
                window.location.href=`/manage/assets/spreadsheet/${pid}`;
                console.log('going');
            }
           
                onClose: () => { 
                    return Spreadsheet.renderSpreadsheets=(Spreadsheet.spreadsheet);
                }
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="spreadsheet-action-text">Go Back</span>`)
            })
      

        

        $('body').on('click', '[redirect= "data-edit-id"]', function () {
            let pid = $(this).data("id");
            if (pid) {
                window.location.href=`/manage/assets/spreadsheet/${pid}`;
                console.log('going');
            }
            
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="spreadsheet-action-text">Go Back</span>`)
            })
       
	}

    Spreadsheet.template = function (part, data, target) {
        console.log(data);
		let components = {
			spreadsheet: `<tr>
                <td ><index>${(target.find('tr').length + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</index></td>
                <td  data-spreadsheet-id="${data._id}">${data.title}</td>
                <td data-edit-id="${data._id}"><i class='fa fa-pencil'></i>
                </td>
             </tr>`
		}

		return components[part];
	}

    Spreadsheet.renderSpreadsheets = (spreadsheet) => {
        $('.spreadsheet-area').empty();
        $('.spreadsheet-area').append(`<div class="col-md-12 px-0 pb-3">
        <table class="table mb-0 spreadsheet-table table-bordered" id="editableTable">
        <thead class=" secondary-header sdlms-text-white-18px font-weight-medium">
        <tr class="sdlms-my-upcoming-session-table-header-row" style="cursor: pointer;">
            <th class="font-weight-500">S. NO</th>
            <th class="font-weight-500">Spreadsheet</th>
            <th class="font-weight-500">Edit</th>
        </tr>
        </thead>
            <tbody></tbody>
        </table>
        </div>`);
        let $tbody = $('[component="spreadsheet"]').find(".spreadsheet-table").find("tbody");
        spreadsheet.forEach(element => {
            $tbody.append(Spreadsheet.template('spreadsheet', element, $tbody));
        });
    }

	return Spreadsheet
});