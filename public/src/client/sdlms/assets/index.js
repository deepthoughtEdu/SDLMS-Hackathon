"use strict";

define("forum/sdlms/assets/index", [
	'api', "sdlms/spreadsheet", "sdlms/eaglebuilder", "sdlms/threadbuilder",
	'https://cdn.tiny.cloud/1/edmnvohc18gntwb9upy6g9m8s1u0blu4kqij2acxxdgghk1r/tinymce/6/tinymce.min.js', 
	'https://cdn.jsdelivr.net/npm/@tinymce/tinymce-jquery@1/dist/tinymce-jquery.min.js'
], function (api) {

	var ASSETS = {};

	ASSETS.init = () => {
		console.log("ASSET.init");
		var $tabs = $("#assets li");
		$tabs.removeClass("active");


		$tabs.filter("[asset-type='all']").addClass("active");
		$.each(ajaxify.data.data, function (index, asset) {
			let sentence = '';
			switch (asset.type) {
			case 'spreadsheet':
				$.each(asset.data.data, function (index, row) {
					$.each(row, function (index, cell) {
						sentence += `${cell} `;
					})
				});
				break;
			case 'eaglebuilder':
				$.each((asset.tracks || []), function (i, track) {
					$.each((track.subtracks || []), function (i, subtrack) {
						sentence += `${subtrack.content} `;
					});
					sentence += `${(track.transitions || {}).content || ''} `;
				});

				break;
			case 'threadbuilder':
				$.each((asset.threads || []), function (i, thread) {
					$.each((thread.subthreads || []), function (i, subthread) {
						sentence += `${subthread.interpretation} `;
						sentence += `${subthread.content} `;
						sentence += `${(subthread.summary || {}).content || ''} `;
					});
				});
				break;
			default:
				break;
			}

			$('#assets-rows').append(ASSETS._template.components.asset.card(asset));
			app.wordCloud($('#assets-rows').find('[WCloud]').last(), sentence)
		});
		$("[get-share-link]").off('click');
		$('[get-share-link]').on("click", function () {
			let link = $(this).attr("get-share-link");
			let $this = $(this);
			let type = $(this).attr("type");
			let expiry = $(this).attr("data-expiry");

			if (link && Date.now() < expiry) {
				link = `${window.location.origin}${link}`;
				app.copyText(link);
				return
			}
			$(this).addClass("spintorefresh fa-sync-alt");
			api.post('/sdlms/sharer', {
				pid: $(this).data("pid"),
				type: type,
				expireAt: Date.now() + (1000 * 60 * 60 * 24 * 1)
			}).then((response) => {
				let link = `${window.location.origin}${response.link}`;
				$this.attr("get-share-link", response.link);
				$this.attr("data-expiry", response.expireAt);
				app.copyText(link);
			}).catch((error) => {
				if (error.message) notify(error.message, 'error');
			}).finally(() => {
				$this.removeClass("spintorefresh fa-sync-alt");
			});
		});
		$('[show-spreadsheet-builder]').off('click');
		$('[show-spreadsheet-builder]').on('click', function () {
			let id = $(this).data('id');
			let sp = ajaxify.data.data.find(sp => sp._id == id);
			let SPdata = {
				data: sp.data.data,
				readonly: sp.data.readonly,
				widths: sp.data.widths,
				styles:sp.data.styles
			};
			new spreadSheet({
				target: '#editspreadsheet',
				action: (app.user.uid == sp.uid) ? "builder" : 'reader',
				tid: (sp.tid || sp.topicId),
				with: SPdata,
				addFeedbacks: !true,
				uid: sp.uid,
				id: sp.pid,
				noEvents: true,
				noDraft: true,
				contextMenu: (app.user.personal_assets_id == sp.tid),
			})
			$('#editspreadsheetModal').modal('show');
		});
        $('[show-thread-builder]').off('click');
		$('[show-thread-builder]').on('click',function(){
				let id = $(this).data('id');
				let tb = ajaxify.data.data.find(tb => tb._id == id);
				let data = {
					meta: tb.meta,
					threads: tb.threads,
					conclusion: tb.conclusion || {},
				};
				new threadBuilder({
					target: '#editThreadBuilder',
					action: (app.user.uid == (tb.uid || tb.userId)) ? "builder" : 'reader',
					tid: tb.tid || tb.topicId,
					id: tb.pid || tb.id,
					uid: tb.uid || tb.userId,
					with: data,
					noDraft:true,
					noTracking:true,
					addFeedbacks: !true
				});
				$('#editThreadbuilderModal').modal('show');
		});
        $('[show-eagle-builder]').off('click');
		$('[show-eagle-builder]').on('click', function () {
			let id = $(this).data('id');
			let eb = ajaxify.data.data.find(eb => eb._id == id);
			let data = {
				meta: eb.meta,
				tracks: eb.tracks,
				conclusion: eb.conclusion || {},
			};

			new eagleBuilder({
				target: '#editeaglebuilder',
				action: (app.user.uid == (eb.uid || eb.userId)) ? "builder" : 'reader',
				tid: eb.tid || eb.topicId,
				id: eb.pid || eb.id,
				with: data,
				addFeedbacks: !true,
				uid: eb.uid || eb.userId,
				noDraft: true,
				noTracking: true,
			});
			$('#editeaglebuilderModal').modal('show');
		});

		if ($('[asset]').length) {
			$('.sdlms-pagination').show();
		}

		$('.modal.sheet .modal-content').off('click').on('click', function (e) {
			if ($(e.target).hasClass('modal-content')) {
				$(this).parents('.modal').modal('hide');
			}
		})
	};

	function getAssetLink(type, id) {
		let link = '';
		switch (type) {
		case 'spreadsheet':
			link = `/myassets/spreadsheets/manage/${id}`;
			break;
		case 'eaglebuilder':
			link = `/myassets/eaglebuilders/manage/${id}`;
			break;
		case 'threadbuilder':
			link = `/myassets/threadbuilders/manage/${id}`;
			break;
		case 'article':
			link = `/myassets/articles/manage/${id}`;
			break;
		case 'quiz':
			link = `/myassets/quiz/manage/${id}`;
			break;
		default:
			break;
		}
		return link;
	}
    function getAssetAttr(type) {
        let attr = '';
        switch (type) {
            case 'spreadsheet':
                attr = `show-spreadsheet-builder`;
                break;
            case 'eaglebuilder':
                attr = `show-eagle-builder`;
                break;
            case 'threadbuilder':
                attr = `show-thread-builder`;
                break;
			case 'article':
				attr = `show-article-builder`;
				break;
			case 'quiz':
				attr = `show-quiz-builder`;
				break;
            default:
                break;
        }
        return attr;
    }
	ASSETS._template = {
		components: {
			asset: {
				card: (data) => {
					let bg = app.random.backgrounds.random();
					return `<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" asset>
					<div class="card-flyer">
						<div class="text-box">
							<div class="image-box position-relative">
								<a href="#" ${getAssetAttr(data.type)} data-id="${data._id}" style="background:${bg}" WCloud class="d-block">
									<img src="${app.random.images.random()}" alt="" />
								</a>
								<div class="position-absolute w-100 floating-bottom" style="${bg == 'white' ? 'background:black;color:white' : ''}">
									<div class="d-flex justify-content-between">
										<span class="text-ellipse text-capitalize text-left w-80 pr-2">${(data.tid || data.topicId) == app.user.personal_assets_id ? 'Personal '+ data.type : ''}${data.topic && data.topic.topic ? data.topic.topic : ''}</span>
										<span><a href="${getAssetLink(data.type,(data.pid||data._id))}"><i class="fas fa-expand mr-2"></i></a><i class="fas fa-share-alt cursor-pointer ${data.pid? '' : 'd-none'}" type="${data.type}" get-share-link="${data.sharer ? data.sharer.link: false}" data-expiry="${data.sharer ? data.sharer.expireAt : 0}"  data-pid="${data.pid}"></i></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>`;
				}
			}
		}
	}

	return ASSETS;
})