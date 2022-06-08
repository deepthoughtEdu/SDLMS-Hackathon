'use strict';

/**
 * @date 07-05-2022
 * @author imshawan
 * @description Aricle viewing page for the article's sub-domain
 */

define('forum/articles/article_view', ['sdlms/article'], function () { 
    var ArticleViewer = {};
    
    ArticleViewer.init = function () {
        let data = ajaxify.data;

        if (Object.keys(ajaxify.data.article).length != 0) {
            new Article({
                target: '#article-area',
                tid: data.article.tid,
                with: data.article,
                thoughtProcess: false,
                action: 'reader'
            });
        }
    }

    return ArticleViewer;
});
