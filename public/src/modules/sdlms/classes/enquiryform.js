/**
 * @author imshawan
 * @date 21-05-2022
 * @class EnquiryForm
 * @description Contains the @methods or @function - for the builder, answerer and renderer
 * 
 * @example How to use/initialize the component?
 * let data = new EnquiryForm({
            target: '.sdlms-form', target where to init the form component
            header: 'Form component', Heading for the form component
            action: 'reader', Modes: create, answer, reader
            requiresValidation: true, (If form validstion is required or keep it false -> Still a work in progress)
            with: {}, A json object containing the form data (Incase of existing form, incase of new form, leave it empty)
 		})
 *
 * @methods the methods for getting JSON data from the component ->
 * 
 * As we inited the form by -> let data = new EnquiryForm({})
 * Now we use 'data' to access the internal functions of the class such as @getMetaData and @getFormResponses to get the
 * desired json data out from the form
 * 
 * @example How to get the form data?
 * let formData = data.getMetaData();
 * 
 * @example How to get the form responses?
 * let formResponses = data.getFormResponses();
 * 
 * @todo: Add the form validation, and conditional block addition
 */
 class EnquiryForm {
	constructor(data) {
		this.data = data;
		this.requiresValidation = data.requiresValidation || false;
		this.data.with = data.with || {};
		this.strictMode = data.strictMode || false;
        this.header = data.header || 'Enquiry Form';

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

	builder(target = "body") {

		this.id = this.unique("sdlms-enquiry-form-");
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
			$("<sdlms-enquiry-form-builder>")
				.attr({
					id: $that.id,
					class: $that.data.noAction ? "sdlms-readonly" : '' + 'sdlms-section sdlms-form-elements position-relative w-100'
				})
				.append(`<div class="sdlms-section-header position-relative shadow-none d-flex primary-header align-items-center justify-content-between">
                    <div class="font-weight-bold sdlms-text-white-20px my-auto">${$that.header}</div>`)
				.append($(`<form>`).attr({
					id: "form-" + $that.id,
					class: 'sdlms-session-container sdlms-form-elements m-3 create sdlms-session-container needs-validation position-relative',
				})
				)
		);
		let $builder = $(`#form-${$that.id}`);
		$that.$builder = $builder;
		$that[$that.data.action == 'answer' ? 'answer' : ($that.data.action == 'reader' ? 'reader': 'create')]($that.data.with);
	}

	/**
	 * @date 26-05-2022
	 * @author imshawan
	 * @param {Object} data 
	 * @returns Formatted DateTime
	 */
	dateFormatter (data = {}) {
        let date = new Date(data.timestamp)
		let time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return `${date.getDate()} ${date.toLocaleDateString(undefined, { month: "long" })}, ${date.getFullYear()} ${data.datetime ? `, ${time}` : ''}`
    }

	/**
	 * @author imshawan
	 * @description Contains all the components that is going to be used by the form builder and renderer
	 * @returns {components}
	 */
	enquiryForm() {
		let $that = this;
		let components = {
			form: function (data = {}) {
				return `
                <div class="m-3">
                    <div class="row mt-2">
                        <div class="form-group mb-3 w-100">
                            <label for="">Form title</label>
                            <input required value="${data.title || ''}" name="title" type="text" class="form-control">
                        </div>

                        <div class="w-100 mt-2" appending-area="${$that.id}">
                            
                        </div>
                    </div>
                    <button class="btn btn-primary sdlms-btn" addblock-btn="${$that.id}">Add block</button>
                </div>
                `;
			},

            textArea: function (data = {}) {
                return `
                ${data.label ? '<label for="">Response</label>' : ''}
                <textarea rows="4" placeholder="${data.placeholder || ''}" required value="${data.response || ''}" name="response" type="text" class="form-control w-100"></textarea>
                `
            },

			dropDownOptions: function (data = []) {
				let options = `<option value="">Select</option>`;
				$.each(data, function (index, option) {
					let name = Object.keys(option)[0];
					options += `<option value="${name}">${option[name]}</option>`;
				});	
				return options;
			},
			
			checkBoxes: function (data = []) {
				let options = '';
				$.each(data, function (index, option) {
					let name = Object.keys(option)[0];
					options += `
					<input type="checkbox" placeholder="${option.placeholder || ''}" id="${option[name] + '_' + name}" value="${option[name] || ''}" name="${name}">
					<label for="${option[name] + '_' + name}" >${option[name] || ''}</label><br>
				`;
				})
				return options;
			},

            inputField: function (data = {}) {
                return `
					<div class="d-flex" option-id="${data.id}">
						<input required placeholder="${data.placeholder || ''}" value="${data.value || ''}" name="${data.name}" type="text" class="mb-2 form-control">
						<i class="fa fa-trash my-2 ml-2 delete-option-btn" data-delete-btn="${data.id}" aria-hidden="true"></i>
					</div>
                `;
            },

			dateTime: function (data = {}) {
				return `
				<div class="d-flex">
					<input class="w-100 form-control" type="${data.input_type || 'date'}" placeholder="${data.placeholder || ''}" id="${data.unique}_dateTime" value="${data.value || ''}" name="response">
					<label for="${data.unique}_dateTime" >${''}</label><br>
				</div>
				`;
			},

			helpTextTooltip: function (data = '') {
				if (!data) return '';
				return `
					<span data-helptext class="helptext-tooltip sdlms-text-tertiary-16px font-weight-500">
						<i class="fa fa-question-circle" aria-hidden="true"></i>
						<span class="helptext-tooltiptext">${data}</span>
					</span>
				`;
			},

            formItem: function (data = {}) {
                let unique = data.unique || $that.unique();
                return `
                    <div enquiry-block="${unique}" data-input-type="${data.input_type}" class="border mb-4 px-2 position-relative">
					<div class="delete-block-btn position-absolute" data-delete-block="${unique}">
						<i class="fa fa-trash my-2 ml-2" aria-hidden="true"></i>
					</div>
                        <div class="pt-2 form-group col-12">
                            <label for="questionId-${unique}">Question</label>
								<span>
									<button data-helptext-id="${unique}" class="add-help-text" style="border: none; background: transparent;">
										<i class="fa fa-question-circle" aria-hidden="true"></i>
									</button>
								</span>
								<div class="d-none mb-2 position-relative" helptext-area-id="${unique}">
									<input required value="${data.helptext || ''}" name="helptext" type="text" placeholder="Enter a help text for your question" class="form-control">
									<button style="position: absolute;right: 8px; background: transparent; border: none; top: 3px;" class="" helptext-remove data-remove-id="${unique}">
										<i class="fa fa-minus-circle my-2" aria-hidden="true"></i>
									</button>
								</div>
                            <input required id="questionId-${unique}" value="${data.question || ''}" name="question" type="text" class="form-control">
                        </div>
                        <div class="form-group col-12">
                            <div class="row">
                                <div class="col-12 col-lg-9 input-field-area">
                                    <div input-field-area="${unique}">
									${data.label ? '<label for="">Response</label>' : ''}
										<textarea rows="4" required value="${data.response || ''}" name="response" type="text" class="form-control w-100"></textarea>
									</div>
									<div input-field-btn="${unique}" class="justify-content-end d-flex mt-3"></div>
                                </div>
								
                                <div class="col-12 col-lg-3">
                                <div>
                                    <label for="">User input type</label>
                                    <select data-select-id="${unique}" style="font-size: 16px;" value="" name="input_type" class="sdlms-form-select w-100 mr-3">
                                        <option value="">Select input</option>
                                        <option selected value="textfield">Text box</option>
                                        <option value="dropdown">Dropdown</option>
                                        <option value="multiselect">Multi-select</option>
                                        <option value="date">Date</option>
                                        <option value="datetime">Date-Time</option>
                                    </select>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },
			responseFormItem: function (data = {}) {
                let unique = data.unique || $that.unique();
                return `
                    <div enquiry-block="${unique}" data-input-type="${data.input_type}" class="border mb-4 px-2 position-relative">
                        <div class="pt-2 form-group col-12 sdlms-text-primary-16px font-weight-bold">
							<div question-area="${unique}">
								<span data-question>${data.question || ''}</span>
								${components.helpTextTooltip(data.helptext)}
							</div>
                        </div>
                        <div class="form-group col-12">
                            <div class="row">
                                <div class="col-12 answering-field-area">
                                    <div answering-field-area="${unique}"> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

			renderResponseFormItem: function (data = {}) {
                let unique = data.unique || $that.unique();
                return `
                    <div enquiry-block="${unique}" data-input-type="${data.input_type}" class="border mb-4 px-2 position-relative">
                        <div class="pt-2 form-group col-12 sdlms-text-primary-16px font-weight-bold">
							<div question-area="${unique}">
								<span data-question>${data.question || ''}</span>
								${components.helpTextTooltip(data.helptext)}
							</div>
                        </div>
                        <div class="form-group col-12">
                            <div class="row">
                                <div class="col-12 render-answer-field-area">
                                    <div render-answer-field-area="${unique}">
										${data.response || ''}
									</div> 
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
		}
		return components;
	}

	/**
	 * @author imshawan
	 * @function inputOnChange
	 * @description Handles the input change events of the dropdown list, while the user is selecting a different input field
	 * @param {String} id 
	 * @param {String} inputType 
	 */
	inputOnChange (id, inputType) {
		let $target = this.$builder,
			components = this.enquiryForm(),
			$that = this;

		if (inputType == 'dropdown' || inputType == 'multiselect') {
			$target.find(`[input-field-area="${id}"]`).empty().append('<label for="">Options</label>')
			.append(components.inputField({placeholder: 'Option 1', name: '1', id}));

			$target.find(`[input-field-btn="${id}"]`).empty().append(`<button class="btn btn-primary sdlms-btn" add-options-btn="${id}"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp; Option</button>`);
			$target.find(`[add-options-btn="${id}"]`).off('click').on('click', function (e) {
				e.preventDefault();
				let counter = $target.find(`[input-field-area="${id}"]`).find('input').length + 1;
				let name = counter;
				$target.find(`[input-field-area="${id}"]`).append(components.inputField({placeholder: 'Option ' + counter, name, id}));
			});
		} else if (inputType == 'textfield') {
			$target.find(`[input-field-btn="${id}"]`).empty();
			$target.find(`[input-field-area="${id}"]`).empty().append(components.textArea());
		} else if (inputType == 'datetime') {
			$target.find(`[input-field-btn="${id}"]`).empty();
			$target.find(`[input-field-area="${id}"]`).empty().append('<label>DateTime selector</label>')
			.append(components.dateTime({ unique: id, input_type: 'datetime-local' }));
		} else if (inputType == 'date') {
			$target.find(`[input-field-btn="${id}"]`).empty();
			$target.find(`[input-field-area="${id}"]`).empty().append('<label>Date selector</label>')
			.append(components.dateTime({ unique: id }));
		}
	}

	/**
	 * @author imshawan
	 * @function create
	 * @description Creates a new enquiry form, also allows the user to modify pre-created entries
	 * @param {Object} data 
	 */
	create(data = {}) {

		let $target = this.$builder,
			components = this.enquiryForm(),
			$that = this;

		$target.append(components.form(data));

		if (data && data.blocks) {
			$.each(data.blocks, function (index, item) {
				let unique = $that.unique();
				$target.find(`[appending-area]`).append(components.formItem({ ...item, unique }));
				if (item.helptext) {
					$target.find(`[helptext-area-id="${unique}"]`).addClass('d-flex');
				}

				if (item.input_type == 'dropdown' || item.input_type == 'multiselect') {
					if (!item.options) return alert('Invalid options! Error occured while parsing dropdown options');

					$target.find(`[input-field-area="${unique}"]`).empty().append('<label for="">Options</label>')
					$.each(item.options, function (index, option) {
						let name = Object.keys(option)[0];
						$target.find(`[input-field-area="${unique}"]`)
							.append(components.inputField({
								value: option[name],
								name,
								id: unique
							}));
					});
					$target.find(`[input-field-btn="${unique}"]`).empty()
						.append(`<button class="btn btn-primary sdlms-btn" add-options-btn="${unique}"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp; Option</button>`);
					$target.find(`[add-options-btn="${unique}"]`).off('click').on('click', function (e) {
						e.preventDefault();
						let counter = $target.find(`[input-field-area="${unique}"]`).find('input').length + 1;
						let name = counter;
						$target.find(`[input-field-area="${unique}"]`)
							.append(components.inputField({
								placeholder: 'Option ' + counter,
								name,
								id: unique
							}));
					});
				} else if (item.input_type == 'datetime') {
					$target.find(`[input-field-area="${unique}"]`).empty()
						.append(components.dateTime({ unique, input_type: 'datetime-local' }));
				} else if (item.input_type == 'textfield') {
					$target.find(`[input-field-area="${unique}"]`).empty()
						.append(components.textArea({ response: item.response }));
				} else if (item.input_type == 'date') {
					$target.find(`[input-field-area="${unique}"]`).empty().append(components.dateTime({ unique }));
				}

				$target.find(`[data-select-id="${unique}"]`).find(`[value="${item.input_type}"]`).attr('selected', 'selected');
			});
		} else {
			$target.find(`[appending-area=${$that.id}]`).append(components.formItem({label:true, input_type: 'textfield'}));
		}

		$target.on('click', '[data-delete-block]', function (e) {
			if ($('[data-delete-block]').length <= 1) {
				return alert('Cannot remove all the blocks');
			}
			if (confirm('Are you sure you want to delete this block?')) {
				$(this).parent().remove();
			}
		});

        $target.find('[data-select-id]').on('change', function (e) {
            e.preventDefault();
            let id = $(this).data('select-id');
            let inputType = $(this).val();
			$target.find(`[enquiry-block="${id}"]`).attr('data-input-type', inputType);
            $that.inputOnChange(id, inputType);
        });

		$target.on('click', '.add-help-text', function (e) {
			e.preventDefault();
			let unique = $(this).data('helptext-id');
			$target.find(`[helptext-area-id="${unique}"]`).addClass('d-flex');
		})
		$target.on('click', `[helptext-remove]`, function (e) {
			e.preventDefault();
			let unique = $(this).data('remove-id');
			$target.find(`[helptext-area-id="${unique}"]`).removeClass('d-flex').addClass('d-none')
			$target.find(`[helptext-area-id="${unique}"]`).find('[name="helptext"]').val('');
		})

        $target.find(`[addblock-btn="${$that.id}"]`).on('click', function (e) {
            e.preventDefault();
            $target.find(`[appending-area=${$that.id}]`).append(components.formItem({input_type: 'textfield'}));
            $target.find('[data-select-id]').on('change', function (e) {
                e.preventDefault();
                let inputType = $(this).val();
				let id = $(this).data('select-id');
				$target.find(`[enquiry-block="${id}"]`).attr('data-input-type', inputType);
              	$that.inputOnChange(id, inputType); 
            })
        });

		$target.on('click', '[data-delete-btn]', function (e) {
			let optId = $(this).data('delete-btn');

			if ($(`[data-delete-btn="${optId}"]`).length <= 1) {
				return alert('Cannot remove all the options');
			}
			$(this).parent().remove();
			
			// Re-Indexing
			$(`[input-field-area="${optId}"]`).find('input').each(function (i, el) {
				$(el).attr('placeholder', 'Option ' + (i + 1));
				$(el).attr('name', (i + 1));
			})
		});

	}

	/**
	 * @author imshawan
	 * @function answer
	 * @description Answers the enquiry form, contains the answering logic/mechanism for the enquiry form
	 * @param {Object} data 
	 */
	answer(data = {}) {
		let $that = this;
		let $target = this.$builder;
		let components = this.enquiryForm();
		$target.append(`
		<div class="m-3">
			<div class="row mt-2">
				<div class="form-group mb-3 w-100">
					<h5 form-title class="font-weight-bold">${data.title || ''}</h5>
				</div>

				<div class="w-100 mt-2" appending-area="${$that.id}">
					
				</div>
			</div>
		</div>
		`);

		if (data && data.blocks) {
			$.each(data.blocks, function (index, item) {
				let unique = $that.unique();
				$target.find(`[appending-area]`).append(components.responseFormItem({ ...item, unique }));
				if (item.input_type == 'dropdown') {
					$target.find(`[answering-field-area="${unique}"]`).empty()
					.append(`
							<select data-select-id="${unique}" style="font-size: 14px; min-width: 40%;" value="" name="input_type" class="sdlms-form-select mr-3">
								${components.dropDownOptions(item.options)}
							</select>
						`);
				} else if (item.input_type == 'textfield') {
					$target.find(`[answering-field-area="${unique}"]`).empty()
					.append(components.textArea({ response: item.response }));
				} else if (item.input_type == 'multiselect') {
					$target.find(`[answering-field-area="${unique}"]`).empty()
					.append(components.checkBoxes(item.options));
				} else if (item.input_type == 'datetime' || item.input_type == 'date') {
					if (item.input_type == 'datetime') {
						item.input_type = 'datetime-local';
					}
					$target.find(`[answering-field-area="${unique}"]`).empty()
					.append(components.dateTime(item));					
				}
			});
		} else {
			return alert('No data found');
		}
	}

	/**
	 * @author imshawan
	 * @function reader
	 * @description Reads the enquiry form and renders the form in an human-readable format, 
	 * contains the rendering logic for an answered enquiry form
	 * @param {Object} data 
	 */
	reader(data = {}) {
		
		let $that = this;
		let $target = this.$builder;
		let components = this.enquiryForm();

		if (data && data.blocks) {
			$target.append(`
			<div class="m-3">
				<div class="row mt-2">
					<div class="form-group mb-3 w-100">
						<h5 form-title class="font-weight-bold">${data.title + ' (response)' || ''}</h5>
					</div>
					<div class="w-100 mt-2" appending-area="${$that.id}"></div>
				</div>
			</div>
			`);
			$.each(data.blocks, function (index, item) {
				let unique = $that.unique();
				let response = !isNaN(item.response) ? item.responseRaw : item.response;

				if (!isNaN(Date.parse(response))) {
					if (item.input_type == 'datetime') {
						response = $that.dateFormatter({timestamp: response, datetime: true});
					} else {
						response = $that.dateFormatter({timestamp: response});
					}
				} else if (response && Array.isArray(response)) {
					response = '';
				}
				$target.find(`[appending-area]`).append(components.renderResponseFormItem({ ...item, unique, response }));
				if (item.input_type == 'multiselect') {
					let responses = [];
					$.each(item.response, function (index, option) {
						responses.push({ [option]: item.responseRaw[index] });
					});
					$target.find(`[render-answer-field-area="${unique}"]`).empty()
					.append(components.checkBoxes(responses));	
					$target.find(`[render-answer-field-area="${unique}"]`).find('input').each(function (i, el) {
						$(el).attr('disabled', true).attr('checked', true).css({ color: '#0029ff' });
					})
				}
			});
		} else {
			return alert('No data found');
		}

	}

	/**
	 * @author imshawan
	 * @function getMetaData
	 * @description Gets the meta data generated by the enquiry form (User input/formdata) and returns it as JSON
	 * @returns {Object}
	 */
	getMetaData() {
		let $that = this;
		let $target = this.$builder;
		let enquiryblocks = [];
		let requiresValidation = $that.requiresValidation;
		
		$.each($('[enquiry-block]'), function (i, el) {
			let data = {}
			let options = [];
			let inputType = $(el).attr('data-input-type');

			$(el).find('input').each(function (i, el) {
				if (el.name) {
					if (isNaN(el.name)) {
						data[el.name] = el.value;
					}
				}
			});
			$(el).find('select').each(function (i, el) {
				if (el.name) data[el.name] = el.value;
			});

			if (inputType == 'dropdown' || inputType == 'multiselect') {
				$(el).find('input').each(function (i, el) {
					if (el.name) {
						if (!isNaN(el.name)) {
							options.push({[el.name]: el.value});
						}
					}
				})
			} else if (inputType == 'textfield'){
				$(el).find('textarea').each(function (i, el) {
					if (el.name) data[el.name] = el.value ? String(el.value).trim() : '';
				})
			} else if (inputType == 'datetime' || inputType == 'date'){
				$(el).find('input').each(function (i, el) {
					if (el.name) data[el.name] = el.value;
				})
			}
			
			enquiryblocks.push({ ...data, options });
		})

		return {
			title: $target.find('[name="title"]').val(),
			blocks: enquiryblocks
		}
	}

	/**
	 * @author imshawan
	 * @function getFormResponses
	 * @description Returns the responses of the enquiry form (User input/formdata) as JSON
	 * @returns {Object}
	 */
	getFormResponses() {
		let $that = this;
		let $target = this.$builder;
		let responses = [];
		let requiresValidation = $that.requiresValidation;
		let errors = 0;

		if ($that.data.action == 'answer') {
			$.each($('[enquiry-block]'), function (i, el) {
				let data = {}
				data.question = $(el).find('[question-area]').find('[data-question]').text().trim();
				data.helptext = $(el).find('[question-area]').find('[data-helptext]').text().trim();
				let inputType = $(el).attr('data-input-type');

				if (inputType == 'dropdown'){
					data.response = $(el).find('select').val()
					data.responseRaw = $(el).find(`[value="${data.response}"]`).text();
					data.input_type = inputType;
				} else if (inputType == 'multiselect'){
					data.response = [];
					data.responseRaw = [];
					$.each($(el).find('[type="checkbox"]:checked'), function (i, el) {
						data.response.push($(el).attr('name'));
						data.responseRaw.push($(el).val());
						data.input_type = inputType;	
					})
				} else if(inputType == 'textfield') {
					data.response = $(el).find('textarea').val();
					data.input_type = inputType;
				} else if(inputType == 'datetime') {
					data.response = $(el).find('[type="datetime-local"]').val();
					data.responseRaw = new Date(data.response).getTime();
					data.input_type = inputType;
				} else if(inputType == 'date') {
					data.response = $(el).find('[type="date"]').val();
					data.responseRaw = new Date(data.response).getTime();
					data.input_type = inputType;
				}
				if (!data.response && requiresValidation) {
					$(el).addClass('border-danger');
					errors++;
				} else {
					$(el).removeClass('border-danger');
				}
				responses.push(data)
			})

			if (errors > 0) {
				// Can use any custom alert here
				return alert('All fields are required');
			} else {
				return {
					title: $target.find('[form-title]').text(),
					blocks: responses
				}
			}
		} else return {};

	}
}