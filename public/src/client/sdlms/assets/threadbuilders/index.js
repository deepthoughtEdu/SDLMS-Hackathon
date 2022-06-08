"use strict";

define("forum/sdlms/assets/threadbuilders/index", [
	"api",
	"sdlms/threadbuilder"
], function (api) {

	var THREADBUILDERS = {};


	THREADBUILDERS.init = () => {
		console.log("THREADBUILDERS.index");
		var $tabs = $("#assets li");
		$tabs.removeClass("active");
		$tabs.filter("[asset-type='tb']").addClass("active");
		$.each(ajaxify.data.data, function (index, threadbuilder) {
			let sentence = '';
			$.each((threadbuilder.threads || []), function (i, thread) {
				$.each((thread.subthreads || []), function (i, subthread) {
					sentence += `${subthread.interpretation} `;
					sentence += `${subthread.content} `;
					sentence += `${(subthread.summary || {}).content || ''} `;
				});
			});
			$('#assets-rows').append(THREADBUILDERS._template.components.asset.card(threadbuilder));
			app.wordCloud($('#assets-rows').find('[WCloud]').last(),sentence)
		});
		$("[get-share-link]").off('click');
		$('[get-share-link]').on("click", function () {
			let link = $(this).attr("get-share-link");
			let $this = $(this);
			let expiry = $(this).attr("data-expiry");
			console.log(link);
			console.log(expiry);
			if(link && Date.now() < expiry){
				link = `${window.location.origin}${link}`;
				app.copyText(link);
				return
			}
			$(this).addClass("spintorefresh fa-sync-alt");
			api.post('/sdlms/sharer', {
				pid: $(this).data("pid"),
				type:'threadbuilder',
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
		new threadBuilder({
			target: '#threadBuilder',
			action:"builder",
			tid: app.user.personal_assets_id,
			uid: app.user.uid,
			noDraft:true,
			noTracking:true,
			onAdded: function () {
				console.log("onAdded");
				$('.modal').modal('hide');
				ajaxify.go(location.pathname)
			}
		});
		if($('[asset]').length){
			$('.sdlms-pagination').show();
		}
	};
	THREADBUILDERS._template = {
		components: {
			asset: {
				card: (data) => {
					let bg = app.random.backgrounds.random();
					return ` <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" asset>
					<div class="card-flyer">
						<div class="text-box">
							<div class="image-box position-relative">
								<a href="#" show-thread-builder data-id="${data._id}"  style="background:${bg}" WCloud class="d-block">
									<img src="${app.random.images.random()}" alt="" />
								</a>
								<div class="position-absolute w-100 floating-bottom" style="${bg == 'white' ? 'background:black;color:white' : ''}">
									<div class="d-flex justify-content-between">
										<span class="text-ellipse text-left w-80 pr-2">${(data.tid || data.topicId) == app.user.personal_assets_id ? 'Personal Threadbuilder' : ''}${data.topic && data.topic.topic ? data.topic.topic : ''}</span>
										<span><a href="/myassets/threadbuilders/manage/${data.pid||data._id}"><i class="fas fa-expand mr-2"></i></a> <i class="fas fa-share-alt cursor-pointer ${data.pid? '' : 'd-none'}" get-share-link="${data.sharer ? data.sharer.link: false}" data-expiry="${data.sharer ? data.sharer.expireAt : 0}"  data-pid="${data.pid}"></i></span>
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
	return THREADBUILDERS;
})