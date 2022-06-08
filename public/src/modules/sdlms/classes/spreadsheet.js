/**
 * @author Deepansu
 * @date 04/2022
 * @description Allow user to build the spreadsheet based on @tid and @uid
 * @name Session as @name Topic
 * @returns @spreadSheet 
 */

/**
 * @var {class} spreadSheet
 * @description Contains the @methods or @function - to run the spreadSheet
 * @function spreadSheet.init
 * @function spreadSheet.unique
 * @function spreadSheet.log
 * @function spreadSheet.builder
 * @function spreadSheet.thread
 * @function spreadSheet.create
 */

 class spreadSheet {
	constructor(data = {}) {
		/**
		 * @author Deepansu
		 * @description Tid is required to init a thread builder
		 */

		if (!data.tid) {
			throw new Error("Invalid tid supplied");
		}
		this.tid = data.tid;
		this.data = data;
		this.assetId = data.assetId;
		this.data.with = this.restore() || data.with || {};
		console.log(this.data.with);
		var b = document.documentElement;
		b.setAttribute("data-useragent", navigator.userAgent);
		b.setAttribute("data-platform", navigator.platform);
		this.data.queue = 0;
		this.builder(this.data.target);
		// clear the existing events
		$(window).trigger('sdlms.asset.selection.change');
	}
	restore() {
		console.log('Restoring from local');
		if (!this.data.noDraft) {
			console.log('No Draft');
			return;
		}
		if (null != localStorage.getItem(`sp_draft_${this.tid}_${this.data.uid}`)) {
			if (localStorage.getItem(`sp_draft_${this.tid}_${this.data.uid}_unsaved`)) {
				$('#nav-student-thread-tab').append('<sup class="unsaved-changes">*</sup>');
			}
			let data = app.isParsableJSON(localStorage.getItem(`sp_draft_${this.tid}_${this.data.uid}`)) ? JSON.parse(localStorage.getItem(`sp_draft_${this.tid}_${this.data.uid}`)) : null;
			return data ? data : undefined;
		}
		return;
	}
	draft() {
		if (!this.data.noDraft) {
			if ($('#nav-student-thread-tab').find('.unsaved-changes').length) {
				localStorage.setItem(`sp_draft_${this.tid}_${this.data.uid}_unsaved`, true);
			}
			localStorage.setItem(`sp_draft_${this.tid}_${this.data.uid}`, JSON.stringify(this.getJSON()));
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

	unique(prefix = "") {
		var dt = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
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

	builder(target = "body") {

		this.id = this.unique("sdlms-spreadsheet-");
		let $that = this;
		let $target = $(target);
		if (!$target.length) {

			/**
			 * @author Deepansu
			 * @description Given target should be a valid HTML Element
			 */
			$that.log("No HTML element found For Builder Given ==>" + target);
			throw new Error(`No HTML element found while searching ${target}`);
		}
		$target.empty();
		$target.append(
			$("<sdlms-spreadsheet-builder>")
			.attr({
				id: $that.id,
				class: $that.data.noAction ? "sdlms-readonly" : ''
			})
			.append(`<div class="sdlms-asset-owner" style="display:${$that.data.name || "none"} " name="${$that.data.name}" ></div>`)
			.append(
				$("<form>").attr({
					id: "form-" + $that.id,
					class: 'sdlms-form-elements w-100 overflow-auto sdlms-spreadsheet-container ' + ($that.data.action == 'reader' ? 'readonly' : 'create'),
				})
			)
		);
		let $builder = $(`#form-${$that.id}`);
		$that.$builder = $builder;
		$that[$that.data.action == 'reader' ? 'reader' : 'create']($that.data.with);

	}

	/**
	 * @author Deepansu
	 * @date 12/2021
	 * @name create
	 * @type {function} 
	 * @description Append @spreadSheet to sdlms-thread-builder and attach all the events 
	 * @param {Object} data optional if @spreadSheet is initied with existing @spreadSheet then render it with Exisiting
	 */
	create(data = null) {

		let $target = this.$builder,
			$that = this;
		data.readonly = app.isParsableJSON(data.readonly) ? JSON.parse(data.readonly) : data.readonly;
		data.widths = app.isParsableJSON(data.widths) ? JSON.parse(data.widths) : data.widths;
		data.styles = app.isParsableJSON(data.styles) ? JSON.parse(data.styles) : data.styles;

		$that.spreadsheet = jspreadsheet($target[0], {
			minDimensions: [16, 16],
			data: data.data,
			updateTable: function (el, cell, x, y, source, value, id) {
				$.each((data.readonly || []), function (i, v) {
					if (x == v.x && y == v.y) {
						cell.classList.add('readonly');
					}
				});
			},
			onchange: function (instance, cell, x, y, value) {
				if (!$that.data.noEvents && $that.data.isBrodcaster && !$that.data.isListener) {
					let data = {
						x: x,
						y: y,
						value: value,
						tid: $that.tid,
						event: 'value_updated',
					}
					socket.emit('sdlms.spreadsheet.update', data, (err) => {
						console.log(err)
					});
				}

			},
			oninsertcolumn: function (instance, x, y) {
				if (!$that.data.noEvents && $that.data.isBrodcaster && !$that.data.isListener) {
					socket.emit('sdlms.spreadsheet.update', {
						event: 'column_added',
						x: x,
						y: y,
						tid: $that.tid
					}, (err) => {
						console.log(err)
					});
				}
			},
			oninsertrow: function (instance, x, y) {
				if (!$that.data.noEvents && $that.data.isBrodcaster && !$that.data.isListener) {
					socket.emit('sdlms.spreadsheet.update', {
						event: 'row_added',
						x: x,
						tid: $that.tid,
						y: y,
					}, (err) => {
						console.log(err)
					});
				}
			},
			ondeleterow: function (instance, x, y) {
				if (!$that.data.noEvents && $that.data.isBrodcaster && !$that.data.isListener) {
					socket.emit('sdlms.spreadsheet.update', {
						event: 'row_deleted',
						x: x,
						y: y,
						tid: $that.tid
					}, (err) => {
						console.log(err)
					});
				}
			},
			ondeletecolumn: function (instance, x, y) {
				if (!$that.data.noEvents && $that.data.isBrodcaster && !$that.data.isListener) {
					socket.emit('sdlms.spreadsheet.update', {
						event: 'column_deleted',
						x: x,
						y: y,
						tid: $that.tid
					}, (err) => {
						console.log(err)
					});
				}
			},
			oneditionend: function (instance, elem, x, y) {
				socket.emit('sdlms.spreadsheet.update', {
					event: 'cell_blured',
					x: x,
					tid: $that.tid,
					y: y,
				}, (err) => {
					console.log(err)
				});
			},
			oneditionstart: function (instance, elem, x, y) {
				let id = $(instance).prop('id');
				socket.emit('sdlms.spreadsheet.update', {
					event: 'cell_focused',
					x: x,
					y: y,
					tid: $that.tid,
					name: app.user.fullname || app.user.displayname || app.user.username,
					borderColor: app.user['icon:bgColor'],
				}, (err) => {
					console.log(err)
				});

			},
			contextMenu: function (obj, x, y, e) {

				var items = [];
				if (($that.data.isBrodcaster && !$that.data.isListener) || ($that.data.contextMenu)) {
					if (y == null) {
						// Insert a new column

						if (obj.options.allowInsertColumn == true) {
							items.push({
								title: obj.options.text.insertANewColumnAfter,
								onclick: function () {
									obj.insertColumn(1, parseInt(x), 0);
								}
							});
						}

						// Delete a column
						if (obj.options.allowDeleteColumn == true) {
							items.push({
								title: obj.options.text.deleteSelectedColumns,
								onclick: function () {
									obj.deleteColumn(obj.getSelectedColumns().length ? undefined : parseInt(x));
								}
							});
						}




					} else {
						// Insert new row
						if (obj.options.allowInsertRow == true) {

							items.push({
								title: obj.options.text.insertANewRowAfter,
								onclick: function () {
									obj.insertRow(1, parseInt(y));
								}
							});
						}

						if (obj.options.allowDeleteRow == true) {
							items.push({
								title: obj.options.text.deleteSelectedRows,
								onclick: function () {
									obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
								}
							});
						}
					}
					if (x && y) {
						let cell = getCell(x, y);
						items.push({
							title: cell.classList.value.includes('readonly') ? `Remove Readonly` : 'Make Readonly',
							onclick: function () {
								cell.classList.toggle('readonly');
								socket.emit('sdlms.spreadsheet.update', {
									event: cell.classList.value.includes('readonly') ? 'cell_locked' : 'cell_unlocked',
									x: x,
									tid: $that.tid,
									y: y,
								}, (err) => {
									console.log(err)
								});
							}
						});
					}
				}
				return items;
			},
			toolbar: this.toolbar() ,

		});
		if (data.widths && Array.isArray(data.widths)) {
			$.each(data.widths, function (i, v) {
				$that.spreadsheet.setWidth(i, v);
			})
		}
		if (data.styles) {
			console.log(data.styles)
			$that.spreadsheet.setStyle(data.styles);
		}
		$target.append(`<div class="col-12 d-flex justify-content-end"><svg width="25" height="26" cursor-pointer save-sp viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.303 0H2.75758C1.22712 0 0 1.3 0 2.88889V23.1111C0 24.7 1.22712 26 2.75758 26H22.0606C23.5773 26 24.8182 24.7 24.8182 23.1111V5.77778L19.303 0ZM12.4091 23.1111C10.1203 23.1111 8.27273 21.1756 8.27273 18.7778C8.27273 16.38 10.1203 14.4444 12.4091 14.4444C14.6979 14.4444 16.5455 16.38 16.5455 18.7778C16.5455 21.1756 14.6979 23.1111 12.4091 23.1111ZM16.5455 8.66667H2.75758V2.88889H16.5455V8.66667Z" fill="#323232"/></svg></div>`)

		if (!$that.data.noEvents && !$that.data.isBrodcaster && $that.data.isListener) {
			socket.on(`event:spreadsheet.update`, (data) => {
				console.log(data)
				let cell = getCell(data.x, data.y);
				switch (data.event) {
				case 'column_added':
					$that.spreadsheet.insertColumn(1, data.x, (data.y + 1), null)
					break;
				case 'row_added':
					$that.spreadsheet.insertRow(1, (data.x + 1), data.y, null)
					break;
				case 'row_deleted':
					$that.spreadsheet.deleteRow(data.x, data.y)
					break;
				case 'column_deleted':
					$that.spreadsheet.deleteColumn(data.x, data.y)
					break;
				case 'value_updated':
					$that.spreadsheet.setValueFromCoords(data.x, data.y, data.value, true)
					break
				case 'cell_locked':
					cell.classList.add('readonly');
					break
				case 'cell_unlocked':
					cell.classList.remove('readonly');
					break
				case 'cell_focused':
					let focusedElem = $($that.spreadsheet.el).find(`[data-x="${data.x}"][data-y="${data.y}"]`);
					focusedElem.addClass('sdlms-focus-cell').attr('data-username', data.name).css({
						borderColor: data.borderColor,
					})

					break
				case 'cell_blured':
					let bluredElem = $($that.spreadsheet.el).find(`[data-x="${data.x}"][data-y="${data.y}"]`);
					bluredElem.removeClass('sdlms-focus-cell').attr('data-username', '').css({
						borderColor: '#ccc transparent transparent #ccc',
					})
					break
				default:
					break;
				}
				save(!true);
			});
		}

		function getCell(x, y) {
			return $that.spreadsheet.getCellFromCoords(x, y);
		}

		function save(noti = true) {
			/**
			 * @author Deepansu
			 * @date 30-12-2021
			 * @description Making meta empty bcz we will read it when session tracker changes it's state
			 */

			var payload = {
				data: $that.getJSON(),
				tid: $that.tid,
				title: $that.topic,
			};
			payload.data.readonly = function () {
				var readonly = [];
				$($that.spreadsheet.el).find('.readonly').each(function (index, elem) {
					readonly.push({
						x: $(elem).data('x'),
						y: $(elem).data('y')
					})
				});
				return JSON.stringify(readonly);
			}
			// api.get("sdlms/tid/spreadSheet/id")
			/**
			 * @author Deepansu
			 * @description Make a request to Save/update @spreadSheet
			 */
			if (!$that.data.queue) {
				$that.data.queue = 1;
				require(['api'], function (api) {
					let request;
					let message = 'Saved Successfully';
					if ($that.data.id) {
						request = api['put'](`/sdlms/spreadsheet/${$that.data.id}`, payload);
						message = 'Updated Successfully';
					} else {
						request = api['post'](`/sdlms/spreadsheet`, payload);
					}

					$('#nav-student-thread-tab').find('.unsaved-changes').remove();
					request.then(r => {
						if (!$that.data.id) {
							if (typeof $that.data.onAdded == 'function') {
								$that.data.onAdded();
							}
						}
						$that.data.id = r.pid;
						if ($that.data.reload) {
							location.reload();
						}
					}).catch((e) => {
						console.log(e);
					}).finally(() => {
						$that.data.queue = 0;
					});
					if (noti) {
						notify(message, 'success');
					}

					localStorage.removeItem(`sp_draft_${$that.tid}_${$that.data.uid}_unsaved`)
					localStorage.setItem(`sp_draft_${$that.tid}_${$that.data.uid}`, null);
				})
			} else {
				// Plese Wait We are .... 
				notify('Please Wait', 'info');
			}

		}

		$target.find('[save-sp]').off('click').on('click', function () {
			save();
		})

		$that.data.autosave = isNaN($that.data.autosave) && $that.data.autosave > 30 ? 0 : $that.data.autosave;
		if ($that.data.autosave) {
			setInterval(() => {
				save(!true);
			}, ($that.data.autosave || 50) * 1000);
		}


		if ($that.data.addFeedbacks && $that.data.id) {
			if (typeof FeedBacks !== 'function') {
				return console.log("TB:: Please add Feedbacks JS.");
			}
			new FeedBacks($.extend({}, $that.data, {
				target: `#${$that.id}`,
				assetId: $that.data.id,
				type: 'tb'
			}));
		}



		$(window).on('beforeunload', () => {

			$that.draft();

		});

	}
	reader(data = null) {
		let $target = this.$builder;
		let $that = this;
		data.readonly = app.isParsableJSON(data.readonly) ? JSON.parse(data.readonly) : data.readonly;
		data.widths = app.isParsableJSON(data.widths) ? JSON.parse(data.widths) : data.widths;

		$that.spreadsheet = jspreadsheet($target[0], {
			minDimensions: [16, 16],
			data: data.data,
			updateTable: function (el, cell, x, y, source, value, id) {
				cell.classList.add('readonly');
			},
		});
		if (data.styles) $that.spreadsheet.setStyle(data.styles);
		if (data.widths && Array.isArray(data.widths)) {
			$.each(data.widths, function (i, v) {
				$that.spreadsheet.setWidth(i, v);
			})
		}
	}

	getJSON() {
		let $that = this;
		return {
			data: $that.spreadsheet.getJson(),
			readonly: [],
			styles: $that.spreadsheet.getStyle(),
			widths: JSON.stringify($that.spreadsheet.getWidth(0))
		}
	}
	toolbar() {
		return [{
				type: 'i',
				content: 'undo',
				onclick: function () {
					$that.spreadsheet.undo();
				}
			},
			{
				type: 'i',
				content: 'redo',
				onclick: function () {
					$that.spreadsheet.redo();
				}
			},
			{
				type: 'select',
				k: 'font-family',
				v: ["'Poppins', sans-serif", "'Open Sans', sans-serif"]
			},
			{
				type: 'select',
				k: 'font-size',
				v: ['9px', '10px', '11px', '12px', '13px', '14px', '15px', '16px', '17px', '18px', '19px', '20px']
			},
			{
				type: 'i',
				content: 'format_align_left',
				k: 'text-align',
				v: 'left'
			},
			{
				type: 'i',
				content: 'format_align_center',
				k: 'text-align',
				v: 'center'
			},
			{
				type: 'i',
				content: 'format_align_right',
				k: 'text-align',
				v: 'right'
			},
			{
				type: 'i',
				content: 'format_bold',
				k: 'font-weight',
				v: 'bold'
			},
			{
				type: 'color',
				content: 'format_color_text',
				k: 'color'
			},
			{
				type: 'color',
				content: 'format_color_fill',
				k: 'background-color'
			},
		];
	}
}