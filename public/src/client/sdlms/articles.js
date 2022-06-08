'use strict';

define('forum/sdlms/articles', ['api', 
'sdlms/article', 
'https://cdn.tiny.cloud/1/edmnvohc18gntwb9upy6g9m8s1u0blu4kqij2acxxdgghk1r/tinymce/6/tinymce.min.js', 
'https://cdn.jsdelivr.net/npm/@tinymce/tinymce-jquery@1/dist/tinymce-jquery.min.js'], 
function (api, article) {
	var Articles = {};
    
    let action_button = $('[component="articles"]').find(".add-row");

    Articles.articles = ajaxify.data.articles;

	Articles.init = function () {
        Articles.renderArticles(Articles.articles);
        
        $('[component="articles"]').find(".add-row").on('click', function () {
            let action = $(this).find(".article-action-text").data('action');
            if (action == 'back') {
                $('[component="articles"]').find(".my-articles").text('My Articles');
                Articles.renderArticles(Articles.articles);
                action_button.empty();
                action_button.html(`<i class="fa fa-plus"></i>&nbsp;&nbsp;<span data-action="add" class="article-action-text">Create</span>`)
            } else {
                $('.article-area').empty();
                new Article({
                    uid: app.user ? app.user.uid : 0,
                    target: '.article-area',
                    tid: 1,
                    richTextMenubar: true,
                    
                });
                $('[component="articles"]').find(".my-articles").text('Create Article');
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="article-action-text">Go Back</span>`)
            }
        })

        $('body').on('click', '[data-article-id]', function () {
            let id = $(this).data('article-id');

            api.post(`/app/getarticles?pid=${id}`, {}).then((r) => {

                new Article({
                    target: '.article-area',
                    tid: r.data.tid,
                    with: r.data,
                    action: 'reader',
                    richTextMenubar: true,
                });
                $('[component="articles"]').find(".my-articles").empty();
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="article-action-text">Go Back</span>`)
            })
        })

        $('body').on('click', '[data-edit-id]', function () {
            let id = $(this).data('edit-id');
            
            api.post(`/app/getarticles?pid=${id}`, {}).then((r) => {
                new Article({
                    uid: app.user ? app.user.uid : 0,
                    target: '.article-area',
                    tid: r.data.tid,
                    with: r.data,
                    richTextMenubar: true,
                });
                $('[component="articles"]').find(".my-articles").text('Edit Article');
                action_button.empty();
                action_button.html(`<i class="fa fa-arrow-left"></i>&nbsp;&nbsp;<span data-action="back" class="article-action-text">Go Back</span>`)
            })
        })

        $('body').on('click', '[data-delete-id]', function () {
            let id = $(this).data('delete-id');
            if (confirm('Are you sure you want to delete this article?')) {
                api.del(`/app/articles/${id}`, {}).then((r) => {
                    location.reload();
                }).catch((e) => {
                    console.log(e);
                })
            }
        })
	}

    Articles.template = function (part, data, target) {
		let components = {
			article: `<tr>
                <td ><index>${(target.find('tr').length + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</index></td>
                <td  data-article-id="${data.pid}">${data.title}</td>
                <td>
                    <a class='button edit' title='Edit' data-edit-id="${data.pid}" >
                        <i class='fa fa-pencil'></i>
                    </a> 
                    <a class='button delete title='Delete' data-delete-id="${data.pid}" >
                        <i class='fa fa-trash'></i>
                    </a> 
                </td>
             </tr>`
		}

		return components[part];
	}

    Articles.renderArticles = (articles) => {
        $('.article-area').empty();
        $('.article-area').append(`<div class="col-md-12 px-0 pb-3">
        <table class="table mb-0 article-table table-bordered" id="editableTable">
        <thead class=" secondary-header sdlms-text-white-18px font-weight-medium">
        <tr class="sdlms-my-upcoming-session-table-header-row" style="cursor: pointer;">
            <th class="font-weight-500">S. NO</th>
            <th class="font-weight-500">Article title</th>
            <th class="font-weight-500">Actions</th>
        </tr>
        </thead>
            <tbody></tbody>
        </table>
        </div>`);
        let $tbody = $('[component="articles"]').find(".article-table").find("tbody");
        articles.forEach(element => {
            $tbody.append(Articles.template('article', element, $tbody));
        });
    }

	return Articles
})