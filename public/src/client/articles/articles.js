'use strict';

/**
 * @date 07-05-2022
 * @author imshawan
 * @description Home page for the article's sub-domain
 */

define('forum/articles/articles', [], function () { 
    var Articles = {};

    const Images = ['cubes.jpg', 'istockphoto-1295274245-170667a.jpg', 'istockphoto-175482570-170667a.jpg', 'random-dice.jpg',
    'heart.jpg', 'istockphoto-175260374-170667a.jpg', 'photo-1493612276216-ee3925520721.jpg', 'shape-logo.jpg', 'istockphoto-95442265-170667a.jpg'];
    const ImageBase = 'https://sdlms.deepthought.education/assets/uploads/files/random_images';
    
    Articles.init = function () {
        let data = ajaxify.data;
        let $target = $('#assets-rows');

        if ($('.page-articleshome').find('.sdlms-header').length) {
            $('.page-articleshome').find('.sdlms-header').addClass('container');
            $('.sdlms-header').find('.dropdown').remove();
        }

        if (data.articles) {
            $.each(data.articles ,function (index, article) {
                $target.append(Articles.card(article, data.baseUrl));
            });
        }

        $('.sdlms-search-bar').on('submit', function (e) {
            e.preventDefault();
            let QUERY_URI = new URLSearchParams({
              term: $(this).find('input').val()
            });
  
            ajaxify.go(`${location.pathname == '/' ? '' : location.pathname.split('/')[1]}/search?${QUERY_URI}`);
        });

        $('.sdlms-card').on('click', function (e) {
            e.preventDefault();
            let pid = $(this).data('article-pid');
            ajaxify.go(`/articleshome/articles/view/${pid}`);
        });        

        if($('[sdlms-card]').length){
			$('.sdlms-pagination').show();
		}
    }

    Articles.card = function (article, baseUrl) {
        const default_profile = '/assets/uploads/files/files/files/default_profile.png';
        let timeToRead = article.wordcount ? Math.round(Number(article.wordcount / 200)) : null;
        let imageOnError = `${ImageBase}/${Images[Math.floor(Math.random() * Images.length)]}`;

        return `
        <div sdlms-card=${article._id} class="col-12 col-md-6 col-lg-4 mb-5">
            <div data-article-pid=${article.pid} class="sdlms-card m-auto">
                <div class="sdlms-card-thumbnail">
                    <img src="${baseUrl}${article.image}" alt="" class="image-autofit" onerror="this.onerror=null;this.src='${imageOnError}';"></img>
                </div>
                <div class="sdlms-card-title">
                    <div class="sdlms-asset-category-name">${article.category || 'deepthought'}</div>
                </div>
                <div class="sdlms-asset-title-container">
                    <div class="sdlms-asset-title text-ellipse-2">
                        ${article.title}
                    </div>
                </div>
                <div class="sdlms-asset-description">
                    <div class="sdlms-asset-content-body">
                        ${article.content}
                    </div>
                    <div class="sdlms-asset-nav">
                        <a article-nav href="#">Continue reading...</a>
                    </div>
                </div>
                <div class="sdlms-card-author d-flex">
                    <div class="sdlms-card-author-image">
                        <img src="${baseUrl}${article.author.picture || default_profile}" alt=""></img>
                    </div>
                    <div class="sdlms-card-author-details">
                        <div class="sdlms-card-author-name">
                            ${article.author.fullname || article.author.displayname || '@'+ article.author.username}
                        </div>
                        <div class="sdlms-card-author-signature text-ellipse">
                            ${article.author.signature}
                        </div>
                    </div>
                </div>
                <div class="sdlms-card-footer">
                    <hr>
                    <div class="sdlms-card-footer-content d-flex">
                        <div class="sdlms-asset-modification-date">${timeToRead || 1} min read</div>
                    </div>
                </div>
            </div>
        </div>
        `;

    //     <div class="sdlms-asset-stats d-flex">
    //     <span class="sdlms-asset-flag-1 mr-2">
    //         <img src="https://sdlms.deepthought.education/assets/uploads/files/view.png" alt=""></img>
    //         <span class="sdlms-asset-flag-counter">${article.viewcount || 0}</span>
    //     </span>
    //     <span class="sdlms-asset-flag-2">
    //         <img src="https://sdlms.deepthought.education/assets/uploads/files/files/count.png" alt=""></img>
    //         <span class="sdlms-asset-flag-counter">${article.wordcount || 0}</span>
    //     </span>
    // </div>
    }

    return Articles;
})