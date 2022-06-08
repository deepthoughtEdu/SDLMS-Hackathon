'use strict';


define('forum/post-queue', [
	'categoryFilter', 'categorySelector',
], function (categoryFilter, categorySelector) {
	var PostQueue = {};

	PostQueue.init = function () {
		$('[data-toggle="tooltip"]').tooltip();

		categoryFilter.init($('[component="category/dropdown"]'));

		$('.posts-list').on('click', '[data-action]', function () {
			var parent = $(this).parents('[data-id]');
			var action = $(this).attr('data-action');
			var id = parent.attr('data-id');
			var listContainer = parent.get(0).parentNode;

			if (!['accept', 'reject'].some(function (valid) {
				return action === valid;
			})) {
				return;
			}

			socket.emit('posts.' + action, { id: id }, function (err) {
				if (err) {
					return app.alertError(err.message);
				}
				parent.remove();

				if (listContainer.childElementCount === 0) {
					ajaxify.refresh();
				}
			});
			return false;
		});

		handleContentEdit('.post-content', '.post-content-editable', 'textarea');
		handleContentEdit('.topic-title', '.topic-title-editable', 'input');

		$('.posts-list').on('click', '.topic-category[data-editable]', function () {
			var $this = $(this);
			var id = $this.parents('[data-id]').attr('data-id');
			categorySelector.modal(ajaxify.data.allCategories, function (cid) {
				var category = ajaxify.data.allCategories.find(function (c) {
					return parseInt(c.cid, 10) === parseInt(cid, 10);
				});
				socket.emit('posts.editQueuedContent', {
					id: id,
					cid: cid,
				}, function (err) {
					if (err) {
						return app.alertError(err.message);
					}
					app.parseAndTranslate('post-queue', 'posts', {
						posts: [{
							category: category,
						}],
					}, function (html) {
						if ($this.find('.category-text').length) {
							$this.find('.category-text').text(html.find('.topic-category .category-text').text());
						} else {
							// for backwards compatibility, remove in 1.16.0
							$this.replaceWith(html.find('.topic-category'));
						}
					});
				});
			});
			return false;
		});

		$('[component="post/content"] img:not(.not-responsive)').addClass('img-responsive');
	};

	function handleContentEdit(displayClass, editableClass, inputSelector) {
		$('.posts-list').on('click', displayClass, function () {
			var el = $(this);
			var inputEl = el.parent().find(editableClass);
			if (inputEl.length) {
				el.addClass('hidden');
				inputEl.removeClass('hidden').find(inputSelector).focus();
			}
		});

		$('.posts-list').on('blur', editableClass + ' ' + inputSelector, function () {
			var textarea = $(this);
			var preview = textarea.parent().parent().find(displayClass);
			var id = textarea.parents('[data-id]').attr('data-id');
			var titleEdit = displayClass === '.topic-title';

			socket.emit('posts.editQueuedContent', {
				id: id,
				title: titleEdit ? textarea.val() : undefined,
				content: titleEdit ? undefined : textarea.val(),
			}, function (err, data) {
				if (err) {
					return app.alertError(err);
				}
				if (titleEdit) {
					if (preview.find('.title-text').length) {
						preview.find('.title-text').text(data.postData.title);
					} else {
						// for backwards compatibility, remove in 1.16.0
						preview.html(data.postData.title);
					}
				} else {
					preview.html(data.postData.content);
				}

				textarea.parent().addClass('hidden');
				preview.removeClass('hidden');
			});
		});
	}

	return PostQueue;
});
