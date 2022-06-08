"use strict";

define("forum/sdlms/assets/articles/index", [
	"api", "sdlms/article",
	'https://cdn.tiny.cloud/1/edmnvohc18gntwb9upy6g9m8s1u0blu4kqij2acxxdgghk1r/tinymce/6/tinymce.min.js', 
	'https://cdn.jsdelivr.net/npm/@tinymce/tinymce-jquery@1/dist/tinymce-jquery.min.js'
], function (api) {

	var ARTICLES = {};
	var $tabs = $("#assets li");

	ARTICLES.init = () => {
        console.log("ARTICLES.init");

		$tabs.removeClass("active");
		$tabs.filter("[asset-type='arc']").addClass("active");

		$.each(ajaxify.data.data, function (index, article) {
			$('#assets-rows').append(ARTICLES._template.components.asset.card(article));
			app.wordCloud($('#assets-rows').find('[WCloud]').last(), article.content);
		});

		$('[show-article-builder]').off('click');
		$('[show-article-builder]').on('click',function(){
				let id = $(this).data('id');
				let ar = ajaxify.data.data.find(ar => ar._id == id);
				new Article({
					uid: app.user ? app.user.uid : 0,
                    target: '#editarticle',
                    tid: ar.tid,
                    with: ar,
					richTextMenubar: false,
                    action: (app.user.uid == ar.uid) ? 'builder' : 'reader'
                });
				$('#editarticleModal').modal('show');
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
				type:'article',
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

		new Article({
			uid: app.user ? app.user.uid : 0,
			target: '#article',
			action: "builder",
			richTextMenubar: false,
			tid: app.user.personal_assets_id,
		});
		if($('[asset]').length){
			$('.sdlms-pagination').show();
		}
	};

	ARTICLES._template = {
		components: {
			asset: {
				card: (data) => {
					let bg = app.random.backgrounds.random();
					return `<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" asset>
					<div class="card-flyer">
						<div class="text-box">
							<div class="image-box position-relative">
								<a href="#" show-article-builder data-id="${data._id}" style="background:${bg}" WCloud class="d-block">
									<img src="${app.random.images.random()}" alt="" />
								</a>
								<div class="position-absolute w-100 floating-bottom" style="${bg == 'white' ? 'background:black;color:white' : ''}">
									<div class="d-flex justify-content-between">
										<span class="text-ellipse  text-left w-80 pr-2">${data.topicId == app.user.personal_assets_id ? 'Personal Article' : ''}${data.title || ''}</span>
										<span><a href="/myassets/articles/manage/${data.pid||data._id}"><i class="fas fa-expand mr-2"></i></a><i class="fas fa-share-alt cursor-pointer ${data.pid? '' : 'd-none'}" get-share-link="${data.sharer ? data.sharer.link: false}" data-expiry="${data.sharer ? data.sharer.expireAt : 0}"  data-pid="${data.pid}"></i></span>
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

	return ARTICLES;
})