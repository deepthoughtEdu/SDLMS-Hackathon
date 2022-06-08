"use strict";

define("forum/sdlms/assets/spreadsheets/index", ['api',"sdlms/spreadsheet"], function (api) {

	var SPREADSHEETS = {};

	SPREADSHEETS.init = () => {
		console.log("SPREADSHEETS.init");
		var $tabs = $("#assets li");
		$tabs.removeClass("active");
		$tabs.filter("[asset-type='sp']").addClass("active");
		$.each(ajaxify.data.data, function (index, spreadsheet) {
			let sentence = '';
			$.each(spreadsheet.data.data, function (index, row) {
				$.each(row, function (index, cell) {
					sentence += `${cell} `;
				})
			});
			$('#assets-rows').append(SPREADSHEETS._template.components.asset.card(spreadsheet));
			app.wordCloud($('#assets-rows').find('[WCloud]').last(), sentence)
		});
		$("[get-share-link]").off('click');
		$('[get-share-link]').on("click", function () {
			let link = $(this).attr("get-share-link");
			let $this = $(this);
			let expiry = $(this).attr("data-expiry");
			console.log(link);
			console.log(expiry);
			if (link && Date.now() < expiry) {
				link = `${window.location.origin}${link}`;
				app.copyText(link);
				return
			}
			$(this).addClass("spintorefresh fa-sync-alt");
			api.post('/sdlms/sharer', {
				pid: $(this).data("pid"),
				type: 'spreadsheet',
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
		$('[show-spreadsheet-builder]').on('click',function(){
				let id = $(this).data('id');
				let sp = ajaxify.data.data.find(sp => sp._id == id);
				let SPdata = {
					data:sp.data.data,
					readonly: sp.data.readonly,
					widths:sp.data.widths,
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
					contextMenu:(app.user.personal_assets_id == sp.tid),
				})
				$('#editspreadsheetModal').modal('show');
		});
		let data = {
			data: [],
			readonly: [],
			widths:  [],
		}
		new spreadSheet({
			target: '#spreadsheet',
			action: "builder",
			tid: app.user.personal_assets_id,
			uid: app.user.uid,
			with: data,
			reload: true,
			noEvents: true,
			noDraft: true,
			isBrodcaster: false,
			onAdded: function () {
				$('.modal').modal('hide');
				ajaxify.go(location.pathname)
			},
			isListener: false,
			contextMenu:true
		})
		if($('[asset]').length){
			$('.sdlms-pagination').show();
		}
		
		$('.modal.sheet .modal-content').off('click').on('click', function (e) {
			if ($(e.target).hasClass('modal-content')) {
				$(this).parents('.modal').modal('hide');
			}
		})
	};
	SPREADSHEETS._template = {
		components: {
			asset: {
				card: (data) => {
					let bg = app.random.backgrounds.random();
					return `<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" asset>
					<div class="card-flyer">
						<div class="text-box">
							<div class="image-box position-relative">
								<a href="#" show-spreadsheet-builder data-id="${data._id}" style="background:${bg}" WCloud class="d-block">
									<img src="${app.random.images.random()}" alt="" />
								</a>
								<div class="position-absolute w-100 floating-bottom" style="${bg == 'white' ? 'background:black;color:white' : ''}">
									<div class="d-flex justify-content-between">
										<span class="text-ellipse  text-left w-80 pr-2">${data.topicId == app.user.personal_assets_id ? 'Personal Spreadsheet' : ''}${data.topic && data.topic.topic ? data.topic.topic : ''}</span>
										<span><a href="/myassets/spreadsheets/manage/${data.pid||data._id}"><i class="fas fa-expand mr-2"></i></a><i class="fas fa-share-alt cursor-pointer ${data.pid? '' : 'd-none'}" get-share-link="${data.sharer ? data.sharer.link: false}" data-expiry="${data.sharer ? data.sharer.expireAt : 0}"  data-pid="${data.pid}"></i></span>
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

	return SPREADSHEETS;
})