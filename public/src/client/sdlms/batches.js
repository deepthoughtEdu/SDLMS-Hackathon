'use strict';


define('forum/sdlms/batches', ['api'], function (api) {
	var Batches = {};
	let $tbody = $('[component="batches"]').find(".batch-table").find("tbody");
	let processing = 0;

	Batches.init = function () {
		let classes = [];
		let batches = [];


		api.get('/app/category', {}).then((response) => {
			classes = response.filter(e => String(e.categoryType).toLocaleLowerCase() == 'class');
			$.each(classes, function (i, e_) {
				e_.sub_categories = e_.sub_categories.map(e => {
					e.parent_cid = e_.cid;
					e.parent_name = e_.name;
					return e;
				})
				batches.push(...e_.sub_categories)
			});
			batch(1);

			function batch(page_number,page_size=1000) {
				$.each((batches.slice((page_number - 1) * page_size, page_number * page_size) || []), function (i, e) {
					$tbody.append(Batches.template('batch', e));
				});
			}

			classes = classes.map((e) => {
				return {
					id: e.cid,
					text: e.name
				}
			});

			$('[component="batches"] .add-row').prop('disabled', false);
			initial();
		})

		function initial() {
			$('[component="batches"] .batch-table tr').editable({
				dropdowns: {
					classCategoryId: classes
				},
				edit: function (values) {
					$(".edit i", this)
						.removeClass('fa-pencil')
						.addClass('fa-save')
						.attr('title', 'Save');
						console.log(values);
				},
				save: function (payload) {

					notify('Please wait..', 'success');
					if(!processing){
						processing = 1;
						let cid = $("[data-batch]", this).data('cid');
						let request;
						if (cid) {
							request = api.put('/sdlms/batch/' + cid, payload);
						} else {
							payload.created = Date.now();
							request = api.post('/sdlms/batch', payload);
						}
						request.then((response) => {
							processing = 0;
							$(".edit i", this)
								.removeClass('fa-save')
								.addClass('fa-pencil')
								.attr('title', 'Edit');
	
							if (response.modified) {
								notify('Batch updated successfully', 'success');
							}
						});
						
					}
					
				},
				cancel: function (values) {
					$(".edit i", this)
						.removeClass('fa-save')
						.addClass('fa-pencil')
						.attr('title', 'Edit');
						console.log(values)

				}
			});
			function reIndex(){
				$('[component="batches"] .batch-table tr').each(function(){
					$(this).find('index').text(($(this).index()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
				})
			}
			$('[component="batches"]').find("[delete-batch]").off('click').click(function (e) {
				let $that = this;
				if (prompt('Type DELETE to delete') == 'DELETE') {
					
					notify('Please wait..', 'success');
						if(!processing){
							processing = 1;
							$that.find('i').find('i').toggleClass('fa-spin fa-trash fa-sync-alt');
							let cid = $("[data-batch]", $(this).parents('tr').first()).data('cid');
							api.del('/sdlms/batch/' + cid).then((response) => {
								processing = 0;
								$(".edit i", this)
									.removeClass('fa-save')
									.addClass('fa-pencil')
									.attr('title', 'Edit');
								reIndex();
								$(this).closest("tr").remove();
								if (response.modified) {
									notify('Batch updated successfully', 'success');
								}
							}).catch((err) => {
								$that.find('i').toggleClass('fa-spin fa-trash fa-sync-alt');
							});
						}
				} else {
	
				}
			});
		}
		$('[component="batches"]').find(".add-row").click(function () {
			$tbody.append(`
                        <tr>
                           <td >${($tbody.find('tr').length + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</td>
                           <td data-field='batchName'></td>
                           <td data-field='classCategoryId'></td>
                           <td style="display:none">${moment().format('ddd, DD MMM, YYYY')}</td>
                           <td><a class='button edit' title='Edit'><i class='fa fa-pencil' ></i></a> 
                               <a class='button' title='Delete'><i class='fa fa-trash'></i></a>
                           </td>
                        </tr>`);
			initial();
			setTimeout(function () {
				$('[component="batches"] .batch-table').find("tbody tr:last-child td:last-child a[title='Edit']").click();
			}, 100);

			setTimeout(function () {
				$('[component="batches"] .batch-table').find("tbody tr:last-child td[data-field='batchName'] input[type='text']").focus();
			}, 300);

			$('[component="batches"] .batch-table').find("a[title='Delete']").unbind('click').click(function (e) {
				$(this).closest("tr").remove();
			});

		});

		$('[component="batches"]').on('click', '[data-batch-cid]', function () {
			location.href = `/batches/${$(this).data('batch-cid')}`
		 });
		
	}
	Batches.template = function (part, data) {
		let components = {
			batch: `<tr data-batch-cid="${data.cid || 0}">
                <td ><index>${($tbody.find('tr').length + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</index></td>
                <td data-field='batchName'>${data.name}</td>
                <td data-field='classCategoryId' data-value="${data.parent_cid}">${data.parent_name}</td>
                <td style="display:none">${moment(data.created).format('ddd, DD MMM, YYYY')}</td>
                <td data-cid="${data.cid || 0}" data-batch><a class='button edit' title='Edit' ><i class='fa fa-pencil'></i></a> 
                    <a class='button' delete-batch title='Delete'><i class='fa fa-trash'></i></a>
                </td>
             </tr>`
		}

		return components[part];
	}
	return Batches;
})