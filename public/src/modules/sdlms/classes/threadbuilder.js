/**
 * @author Deepansu
 * @date 12/2021
 * @description Allow user to build the threads based on @tid and @uid with update and private,public mode
 * @name Session as @name Topic
 * @returns @threadbuilder
 */

/**
 * @var {class} threadbuilder
 * @description Contains the @methods or @function - to run the threadbuilder
 * @function threadbuilder.init
 * @function threadbuilder.unique
 * @function threadbuilder.log
 * @function threadbuilder.builder
 * @function threadbuilder.thread
 * @function threadbuilder.create
 */

 class threadBuilder {
	constructor(data = {}) {
		/**
		 * @author Deepansu
		 * @description Tid is required to init a thread builder
		 */

		if (!data.tid) {
			throw new Error('Invalid tid supplied');
		}
		this.tid = data.tid;
		this.data = data;
		this.assetId = data.assetId;
		this.data.with = this.restore() || data.with || {};
		console.log(this.data.with);
		this.students = data.students || [];
		var b = document.documentElement;
		b.setAttribute('data-useragent', navigator.userAgent);
		b.setAttribute('data-platform', navigator.platform);
		this.data.queue = 0;
		this.builder(this.data.target);
		// clear the existing events
		$(window).trigger('sdlms.asset.selection.change');
	}

	restore() {
		if (this.data.noDraft) {
			console.log('No Draft Can not be Restored');
			return null;
		}
		if (localStorage.getItem(`tb_draft_${this.tid}_${this.data.uid}`) != null) {
			if (localStorage.getItem(`tb_draft_${this.tid}_${this.data.uid}_unsaved`)) {
				$('#nav-sdlms-thread-tab').append('<sup class="unsaved-changes">*</sup>');
			}
			const data = JSON.parse(localStorage.getItem(`tb_draft_${this.tid}_${this.data.uid}`));
			return data && data.threads ? data : null;
		}
	}

	draft() {
		if (!this.data.noDraft) {
			if ($('#nav-sdlms-thread-tab').find('.unsaved-changes').length) {
				localStorage.setItem(`tb_draft_${this.tid}_${this.data.uid}_unsaved`, true);
			}
			localStorage.setItem(`tb_draft_${this.tid}_${this.data.uid}`, JSON.stringify(this.getJSON()));
		}
	}
	/**
	 * @author Deepansu
	 * @date 12/2021
	 * @name unique
	 * @type {function}
	 * @description to get unique id
	 * @param {String} prefix optional identifier for generated unique id {prefix + id}
	 */

	unique(prefix = '') {
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
		});
		return prefix + uuid;
	}
	/**
	 * @author Deepansu
	 * @date 12/2021
	 * @name log
	 * @type {function}
	 * @description To Log
	 * @param {*} log
	 */

	log(log) {
		!this.data.log || console.log(log);
	}
	/**
	 * @author Deepansu
	 * @date 12/2021
	 * @name builder
	 * @type {function}
	 * @description Attach an  sdlms-thread-builder element
	 * @param {HTML ELEMENT} HTML element to render builder default body
	 */

	builder(target = 'body') {
		this.id = this.unique('sdlms-thread-');
		const $that = this;
		const $target = $(target);
		if (!$target.length) {
			/**
			 * @author Deepansu
			 * @description Given target should be a valid HTML Element
			 */
			$that.log('No HTML element found For Builder Given ==>' + target);
			throw new Error(`No HTML element found while searching ${target}`);
		}
		$target.empty();
		$target.append(
			$('<sdlms-thread-builder>')
				.attr({
					id: $that.id,
					class: $that.data.noAction ? 'sdlms-readonly' : '',
				})
				.append(`<div class="sdlms-asset-owner" style="display:${$that.data.name || 'none'} " name="${$that.data.name}" ></div>`)
				.append(
					$('<form>').attr({
						id: 'form-' + $that.id,
						class: 'sdlms-form-elements sdlms-threadbuilder-container ' + ($that.data.action == 'reader' ? 'readonly' : 'create'),
					})
				)
		);
		const $builder = $(`#form-${$that.id}`);

		var buider_sdlms_id = $that.data.tid + '_' + $that.data.uid + '_' + ($that.data.id || 'new');
		$builder.attr('sdlms-id', buider_sdlms_id);

		$that.$builder = $builder;
		$that[$that.data.action == 'reader' ? 'reader' : 'create']($that.data.with);
		socket.on('meta.live.joined', (data) => {
			if (data.tid == $that.tid) {
				const i = $that.students.findIndex(x => x.uid == data.uid);
				if (i == -1) {
					$that.students.push(data);
				}
			}
		});
	}
	/**
	 * @author Deepansu
	 * @date 12/2021
	 * @name thread
	 * @type {function}
	 * @description Returns Components of @threadbuilder
	 * @param {void()}
	 */

	thread() {
		const $that = this;
		const components = {
			header: () => ``,
			container: (thread = '') => ` <div class="sdlms-threads-container">${thread}</div>`,
			thread: (subthread = '', data = {}) => {
				data.summary = data.summary || {};

				/**
				 * @author Deepansu
				 * @description removing title as of now we dont need dynamic title
				 * */
				data.title = null;
				data.summary.title = null;
				data.credit = data.credit || {};
				return ` 
				<div class="sdlms-thread" thread>
					<div class="sdlms-thread-builder-thread sdlms-thread-builder-thread-header position-relative thread-color">
                	    <span class="sdlms-floating-left" collapse>
                	        <img onerror="${app.IMG_ERROR()}" onerror="${app.IMG_ERROR()}" src="https://sdlms.deepthought.education/assets/uploads/files/files/up-arrow-black-icon.svg" collapse-icon alt="" />
                	    </span>
                	    <div class="col-md-9 col-11 px-4 mx-auto d-flex align-items-center justify-content-between">
                	        <span class="sdlms-text-black-20px font-weight-medium" thread-name="title">${data.title || 'Thread <index>A</index>'}</span>
                	        <span class="font-weight-500 sdlms-text-black-17px" thread-name="duration"></span>
                	    </div>
                	    <svg remove-thread class="sdlms-floating-right" width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                	        <path
                	            d="M0.785714 12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111H0.785714V12.4444ZM2.35714 4.66667H8.64286V12.4444H2.35714V4.66667ZM8.25 0.777778L7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25Z"
                	            fill="#323232"
                	        />
                	    </svg>
                	</div>

					<div class="sdlms-thread-builder-thread-body col-md-11 mx-auto" collapse-body>
				     	<div subthreadcontainer class="sdlms-subthreads">
						 ${subthread}
						 </div>
						 <div class="sdlms-eagle-sub-thread-actions pt-4">
                             <button add-subthread type="button" class="sdlms-button button-primary button-md d-flex align-items-center">
                                 <svg width="10" height="10" viewBox="0 0 10 10" class="mr-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                                     <path d="M9.29703 4.13574V5.66504H0.525543V4.13574H9.29703ZM5.72867 0.400391V9.7168H4.10269V0.400391H5.72867Z" fill="white" />
                                 </svg>
                                 Sub thread
                             </button>
                         </div>
						 <div class="sdlms-summary" summary>
                            <div class="d-flex align-items-center flex-column pt-4 justify-content-between">
                                <div class="sdlms-floating-label"summary-title="name">${data.summary.title || 'Summary for Thread <index>A</index>'}</div>
                                <textarea class="form-control" name="content" placeholder="Enter Text Here" rows="3">${data.summary.content || ''}</textarea>
                            </div>
                        </div>
						   <div class="d-flex mt-4  align-items-start justify-content-between">
						   		<div class="d-flex align-items-center">
								   <div class="cursor-pointer sdlms-menu" thread-credit>
									   <div class="d-flex flex-column">
										   <div class="d-flex align-items-center mb-2"> <svg width="12" height="5" class="mr-2" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg">
												   <path d="M1.13994 2.5C1.13994 1.645 1.974 0.949997 3 0.949997H5.4V0H3C1.344 0 0 1.12 0 2.5C0 3.88 1.344 5 3 5H5.4V4.05H3C1.974 4.05 1.13994 3.355 1.13994 2.5ZM3.6 3H8.4V2H3.6V3ZM9 0H6.6V0.949997H9C10.026 0.949997 10.8601 1.645 10.8601 2.5C10.8601 3.355 10.026 4.05 9 4.05H6.6V5H9C10.656 5 12 3.88 12 2.5C12 1.12 10.656 0 9 0Z" fill="#323232" />
											   </svg>
											   <div class="sdlms-sub-text-tertiary-16px font-weight-500">Thread Credit</div>
											   <svg width="15" height="13" class="ml-2 cursor-pointer" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
												   <path d="M12.7062 1.42383L11.7084 0.464013C11.0653 -0.154671 10.0181 -0.154671 9.37499 0.464013L7.16518 2.58979L0 9.48252V12.687H3.33116L10.5376 5.75459L12.7062 3.66851C13.3575 3.04982 13.3575 2.04252 12.7062 1.42383ZM2.64673 11.1006H1.64908V10.1409L8.7896 3.27192L9.78726 4.23164L2.64673 11.1006ZM6.5963 12.687L9.89445 9.51427H14.8417V12.687H6.5963Z" fill="#0029FF" /></svg>
											   <div class="sdlms-menu-items" student-list></div>
										   </div>
										   <div class="d-flex align-items-center flex-column" thread-credited-user data-uid="${data.credit.uid}" data-fullname="${data.credit.fullname}" data-displayname="${data.credit.displayname}" data-picture="${data.credit.picture}" data-username="${data.credit.username}">
											   <img onerror="${app.IMG_ERROR()}" class="img-md border-2px-unset rounded-circle ${(data.credit.uid > 0) || 'd-none'}" src="${data.credit.picture}">
											   <span class="sdlms-sub-text-tertiary-16px font-weight-500 ${(data.credit.uid > 0) || 'd-none'}">${data.credit.fullname || data.credit.displayname || data.credit.username}</span>
										   </div>
									   </div>
								   </div>
					        	</div>
                                <select name="emotions"  value="${data.emotions || ''}" class="sdlms-form-select">
                                    <option value="">Select Emotion</option>
                                    <option value="eurekaEmphasis">Eureka Emphasis</option>
                                    <option value="blissfullyPuzzled">Blissfully Puzzled</option>
                                    <option value="spirituallyDetermined">Spiritually Determined</option>
                                    <option value="upsetandmotivated">Upset & Motivated</option>
                                </select>
                          </div>
					</div>
				</div>`;
			},
			subthread: (data = {}) => {
				const temp_id = $that.unique('thought-');
				/**
				 * @author Deepansu
				 * @description removing title as of now we dont need dynamic title
				 * */
				data.title = null;
				return `
				<div class="d-flex" subthread>
				<div class="col-6 pl-0">
					<div  class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
						<div class="sdlms-floating-label" subthread-name="title">${data.title || 'Sub Thread <index>A</index>'}
							<svg class="sdlms-floating-right" remove-subthread width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M0.785714 12.4444C0.785714 13.3 1.49286 14 2.35714 14H8.64286C9.50714 14 10.2143 13.3 10.2143 12.4444V3.11111H0.785714V12.4444ZM2.35714 4.66667H8.64286V12.4444H2.35714V4.66667ZM8.25 0.777778L7.46429 0H3.53571L2.75 0.777778H0V2.33333H11V0.777778H8.25Z"
									fill="#323232"
								/>
							</svg>
						</div>
						<textarea class="form-control" placeholder="Enter Text Here" name="content" rows="3">${data.content || ''}</textarea>
					</div>
					<div class="d-flex sdlms-subthread-actions pt-3 justify-content-end">
						<div class="sdlms-custom-radio-image" data-title="Eureka Moment" title-bottom>
							<input type="checkbox" ${!!!Number(data.eureka) || 'checked'} data-name="thoughts" data-group="eureka" name="thought-eureka" id="${temp_id}1">
							<label for="${temp_id}1">
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/eureka-moment.svg" inactive alt="" />
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/hover-eureka-moment.svg" hover alt="" />
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/selected-eureka-moment.svg" active alt="" />
							</label>
						</div>
						<div class="sdlms-custom-radio-image"data-title="Answers" title-bottom>
							<input type="checkbox" ${!!!Number(data.answer) || 'checked'} data-name="thoughts"  data-group="answer" name="thought-answer" id="${temp_id}2">
							<label for="${temp_id}2">
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/answer.svg" inactive alt="" />
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/hover-answer.svg" hover alt="" />
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/selected-answer.svg" active alt="" />
							</label>
						</div>
						<div class="sdlms-custom-radio-image"data-title="Questions" title-bottom>
							<input type="checkbox"  ${!!!Number(data.question) || 'checked'} data-name="thoughts" data-group="question"  name="thought-question" id="${temp_id}3">
							<label for="${temp_id}3">
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/question.svg" inactive alt="" />
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/hover-question.svg"  hover alt="" />
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/selected-question.svg" active alt="" />
							</label>
						</div>
						<div class="sdlms-custom-radio-image" data-title="Root of thought" title-bottom>
							<input type="checkbox"   ${!!!Number(data.root) || 'checked'} data-name="thoughts"  data-group="root" name="thought-root" id="${temp_id}4">
							<label for="${temp_id}4">
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/root-of-thought.svg" inactive alt="" />
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/hover-root-of-thought.svg" hover alt="" />
								<img onerror="${app.IMG_ERROR()}" src="${app.asset_url}/selected-root-of-thought.svg" active alt="" />
							</label>
						</div>
					</div>
				</div>

				<div class="col-6 pr-0">
					<div  class="d-flex flex-column align-items-center sdlms-floating-label-input mt-4 justify-content-between">
						<div class="sdlms-floating-label" interpretation-name="title">Sub Interpretation <index>1</index>	</div>
						<textarea class="form-control" placeholder="Enter Text Here" name="interpretation" rows="3">${data.interpretation || ''}</textarea>
					</div>
					<div class="d-flex pt-3 justify-content-end">
						<select name="category"  value="${data.category || ''}" class="sdlms-form-select mr-3">
							<option value="">Select Category</option>
							<option value="remark">Remark</option>
							<option value="subargument">Sub-argument</option>
							<option value="subexplanation">Sub-explanation</option>
							<option value="coreprinciple">Core-principle</option>
						</select>
						<select name="process" value="${data.process || ''}" class="sdlms-form-select">
							<option value="">Select Process</option>
							<option value="question">Question</option>
							<option value="analogy">Analogy</option>
							<option value="sarcasm">Sarcasm</option>
							<option value="insight">Insight</option>
							<option value="counterexample">Counter-Example</option>
						</select>
					</div>
				</div>
			</div>`;
			},
			action: (data = {}) => ` <div class="sdlms-threads-actions col-md-11 mx-auto d-flex justify-content-end">
				<button  type="button" data-thread="new" class="sdlms-button button-primary button-lg d-flex align-items-center">
					<svg width="10" height="10" viewBox="0 0 10 10" class="mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9.29703 4.13574V5.66504H0.525543V4.13574H9.29703ZM5.72867 0.400391V9.7168H4.10269V0.400391H5.72867Z" fill="white" />
					</svg>
					New Thread
				</button>
			</div>`,
			save: () => `<div class="sdlms-threads-actions mt-4  col-md-11 mx-auto d-flex justify-content-end">
				    <svg width="25" height="26" cursor-pointer save-thread-builder viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
				    	<path d="M19.303 0H2.75758C1.22712 0 0 1.3 0 2.88889V23.1111C0 24.7 1.22712 26 2.75758 26H22.0606C23.5773 26 24.8182 24.7 24.8182 23.1111V5.77778L19.303 0ZM12.4091 23.1111C10.1203 23.1111 8.27273 21.1756 8.27273 18.7778C8.27273 16.38 10.1203 14.4444 12.4091 14.4444C14.6979 14.4444 16.5455 16.38 16.5455 18.7778C16.5455 21.1756 14.6979 23.1111 12.4091 23.1111ZM16.5455 8.66667H2.75758V2.88889H16.5455V8.66667Z" fill="#323232"/>
				    </svg>
				</div>`,
		};
		return components;
	}

	/**
	 * @author Deepansu
	 * @date 12/2021
	 * @name create
	 * @type {function}
	 * @description Append @threabuilder to sdlms-thread-builder and attach all the events
	 * @param {Object} data optional if @threadbuilder is initied with existing @threadbuilder then render it with Exisiting
	 */
	create(data = null) {
		const $target = this.$builder;
		const components = this.thread();
		const $that = this;
		console.log(data);
		if (data && data.threads) {
			$target.append(components.header(data.meta));
			$target.append(components.container());
			const $container = $target.find('.sdlms-threads-container');
			$.each((data.threads || []), function (i, thread) {
				let subthread = '';
				$.each((thread.subthreads || []), function (ind, e) {
					subthread += components.subthread(e);
				});
				thread.summary = thread.summary || {};
				$container.append(components.thread(subthread, thread));
			});
			$target.append(components.action() + components.save());
		} else {
			$target.append(components.header());
			$target.append(components.container(components.thread(components.subthread())) + components.action() + components.save());
		}
		const ri = 0;
		function reIndex() {
			$target.find('[thread]').each(function () {
				const $this = $(this);
				const index = $(this).parent().children('[thread]').index(this);
				$this.find('index').text(app.numberToAlphabates(index + 1));
				$this.find('[subthreadcontainer] [subthread]').each(function () {
					const index = $(this).parent().children('[subthread]').index(this);
					console.log(index);
					$(this).find('index').text(index + 1);
				});
				const subthreads = $this.find('[subthreadcontainer] [subthread]').length;
				if (subthreads > 1) {
					$this.find('[remove-subthread]').show();
				} else {
					$this.find('[remove-subthread]').hide();
				}
			});
			const threads = $target.find('[thread]').length;
			if (threads > 1) {
				$target.find('[remove-thread]').show();
			} else {
				$target.find('[remove-thread]').hide();
			}
			$that.draft();
			$that.setIndexes();
			if ($that.tr) {
				$that.tr.events();
				$that.tr.track();
			}

			$target.attr('force-refresh', 1);
			if ($that.data.autosave)save(!1);
		}
		$target.on('click', '[save-thread-builder]', function (e, data) {
			$target.trigger('submit');
		});
		var [$submit, $newThread, $container] = [
			$target.find('button[type="submit"]'),
			$target.find('button[data-thread="new"]'),
			$target.find('.sdlms-threads-container'),
		];

		$target.find('.sdlms-thread [contenteditable]').keypress(function (e) {
			if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
		});
		if (localStorage.getItem(`tb_draft_${$that.tid}_${$that.data.uid}_unsaved`)) {
			$target.trigger('make:dirty');
		}
		/**
		 * @author Deepansu
		 * @description Remove the thread and their children [subthread]
		 */
		$target.on('click', '[remove-thread]', function () {
			$target.removeClass('sdlms-form-validated');
			if ($target.find('[thread]').length > 1) {
				$(this).parents('[thread]').first().remove();
				notify('Thread Removed', 'info');
				reIndex();
			} else {
				notify('Can not remove all Threads', 'info');
			}
		});
		/**
		 * @author Deepansu
		 * @description Add subthread to a thread
		 */
		$target.on('click', '[add-subthread]', function () {
			$target.removeClass('sdlms-form-validated');
			console.log('new');
			$(this).parents('.sdlms-thread-builder-thread-body').find('[subthreadcontainer]').append(components.subthread());
			reIndex();
		});
		/**
		 * @author Deepansu
		 * @description Remove subthread from a thread
		 */
		$target.on('click', '[remove-subthread]', function () {
			if ($(this).parents('[subthreadcontainer]').find('[subthread]').length > 1) {
				$target.removeClass('sdlms-form-validated');
				$(this).parents('[subthread]').first().remove();
				notify('Subthread Removed', 'info');
				reIndex();
			} else {
				notify('Can not remove all subthreads', 'info');
			}
		});
		$target.on('change','[data-name="thoughts"]',function(){
			 let parent = $(this).parents('[subthread]');
			 let textarea = parent.find('textarea[name="content"]');
			 if($(this).is(":checked")){
				let data = {
					index:parent.index(),
					content:textarea.val(),
					group:$(this).data('group'),
					tid:$that.tid,
					selected:$(this).is(":checked"),
					data:$(this).data()
				}
				socket.emit('sdlms.class.thought.selection',data);
			 }
		});
		$target.find('select').each(function () {
			$(this).val($(this).attr('value'));
		});

		function save(noti = true) {
			/**
			 * @author Deepansu
			 * @date 30-12-2021
			 * @description Making meta empty bcz we will read it when session tracker changes it's state
			 */

			var payload = $that.getJSON();
			console.log(payload);
			// api.get("sdlms/tid/threadbuilder/id")
			/**
			 * @author Deepansu
			 * @description Make a request to Save/update @threadbuilder
			 */
			if (!$that.data.queue) {
				$that.data.queue = 1;
				require(['api'], function (api) {
					let request;
					let message = 'Saved Successfully';
					if ($that.data.id) {
						request = api.put(`/sdlms/${$that.tid}/threadbuilder/${$that.data.id}`, payload);
						message = 'Updated Successfully';
					} else {
						request = api.post(`/sdlms/${$that.tid}/threadbuilder`, payload);
					}

					$('#nav-sdlms-thread-tab').find('.unsaved-changes').remove();
					request.then((r) => {
						if (!$that.data.id) {
							console.log(($that.data.onAdded == 'function'), typeof $that.data.onAdded);
							if (typeof $that.data.onAdded === 'function') {
								$that.data.onAdded();
							}
						}
						$that.data.id = r.pid || r._id;
						// socket.emit('meta.live.assetUpdate', $.extend({}, $that.data, {
						// 	id: $that.data.id,
						// 	with: payload,
						// 	type: 'tb'
						// }));
						var buider_sdlms_id = $that.data.tid + '_' + $that.data.uid + '_' + $that.data.id;
						$that.$builder.attr('sdlms-id', buider_sdlms_id);
					}).catch((e) => {
						console.log(e);
					}).finally(() => {
						$that.data.queue = 0;
					});
					if (noti) {
						notify(message, 'success');
					}

					localStorage.removeItem(`tb_draft_${$that.tid}_${$that.data.uid}_unsaved`);
					localStorage.setItem(`tb_draft_${$that.tid}_${$that.data.uid}`, null);
				});
			} else {
				// Plese Wait We are ....
				console.log('Please wait');
				notify('Please Wait', 'info');
			}
		}
		/**
		 * @author Deepansu
		 * @description Add new thread to @threadbuilder
		 */
		$newThread.off('click').on('click', function () {
			console.log($container);
			$target.removeClass('sdlms-form-validated');
			$container.append(components.thread(components.subthread()));
			setStudentforCredits();
			reIndex();
		});
		/**
		 * @author Deepansu
		 * @description Save @threadbuilder
		 */
		$target.on('submit', function (e, data = {}) {
			if ($that.data.noAction) {
				alert('Sorry! You can not modify.');
				return;
			}
			e.preventDefault();
			if ($(this).find(':invalid').length) {
				return notify('Fields with Errors are not allowed', 'error');
			}
			save();
		});
		$that.data.autosave = (isNaN($that.data.autosave) || $that.data.autosave < 30) ? 0 : $that.data.autosave;
		if ($that.data.autosave) {
			setInterval(() => {
				if ($that.dirty) {
					save(!true);
					// notify('Threadbuilder auto Save', 'info');
				} else {
					console.log('No changes');
				}
			}, ($that.data.autosave || 120) * 1000);
		}
		reIndex();
		$target.find('[thread]').first().find('[collapse-subthread]').trigger('click');
		$submit.on('click', function () {
			if ($that.data.noAction) {
				alert('Sorry! You can not modify.');
				return;
			}
			$target.addClass('sdlms-form-validated');
			$target.find(':invalid').each(function () {
				if ($(this).parents('[subthreadcontainerwithclosure]').length) {
					if (!$(this).parents('[subthreadcontainerwithclosure]').is(':visible')) {
						$(this).parents('[thread]').find('[collapse-subthread]').trigger('click');
					}
				}
			});
			try {
				$target.find(':invalid').focus();
			} catch (error) {
				console.error('Element is hidden so can not focus');
			}
		});
		if ($that.data.addFeedbacks && $that.data.id) {
			console.log('inited feedbacks');
			if (typeof FeedBacks !== 'function') {
				return console.log('TB:: Please add Feedbacks JS.');
			}
			new FeedBacks($.extend({}, $that.data, {
				target: `#${$that.id}`,
				assetId: $that.data.id,
				type: 'tb',
			}));
		}
		$target.dirrty();
		$target.on('dirty', function () {
			console.log(this, 'is Dirty');
			$that.dirty = true;
			$('#nav-sdlms-thread-tab').find('.unsaved-changes').remove();
			$('#nav-sdlms-thread-tab').append('<sup class="unsaved-changes">*</sup>');
		});
		$target.on('clean', function () {
			console.log(this, 'is clean');
			// if($that.restore()) return;
			$that.dirty = !true;
			localStorage.removeItem(`tb_draft_${$that.tid}_${$that.data.uid}_unsaved`);
			$('#nav-sdlms-thread-tab').find('.unsaved-changes').remove();
		});

		function setStudentforCredits() {
			$target.find('[student-list]').empty();
			$.each($that.students, function (index, student) {
				$target.find('[student-list]').append(`
						 <a class="dropdown-item sdlms-menu-item add-thread-credit" data-uid="${student.uid}" data-picture="${student.picture}" data-username="${student.username}" data-fullname="${student.fullname}" data-displayname="${student.displayname}" href="#">
							 <img onerror="${app.IMG_ERROR()}" src="${student.picture}" class="img-small rounded-circle mr-2"> <span>${student.fullname || student.displayname || student.username}</span>
						</a>
				`);
			});
			if ($that.students.length) {
				$target.find('[student-list]').append(`
					<a class="dropdown-item sdlms-menu-item add-thread-credit" data-uid="0"  href="#">
				  			 <span class="text-center w-100 mt-1 pt-2 d-flex justify-content-center border-top">Remove Credit</span>
					</a>
				`);
			}
		}
		setStudentforCredits();
		$target.on('click', '.add-thread-credit', function (e) {
			const student = $that.students.find(e => e.uid == $(this).data('uid'));
			const $ele = $(this).parents('[thread-credit]').find('[thread-credited-user]');
			$ele.empty();
			$.each($ele.data(), function (i) {
				$ele.data(i, null);
			});
			if (student) {
				$ele.html(`<img onerror="${app.IMG_ERROR()}" src="${student.picture}" class="img-md border-2px-unset rounded-circle"> <span class="sdlms-sub-text-tertiary-16px font-weight-500">${student.fullname || student.displayname || student.username}</span>`).data(student);
			}
			$that.draft();
			$target.trigger('make:dirty');
		});
		$(window).on('beforeunload', () => {
			$that.draft();
			save(!true);
			// notify('ThreadBuilder Saved as draft', 'info');
		});
		if (!$that.data.noTracking) {
			console.log('inited tracking');
			$that.tr = new tracker($.extend({}, $that.data, {
				target: $target,
				event: 'session_tracking',
				asset_type: 'tb',
				key: $that.tid,
			}));
			$that.tr.events();
		}
		$that.setIndexes();
	}

	thoughts(thought) {
		let url = '';
		let title = '';
		switch (Number(thought)) {
			case 1:
				url = app.asset_url + '/eureka-moment.svg';
				title = 'Eureka Moment';
				break;
			case 2:
				url = app.asset_url + '/answer.svg';
				title = 'Answers';
				break;
			case 3:
				url = app.asset_url + '/question.svg';
				title = 'Questions';
				break;
			case 4:
				url = app.asset_url + '/root-of-thought.svg';
				title = 'Root of Thought';
				break;
			default:
				break;
		}

		return `<span data-title="${title}" title-bottom><img onerror="${app.IMG_ERROR()}" src="${url}"></span>`;
	}

	_reader() {
		const $that = this;
		const components = {
			header: (data = {}) => ``,
			container: (thread = '') => ` <div class="sdlms-threads-container">${thread}</div>`,
			thread: (subthread = '', data = {}) => ` 

				<div class="sdlms-thread" thread>
				 <div class="sdlms-thread-builder-thread thread-color sdlms-thread-builder-thread-header position-relative thread-color">
					<span class="sdlms-floating-left" collapse>
						<img onerror="${app.IMG_ERROR()}" src="https://sdlms.deepthought.education/assets/uploads/files/files/up-arrow-black-icon.svg" collapse-icon alt="" />
					</span>
					<div class="col-11 mx-auto d-flex align-items-center justify-content-between">
						<span class="sdlms-text-black-20px font-weight-medium" thread-name="title">${data.title || 'Thread <index>A</index>'}</span>
						<span class="font-weight-500 sdlms-text-black-17px">${Number(data.duration) || ''}</span>
					</div>
				</div>
				<div class="sdlms-eagle-thread-body col-11 mx-auto" summary collapse-body>
					<div class="sdlms-subthreads"  target="show-more">
						<div class="d-flex align-items-center pt-3 justify-content-between">
							<p name="content" content class="text-ellipse-4">
							${app.processString(data.summary.content)}
							</p>
						</div>
						<div class="sdlms-threads-actions mx-auto d-flex justify-content-end">
							<a show-more class="d-flex align-items-center sdlms-text-tertiary-14px font-weight-500">
								See more
							</a>
						</div>
					</div>
					<div class="d-flex mt-3 justify-content-between align-items-start">
					<div class="d-flex align-items-center">
					   <div class="cursor-pointer">
						   <div class="d-flex flex-column">
							   <div class="d-flex align-items-center mb-2"> <svg width="12" height="5" class="mr-2" viewBox="0 0 12 5" fill="none" xmlns="http://www.w3.org/2000/svg">
									   <path d="M1.13994 2.5C1.13994 1.645 1.974 0.949997 3 0.949997H5.4V0H3C1.344 0 0 1.12 0 2.5C0 3.88 1.344 5 3 5H5.4V4.05H3C1.974 4.05 1.13994 3.355 1.13994 2.5ZM3.6 3H8.4V2H3.6V3ZM9 0H6.6V0.949997H9C10.026 0.949997 10.8601 1.645 10.8601 2.5C10.8601 3.355 10.026 4.05 9 4.05H6.6V5H9C10.656 5 12 3.88 12 2.5C12 1.12 10.656 0 9 0Z" fill="#323232" />
								   </svg>
								   <div class="sdlms-sub-text-tertiary-16px font-weight-500">Thread Credit</div>
							   </div>
							   <div class="d-flex align-items-center flex-column" thread-credited-user data-uid="${data.credit.uid}" data-fullname="${data.credit.fullname}" data-displayname="${data.credit.displayname}" data-picture="${data.credit.picture}" data-username="${data.credit.username}">
								   <img onerror="${app.IMG_ERROR()}" class="img-md border-2px-unset rounded-circle ${!isNaN(data.credit.uid) || 'd-none'}" src="${data.credit.picture}">
								   <span class="sdlms-sub-text-tertiary-16px font-weight-500 ${!isNaN(data.credit.uid) || 'd-none'}">${data.credit.fullname || data.credit.displayname || data.credit.username}</span>
							   </div>
						   </div>
					   </div>
					</div>
					<select name="emotions"  value="${data.emotions || ''}" class="sdlms-form-select">
						<option value="">Select Emotion</option>
						<option value="eureka">Eureka</option>
						<option value="emphasis">Emphasis</option>
						<option value="blissfully">Blissfully</option>
						<option value="puzzled">Puzzled</option>
						<option value="spiritually">Spiritually</option>
						<option value="determined">Determined</option>
						<option value="upsetandmotivated">Upset & Motivated</option>
					</select>
		       </div>
					<div subthreadcontainer class="sdlms-subthreads mt-3">
				     	${subthread}
					</div>
				</div>
			</div>`,
			subthread: (data = {}, index = 1) => `
				<div class="sdlms-thread" subthread>
				<div class="sdlms-thread-builder-thread subthread-header sdlms-thread-builder-thread-header position-relative thread-color">
					<div class="col-12 mx-auto d-flex align-items-center justify-content-between">
						<span class="sdlms-text-black-20px font-weight-medium">${data.title || 'Example <index>1</index>'}</span>
					</div>
				</div>
				<div class="sdlms-eagle-thread-body col-12 pr-0 mx-auto">
					<div class="sdlms-subthreads"  target="show-more">
						<div class="d-flex align-items-center pt-3 justify-content-between">
							<p content  name="content" class="text-ellipse-4">
							 ${app.processString(data.content)}
							</p>
						</div>
						<div class="sdlms-threads-actions mx-auto d-flex justify-content-end">
							<a show-more class="d-flex align-items-center sdlms-text-tertiary-14px font-weight-500">
								See more
							</a>
						</div>
						<div class="d-flex pt-3 read-thoughts">
							${Number(data.eureka) ? $that.thoughts(1) : ''}
							${Number(data.answer) ? $that.thoughts(2) : ''}
							${Number(data.question) ? $that.thoughts(3) : ''}
							${Number(data.root) ? $that.thoughts(4) : ''}
						</div>
					</div>
				</div>
			</div>

			<div class="sdlms-thread">
			<div class="sdlms-thread-builder-thread  subthread-header sdlms-thread-builder-thread-header position-relative thread-color">
				<div class="col-12 mx-auto d-flex align-items-center justify-content-between">
					<span class="sdlms-text-black-20px font-weight-medium">${data.interpretation_title || 'Sub Interpretation <index>1</index>'}</span>
				</div>
			</div>
			<div class="sdlms-eagle-thread-body pr-0 col-12 mx-auto">
				<div class="sdlms-subthreads"  target="show-more">
					<div class="d-flex align-items-center pt-3 justify-content-between">
						<p name="interpretation" content class="text-ellipse-4">
						 ${app.processString(data.interpretation)}
						</p>
					</div>
					<div class="sdlms-threads-actions mx-auto d-flex justify-content-end">
						<a show-more class="d-flex align-items-center sdlms-text-tertiary-14px font-weight-500">
							See more
						</a>
					</div>
					<div class="d-flex pt-3">
						<select name="category"  value="${data.category || ''}" class="sdlms-form-select mr-3">
							<option value="">Select Category</option>
							<option value="remark">Remark</option>
							<option value="subargument">Sub-argument</option>
							<option value="subexplanation">Sub-explanation</option>
							<option value="coreprinciple">Core-principle</option>
						</select>
						<select name="process" value="${data.process || ''}" class="sdlms-form-select">
							<option value="">Select Process</option>
							<option value="question">Question</option>
							<option value="analogy">Analogy</option>
							<option value="sarcasm">Sarcasm</option>
							<option value="insight">Insight</option>
							<option value="counterexample">Counter-Example</option>
						</select>
				</div>
				</div>
			</div>
		</div>
				`,
			time: time =>
				// time = time.split(":");
				// return Number(time[0]) * 60 + Number(time[1]) || 10;
				 time
			,
		};
		return components;
	}

	getJSON() {
		var $target = this.$builder;
		var $that = this;
		var _threadBuilder = {};
		_threadBuilder.meta = {};
		_threadBuilder.threads = [];

		/**
		 * @author Shubham Bawner
		 * @date 16/03/2022
		 * @description sub thread stats to store subthreads that are questions, answers, etc
		 */
		var TBstats = {
			question: [],
			answer: [],
			eureka: [],
			root: [],
			remark: [],
			process: [],
		};

		$target.find('[thread]').each(function () {
			const _thread = {};
			_thread.subthreads = [];
			_thread.id = $(this).index() + 1;
			_thread.title = app.processString($(this).find('[thread-name="title"]').text());
			_thread.duration = app.processString($(this).find('[thread-name="duration"]').text());
			_thread.emotions = app.processString($(this).find('[name="emotions"]').val());
			_thread.summary = {};
			_thread.credit = $(this).find('[thread-credited-user]').data() || {};
			_thread.summary.content = app.processString($(this).find('[summary] [name="content"]').val());
			_thread.summary.title = app.processString($(this).find('[summary] [summary-title="name"]').text());
			$(this)
				.find('[subthread]')
				.each(function () {
					const subthread = {};
					subthread.id = `${_thread.id}-${$(this).index() + 1}`;
					subthread.title = app.processString($(this).find('[subthread-name="title"]').text());
					subthread.interpretation_title = app.processString($(this).find('[interpretation-name="title"]').text());
					subthread.content = app.processString($(this).find('[name="content"]').val());
					subthread.interpretation = app.processString($(this).find('[name="interpretation"]').val());
					subthread.category = app.processString($(this).find('[name="category"]').val());
					subthread.process = app.processString($(this).find('[name="process"]').val());
					subthread.eureka = $(this).find('[name="thought-eureka"]').is(':checked') ? 1 : 0;
					subthread.answer = $(this).find('[name="thought-answer"]').is(':checked') ? 1 : 0;
					subthread.question = $(this).find('[name="thought-question"]').is(':checked') ? 1 : 0;
					subthread.root = $(this).find('[name="thought-root"]').is(':checked') ? 1 : 0;
					_thread.subthreads.push(subthread);

					if (subthread.eureka) TBstats.eureka.push(subthread.id);
					if (subthread.answer) TBstats.answer.push(subthread.id);
					if (subthread.question) TBstats.question.push(subthread.id);
					if (subthread.root) TBstats.root.push(subthread.id);
					if (subthread.category == 'remark') TBstats.remark.push(subthread.id);
					if (subthread.process) TBstats.process.push(subthread.id);
				});
			_threadBuilder.threads.push(_thread);
		});

		let string = '';
		$target.find('textarea, input:not([type="checkbox"],[type="radio"])').each(function () {
			string += $(this).val().replace(/[\r\n\s\x0B\x0C\u0085\u2028\u2029]+/g, ' ') + ' ';
		});
		string = string.replace(/[\r\n\s\x0B\x0C\u0085\u2028\u2029]+/g, ' ');
		string = $.trim(string);
		const stats = {
			timestamp: new Date().getTime(),
			count: {
				characters: string.length,
				words: string.split(' ').length,
				threads: _threadBuilder.threads.length,
			},
			...TBstats,
		};
		const payload = {
			threads: _threadBuilder.threads,
			stats: stats,
		};
		return payload;
	}

	setIndexes() {
		var $target = this.$builder;

		$target.find('[thread]').each(function () {
			$(this).find('[thread-name="title"]').attr('sdlms-id', `sdlms-thread-title-${$(this).index()}`);
			$(this).find('[name="emotions"]').attr('sdlms-id', `sdlms-thread-emotions-${$(this).index()}`);
			$(this).find('[thread-credited-user]').attr('sdlms-id', `sdlms-thread-credited-user-${$(this).index()}`);
			$(this).find('[summary] [name="content"]').attr('sdlms-id', `sdlms-thread-summary-content-${$(this).index()}`);
			$(this).find('[summary] [summary-title="name"]').attr('sdlms-id', `sdlms-thread-summary-title-${$(this).index()}`);

			$(this)
				.find('[subthread]')
				.each(function () {
					$(this).find('[subthread-name="title"]').attr('sdlms-id', `sdlms-subthread-title-${$(this).index()}`);
					$(this).find('[interpretation-name="title"]').attr('sdlms-id', `sdlms-subthread-interpretation-title-${$(this).index()}`);
					$(this).find('[name="content"]').attr('sdlms-id', `sdlms-subthread-content-${$(this).index()}`);
					$(this).find('[name="interpretation"]').attr('sdlms-id', `sdlms-subthread-interpretation-${$(this).index()}`);
					$(this).find('[name="category"]').attr('sdlms-id', `sdlms-subthread-category-${$(this).index()}`);
					$(this).find('[name="process"]').attr('sdlms-id', `sdlms-subthread-process-${$(this).index()}`);
					$(this).find('[name="thought-eureka"]').attr('sdlms-id', `sdlms-subthread-eureka-${$(this).index()}`);
					$(this).find('[name="thought-answer"]').attr('sdlms-id', `sdlms-subthread-answer-${$(this).index()}`);
					$(this).find('[name="thought-question"]').attr('sdlms-id', `sdlms-subthread-question-${$(this).index()}`);
					$(this).find('[name="thought-root"]').attr('sdlms-id', `sdlms-subthread-root-${$(this).index()}`);
				});
		});
	}
	/**
	 * @author Deepansu
	 * @date 15/02/2022
	 * @name reader
	 * @type {function}
	 * @description Append @threabuilder to sdlms-thread-builder read mode
	 * @param {Object} data Required if @threadbuilder is initied with existing @threadbuilder then render it with Exisiting
	 */

	reader(data) {
		if (!data.threads) {
			return;
		}
		const $target = this.$builder;
		const _threabuilder = this._reader();
		const $that = this;
		$('.sdlms-modified-asset').remove();
		if (data && data.threads) {
			$target.append(_threabuilder.container(_threabuilder.header(data.meta)));
			const $container = $target.find('.sdlms-threads-container');
			$container.addClass('readonly');
			$.each((data.threads || []), function (i, thread) {
				let subthread = '';
				$.each((thread.subthreads || []), function (ind, e) {
					subthread += _threabuilder.subthread(e);
				});
				$container.append(_threabuilder.thread(subthread, thread));
			});
		}
		$target.find('[show-more]').off('click').on('click', function () {
			$(this).parents('[target="show-more"]').find('[content]').toggleClass('text-ellipse-4');
			if ($.trim($(this).text()).toLowerCase() == 'see more') $(this).text('See less');
			else $(this).text('See more');
		});

		$target.find('select').each(function () {
			$(this).val($(this).attr('value'));
		});
		if ($that.data.addFeedbacks && $that.data.id) {
			console.log('inited feedbacks');
			new FeedBacks($.extend({}, $that.data, {
				target: `#${$that.id}`,
				assetId: $that.data.id,
				type: 'tb',
			}));
		}
		$that.setIndexes();
		// Clear any exsiting interval
	}
}
