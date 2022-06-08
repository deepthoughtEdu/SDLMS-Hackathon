
/**
 * @var {class} Article
 * @description Contains the @methods or @function - to run the threadbuilder
 * @function article.init
 * @function article.unique
 * @function article.log
 * @function article.builder
 * @function article.create
 */

 class Article {
	constructor(data = {}) {
		/**
		 * @author Deepansu
		 * @description Tid is required to init a thread builder
		 */

		if (!data.tid) {
			throw new Error("Invalid tid supplied");
		}
		this.tid = data.tid;
		this.redirectUri = '/articleshome/articles/view';
		this.data = data;
		this.assetId = data.assetId;
		this.pid = data.with ? data.with.pid : 1;
		// this.data.with = this.restore() || data.with || {};
		this.data.with = data.with || {};
		this.richTextMenubar = data.richTextMenubar || false;

		var b = document.documentElement;
		b.setAttribute("data-useragent", navigator.userAgent);
		b.setAttribute("data-platform", navigator.platform);
		this.data.queue = 0;
		this.builder(this.data.target);
	}
	restore() {
		console.log('Restoring from local');
		if (null != localStorage.getItem(`ar_draft_${this.pid}_${this.data.uid}`)) {
			if (localStorage.getItem(`ar_draft_${this.pid}_${this.data.uid}_unsaved`)) {
				$('#nav-student-thread-tab').append('<sup class="unsaved-changes">*</sup>');
			}
			return JSON.parse(localStorage.getItem(`ar_draft_${this.pid}_${this.data.uid}`));
		}
		return;
	}
	draft() {
		if ($('#nav-student-thread-tab').find('.unsaved-changes').length) {
			localStorage.setItem(`ar_draft_${this.pid}_${this.data.uid}_unsaved`, true);
		}
		localStorage.setItem(`ar_draft_${this.pid}_${this.data.uid}`, JSON.stringify(this.getJSON()));
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

	getWordCount () {
		return tinymce.activeEditor.plugins.wordcount.getCount();
	}

	getJSON () {
		let $target =  this.$builder;
		var ArticleObj = {}

		$target.serializeArray().reduce(function (obj, item) {
			return ArticleObj[item.name] = item.value;
		}, {});

		return ArticleObj;
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
	 * @description Attach an  sdlms-article-builder element
	 * @param {HTML ELEMENT} HTML element to render builder default body 
	 */

	builder(target = "body") {

		this.id = this.unique("sdlms-article-");
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
			$("<sdlms-article-builder>")
			.attr({
				id: $that.id,
				class: $that.data.noAction ? "sdlms-readonly" : ''
			})
			.append(`<div class="sdlms-asset-owner" style="display:${$that.data.name || "none"} " name="${$that.data.name}" ></div>`)
			.append($that.data.action != 'reader' ?
				$("<form>").attr({
					id: "form-" + $that.id,
					novalidate: true,
					class: 'row sdlms-article-container border m-3 create p-3 sdlms-article-container needs-validation ' + ($that.data.action == 'reader' ? 'readonly' : 'create'),
				}).css({
					boxShadow: '0 1rem 1rem -0.625rem rgb(34 47 62 / 15%), 0 0 2.5rem 1px rgb(34 47 62 / 15%)',
				}).append(`<style>
				#form-${$that.id} label {
					font-weight: 600;
				}
				</style>`) : ''
			)
		);
		let $builder = $(`#form-${$that.id}`);
		$that.$builder = $builder;
		$that[$that.data.action == 'reader' ? 'reader' : 'create']($that.data.with);

	}
	/**
	 * @author imshawan 
	 * @description Article creator form
	 */
	article() {
        let $that = this;
		let components = {
			form: function (data) {
				return `<div class="form-group mb-3 col-12">
                <label for="">Title</label>
                <input style="text-align: left;" required value="${data.title || ''}"  name="title" type="text" class="form-control">
            </div>

            <div class="form-group mb-3 col-12">
                <label for="">Content</label>
                <textarea content-area-id="${$that.id}" required name="content" style="text-align: left;" id="" class="form-control" rows="5">${data.content || ''}</textarea>
            </div>

			<div class="form-group mb-3 col-12 col-md-6">
                <label for="">Category</label>
                <select name="cid"  value="${data.cid || 0}" data-value="${data.cid || 0}" data-attached="subcategory" class="form-control">
                    <option value="">-- Select --</option>
                </select>
            </div>
            
            <div class="form-group mb-3 col-12 col-md-6">
                <label for="">Sub Category</label>
                <select name="sub_cid" value="${data.sub_cid || 0}" data-value="${data.sub_cid || 0}" data-parent="category" class="form-control">
                    <option value="">-- Select --</option>
                </select>
            </div>

			<div class="form-group mb-3 col-12 col-md-6">
                <label for="">Thumbnail</label>
				<div class="input-group">
					<div class="custom-file">
						<input type="file" class="custom-file-input form-control" name="files[image]" id="thumb-${$that.id}"
						aria-describedby="inputGroupThumb">
						<label class="custom-file-label" for="thumb-${$that.id}">Choose file</label>
					</div>
				</div>
            </div>

            <div class="form-group  mb-3 col-12 col-md-6">
            <label for="">Thought Process</label>
                <select name="tp"  value="${data.tp || 0}" data-value="${data.tp || 0}" class="form-control">
                    <option value="">-- Select --</option>
                    <option value="1">${$that.thoughts(1)}</option>
                    <option value="2">${$that.thoughts(2)}</option>
                    <option value="3">${$that.thoughts(3)}</option>
                    <option value="4">${$that.thoughts(4)}</option>
                    <option value="5">${$that.thoughts(5)}</option>
                </select>
            </div>
            <div class="form-group  mb-3 col-12 d-flex justify-content-between">
				<div class="my-auto">
					${data.status ? `<span>  
										${data.status == 'draft' ? 
										`Saved ${data.status.charAt(0).toUpperCase() + data.status.slice(1)} <i class="fa fa-check"></i>` : 
										`<a href="${$that.redirectUri}/${data.pid}" target="_blank">${data.status.charAt(0).toUpperCase() + data.status.slice(1)} <i class="fa fa-check"></i></a>`}
									 </span>` : ''}
				</div>

				<div>
					<button id="save-draft-${$that.id}" class="sdlms-button btn button-primary mr-2">
						<i class='fa fa-save'></i> &nbsp; Save draft
					</button>

					<button type="submit" class="sdlms-button btn button-primary">
						<i class='fa fa-cloud-upload'></i> &nbsp; Publish
					</button>
				</div>
			</div>
        `
			}
		}
		return components;
	}
	/**
	 * @author imshawan
	 * @date 12/2021
	 * @name create
	 * @type {function} 
	 * @description Append @Article to sdlms-article-builder and attach all the events 
	 * @param {Object} data optional if @Article is initied with existing @Article then render it with Exisiting
	 */
	create(data = null) {

		let $target = this.$builder,
			components = this.article(),
			$that = this;
		$that.categories = [];
		$target.append(components.form(data));

		$(`#thumb-${$that.id}`).on('change',function(){
			//get the file name
			var fileName = $(this).val();
			//replace the "Choose a file" label
			$(this).next('.custom-file-label').html(fileName.replace(/^.*[\\\/]/, ''));
		})
		/**
		 * @date 08-05-2022
		 * @author imshawan
		 * @description Added tinyMCE as the rich text editor for article creation
		 */

		$(`[content-area-id="${$that.id}"]`).tinymce({
			height: 500,
			menubar: $that.richTextMenubar,
			branding: false,
			paste_data_images: true,
			automatic_uploads: true,
			file_picker_types: "image",
			file_picker_callback: function (
				callback,
				value,
				meta
			  ) {
				// Provide file and text for the link dialog
				var input = document.createElement("input");
				input.setAttribute("type", "file");
				input.setAttribute("accept", "image/*");
				input.onchange = function () {
				  var file = this.files[0];
		
				  var reader = new FileReader();
				  reader.onload = function () {
					var id = "blobid" + new Date().getTime();
					var blobCache =
					  window.tinymce.activeEditor.editorUpload
						.blobCache;
					var base64 = reader.result.split(",")[1];
					var blobInfo = blobCache.create(
					  id,
					  file,
					  base64
					);
					blobCache.add(blobInfo);
					callback(blobInfo.blobUri(), {
					  title: file.name,
					});
				  };
				  reader.readAsDataURL(file);
				};
		
				input.click();
			  },
			plugins: [
			  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
			  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
			  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
			],
			toolbar: 'undo redo fullscreen image | blocks | bold italic backcolor | ' +
			  'alignleft aligncenter alignright alignjustify | ' +
			  'bullist numlist outdent indent | removeformat | help'
		  });

		require(['api'], function (api) {
			api.get('/app/category', {}).then((response) => {
				$that.categories = response.filter(e => String(e.categoryType).toLocaleLowerCase() != 'class' && String(e.categoryType).toLocaleLowerCase() != 'batch');
				$.each($that.categories, function (i, e_) {
					$target.find('select[name="cid"]').append(`<option value="${e_.cid}">${e_.name}</option>`);
				});
                if (data.cid) {
                    $target.find(`[value="${data.cid}"]`).attr('selected', true);
                }
				$target.find('select[name="cid"]').on('change', function () {
					let cid = $(this).val();
					let $sub_cid = $target.find('select[name="sub_cid"]');
					$sub_cid.html('<option value="">Select Sub-Category (Optional)</option>');
					$.each($that.categories.find(e => e.cid == cid).sub_categories, function (i, e_) {
						$sub_cid.append(`<option value="${e_.cid}">${e_.name}</option>`);
					});
                    if (data.sub_cid) {
                        $target.find(`[value="${data.sub_cid}"]`).attr('selected', true);
                    }
					$sub_cid.prop('disabled', false);
					$sub_cid.removeAttr('readonly')
				});
			});
		})


		if (localStorage.getItem(`ar_draft_${$that.tid}_${$that.data.uid}_unsaved`)) {
			$target.trigger('make:dirty');
		}



		$target.find('select').each(function () {
			$(this).val($(this).data('value'))
		});

		/**
		 * @author imshawan
		 * @function save
		 * @description Save the article, handles the API calls
		 * @param {Boolean} draft 
		 */

		function save(draft = false) {
			// var payload = $target.serializeArray().reduce(function (obj, item) {
			// 	obj[item.name] = item.value;
			// 	return obj;
			// }, {});
			notify('Please wait...', 'success');
			var payload = new FormData();
			$target.serializeArray().reduce(function (obj, item) {
				return payload.append([item.name], item.value);
			}, {});

			if ($(`#thumb-${$that.id}`).val()) {
				var blob = document.getElementById(`thumb-${$that.id}`).files[0];
				payload.append('files[image]', blob);
			}
			payload.append('wordcount', $that.getWordCount());
			payload.append('isDraft', draft);

			if (!$that.data.queue) {
				if ($that.data.tid && $that.data.with.pid) {
					doAjax({
						type: 'PUT',
						url: `/app/articles/${$that.data.with.pid}`,
						data: payload,
						cache: false,
						contentType: false,
						processData: false,
					}).then(function (res) {
						notify('Updated Successfully', 'success');
					}).catch((err) => {
						if (err.responseJSON && err.responseJSON.status && err.responseJSON.status.message) {
							notify(err.responseJSON.status.message, 'error');
						} else {
						notify(err.message, 'error')
						}
					}).finally(() => location.reload());
				} else {
					doAjax({
						type: 'POST',
						url: `/app/articles`,
						data: payload,
						cache: false,
						contentType: false,
						processData: false,
					}).then(function (res) {
						location.reload();
					}).catch((err) => {
						if (err.responseJSON && err.responseJSON.status && err.responseJSON.status.message) {
							notify(err.responseJSON.status.message, 'error');
						} else {
						notify(err.message, 'error')
						}
					});
				}
			} else {
				// Plese Wait We are .... 
				console.log("Please wait");
				notify('Please Wait', 'info');
			}

		}

		$target.on("submit", function (e, data = {}) {
			if ($that.data.noAction) {
				alert('Sorry! You can not modify.');
				return;
			}
			e.preventDefault();
			if ($(this).find(':invalid').length) {
				return notify('Please fill the required fields', 'error');
			}
			save();
		});

		$(`#save-draft-${$that.id}`).on('click', function (e, data = {}) {
			e.preventDefault();
			let draftMode = true;
			if ($that.data.noAction) {
				alert('Sorry! You can not modify.');
				return;
			}
			if ($(this).find(':invalid').length) {
				return notify('Please fill the required fields', 'error');
			}
			save(draftMode);
		});

		$target.dirrty();
		$target.on('dirty', function () {
			$that.dirty = true;
		});
		$target.on('clean', function () {
			console.log(this, 'is clean');
			$that.dirty = !true;
			localStorage.removeItem(`ar_draft_${$that.data.tid}_${$that.data.uid}_unsaved`)
		});
		$(window).on('beforeunload', () => {
			// $that.draft();
			// notify('Article Saved as draft', 'info');
			// if ($that.dirty) {
			// 	return 'You have unsaved changes. Do you want to leave this page and discard your changes?';
			// }
		});

	}

	_reader() {
		let $that = this;
		let components = {
			header: (title = "") => {
				return ``;
			},
			container: (content = "") => {
				return ` <div class="sdlms-threads-container">${thread}</div>`;
			},
		}
		return components;
	};

    thoughts(thought) {
		let url = '';
		let title = '';
		switch (Number(thought)) {
		case 1:
			//url = app.asset_url + '/eureka-moment.svg';
			title = 'Eureka Moment';
			break;
		case 2:
			//url = app.asset_url + '/answer.svg';
			title = 'Answer';
			break;
		case 3:
			//url = app.asset_url + '/question.svg';
			title = 'Question';
			break;
		case 4:
			//url = app.asset_url + '/root-of-thought.svg';
			title = 'Root of Thought';
			break;
		case 5:
			title = 'Reflection';
			break;
		default:
			break;
		}

		return `<span data-title="${title}" title-bottom>${title}</span>`;
	}

	/**
	 * @author imshawan
	 * @date 06-04-2022
	 * @function dateFormatter
	 * @param {Int} timestamp 
	 * @returns formatted time string
	 */
	dateFormatter (timestamp) {
        let date = new Date(timestamp)
        return `${date.getDate()} ${date.toLocaleDateString(undefined, { month: "long" })}, ${date.getFullYear()}`
    }

	/**
	 * @author imshawan
	 * @date 15/02/2022
	 * @name reader
	 * @type {function} 
	 * @description Append @Article to sdlms-article-builder read mode
	 * @param {Object} data Required if @Article is initied with existing @Article then render it with Exisiting
	 */

	reader(data) {
		let $that = this;
		let article = $that.data.with;
		let $target = $that.data.target;
		if (!data.tid) {
			return;
		}
		$($target).append(`<div>
			<div class="sdlms-article-builder-header mb-5">
				<h1 style="font-weight: 600;">${article.title}</h1>
				<p class="d-flex mb-1" style="justify-content: space-between;">
					<span class="sdlms-text-black-20px">
						by <span style="color: blue;
						font-weight: 500;
						cursor: pointer;" data-user-profile="${article.user.username}">${article.user.fullname || article.user.displayname ||article.user.username}</span>
					</span>
					<span class='sdlms-text-black-20px' style="font-weight: 600; ">
						${$that.dateFormatter(article.timestamp)} 
					</span>
					${!$that.data.thoughtProcess ? '' :`<div class="sdlms-text-black-20px">
														Thought Process: ${this.thoughts(article.tp)}
													</div>`}
				</p>
			</div>
			<div class="sdlms-article-builder-container mb-2 sdlms-text-black-20px text-justify" style="word-wrap: break-word;">
				${article.content}
			</div>
		</div>`)

		$($target).on('click', `[data-user-profile]`, function () {
			let username = $(this).data('user-profile');
			ajaxify.go(`/user/${username}`);
		});
	}
}