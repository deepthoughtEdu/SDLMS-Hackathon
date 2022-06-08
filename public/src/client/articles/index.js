'use strict';

/**
 * @date 07-05-2022
 * @author imshawan
 * @description Aricle's Home page for the article's sub-domain
 */

define('forum/articles/index', [
    'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js'
], function () { 
    var ArticlesIndex = {};

    const Images = ['cubes.jpg', 'istockphoto-1295274245-170667a.jpg', 'istockphoto-175482570-170667a.jpg', 'random-dice.jpg',
    'heart.jpg', 'istockphoto-175260374-170667a.jpg', 'photo-1493612276216-ee3925520721.jpg', 'shape-logo.jpg', 'istockphoto-95442265-170667a.jpg'];
    const ImageBase = 'https://sdlms.deepthought.education/assets/uploads/files/random_images';
    const default_profile = '/assets/uploads/files/files/files/default_profile.png';
    
    ArticlesIndex.init = function () {
        let data = ajaxify.data;
        if ($('.page-articleshome').find('.sdlms-header').length) {
            $('.page-articleshome').find('.sdlms-header').addClass('container');
            $('.sdlms-header').find('.dropdown').remove();
        }
        
        let { featured, articles, trending, articlesNextPage } = data;

        $.each(featured, function( index, article ) {
            $("#featured-articles-carousel").append(ArticlesIndex.featuredCard(article));
        })

        $('#featured-articles-carousel').owlCarousel({
            loop: featured.length > 1 ? true : false,
            dots: true,
            items: 1,
            autoplay: true,
            autoplayTimeout: 6000,
            autoplayHoverPause: true
        })

        $('.sdlms-search-bar').on('submit', function (e) {
          e.preventDefault();
          let QUERY_URI = new URLSearchParams({
            term: $(this).find('input').val()
          });

          ajaxify.go(`${location.pathname == '/' ? '' : location.pathname}/search?${QUERY_URI}`);
        })

        $.each(trending, function( index, article ) {
            $("[trending-articles-container]").append(`<div class="col-12 col-md-6 col-lg-4">
            ${ArticlesIndex.card(article, data.baseUrl)}
            </div>`);
        })

        $('[trending-articles-container]').owlCarousel({
            //loop: true,
            margin: 30,
            dots: true,
            autoplay: true,
            autoplayTimeout: 7000,
            autoplayHoverPause: true,
            responsiveClass:true,
            responsive: {
                0:{
                    items:1,
                    nav:false
                },
                600:{
                    loop: trending.length > 2 ? true : false,
                    items:2,
                    nav:false
                },
                900: {
                    loop: trending.length > 2 ? true : false,
                    items:2,
                    nav:false
                },
                1100:{
                    loop: trending.length > 3 ? true : false,
                    items:3,
                    nav:false,
                }
            }
        })

        if (articles.length) {
          articles.forEach(function(article, index ) {
            $("[articles-container]").append(`<div data-slide-index="${index}" class="slide" style="margin-bottom: 2.4rem;">
                ${ArticlesIndex.card(article, data.baseUrl)}
            </div>`);
          });

          if (articlesNextPage) {
            $("[articles-container]").append(`<div data-slide-index="${articles.length}" class="slide" style="margin-bottom: 2.4rem;">
              ${ArticlesIndex.exploreMoreCard(articlesNextPage, data.baseUrl)}
              </div>`);

            $('#explore-more-articles').on('click', function(e) {
              e.preventDefault();
              ajaxify.go(`${location.pathname == '/' ? '' : location.pathname}/articles`);
            });
          }
        }
        
        /**
         * @date 12-05-2022
         * @author imshawan
         * @reference https://stackoverflow.com/questions/60429910/owl-carousel-multiple-rows
         */

        $(document).ready(function() {
            var el = $('[articles-container]');
            
            var carousel;
            var carouselOptions = {
              margin: 30,
              loop: false,
              dots: true,
              slideBy: 'page',
              responsive: {
                0: {
                  items: 1,
                  rows: 2 //custom option not used by Owl Carousel, but used by the algorithm below
                },
                768: {
                  items: 2,
                  rows: 3 
                },
                1100: {
                  items: 2,
                  rows: 3
                },
                1150: {
                    items: 3,
                    rows: 3 
                  }
              }
            };
          
            //Taken from Owl Carousel so we calculate width the same way
            var viewport = function() {
              var width;
              if (carouselOptions.responsiveBaseElement && carouselOptions.responsiveBaseElement !== window) {
                width = $(carouselOptions.responsiveBaseElement).width();
              } else if (window.innerWidth) {
                width = window.innerWidth;
              } else if (document.documentElement && document.documentElement.clientWidth) {
                width = document.documentElement.clientWidth;
              } else {
                console.warn('Can not detect viewport width.');
              }
              return width;
            };
          
            var severalRows = false;
            var orderedBreakpoints = [];
            for (var breakpoint in carouselOptions.responsive) {
              if (carouselOptions.responsive[breakpoint].rows > 1) {
                severalRows = true;
              }
              orderedBreakpoints.push(parseInt(breakpoint));
            }
            
            //Custom logic is active if carousel is set up to have more than one row for some given window width
            if (severalRows) {
              orderedBreakpoints.sort(function (a, b) {
                return b - a;
              });
              var slides = el.find('[data-slide-index]');
              var slidesNb = slides.length;
              if (slidesNb > 0) {
                var rowsNb;
                var previousRowsNb = undefined;
                var colsNb;
                var previousColsNb = undefined;
          
                //Calculates number of rows and cols based on current window width
                var updateRowsColsNb = function () {
                  var width =  viewport();
                  for (var i = 0; i < orderedBreakpoints.length; i++) {
                    var breakpoint = orderedBreakpoints[i];
                    if (width >= breakpoint || i == (orderedBreakpoints.length - 1)) {
                      var breakpointSettings = carouselOptions.responsive['' + breakpoint];
                      rowsNb = breakpointSettings.rows;
                      colsNb = breakpointSettings.items;
                      break;
                    }
                  }
                };
          
                var updateCarousel = function () {
                  updateRowsColsNb();
          
                  //Carousel is recalculated if and only if a change in number of columns/rows is requested
                  if (rowsNb != previousRowsNb || colsNb != previousColsNb) {
                    var reInit = false;
                    if (carousel) {
                      //Destroy existing carousel if any, and set html markup back to its initial state
                      carousel.trigger('destroy.owl.carousel');
                      carousel = undefined;
                      slides = el.find('[data-slide-index]').detach().appendTo(el);
                      el.find('.fake-col-wrapper').remove();
                      reInit = true;
                    }
          
          
                    //This is the only real 'smart' part of the algorithm
          
                    //First calculate the number of needed columns for the whole carousel
                    var perPage = rowsNb * colsNb;
                    var pageIndex = Math.floor(slidesNb / perPage);
                    var fakeColsNb = pageIndex * colsNb + (slidesNb >= (pageIndex * perPage + colsNb) ? colsNb : (slidesNb % colsNb));
          
                    //Then populate with needed html markup
                    var count = 0;
                    for (var i = 0; i < fakeColsNb; i++) {
                      //For each column, create a new wrapper div
                      var fakeCol = $('<div class="fake-col-wrapper"></div>').appendTo(el);
                      for (var j = 0; j < rowsNb; j++) {
                        //For each row in said column, calculate which slide should be present
                        var index = Math.floor(count / perPage) * perPage + (i % colsNb) + j * colsNb;
                        if (index < slidesNb) {
                          //If said slide exists, move it under wrapper div
                          slides.filter('[data-slide-index=' + index + ']').detach().appendTo(fakeCol);
                        }
                        count++;
                      }
                    }
                    //end of 'smart' part
          
                    previousRowsNb = rowsNb;
                    previousColsNb = colsNb;
          
                    if (reInit) {
                      //re-init carousel with new markup
                      carousel = el.owlCarousel(carouselOptions);
                    }
                  }
                };
          
                //Trigger possible update when window size changes
                $(window).on('resize', updateCarousel);
          
                //We need to execute the algorithm once before first init in any case
                updateCarousel();
              }
            }
          
            //init
            carousel = el.owlCarousel(carouselOptions);
          });       

        $('[sdlms-card]').on('click', function (e) {
            e.preventDefault();
            let pid = $(this).data('article-pid');
            ajaxify.go(`/articleshome/articles/view/${pid}`);
        })

        $('[data-article-pid]').on('click', function (e) {
          e.preventDefault();
          let pid = $(this).data('article-pid');
          ajaxify.go(`/articleshome/articles/view/${pid}`);
      })
    }

    ArticlesIndex.card = function (article, baseUrl) {
        let timeToRead = article.wordcount ? Math.round(Number(article.wordcount / 200)) : null;
        let imageOnError = `${ImageBase}/${Images[Math.floor(Math.random() * Images.length)]}`;

        return `
        <div>
            <div class="sdlms-card m-auto" sdlms-card=${article._id} data-article-pid=${article.pid}>
                <div class="sdlms-card-thumbnail">
                    <img src="${baseUrl}${article.image}" class="image-autofit" alt="" onerror="this.onerror=null;this.src='${imageOnError}';"></img>
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
                        <img src="${baseUrl}${article.author.picture || default_profile}" class="image-autofit" alt=""></img>
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

        // <span class="sdlms-asset-flag-2 d-flex">
        //  <img src="https://sdlms.deepthought.education/assets/uploads/files/files/count.png"  height="13px" width="13px" alt=""></img>
        //  <span class="sdlms-asset-flag-counter ml-1">${article.wordcount || 0}</span>
        // </span>
    }

    ArticlesIndex.featuredCard = function (article = {}, baseUrl = ""){
        let timeToRead = article.wordcount ? Math.round(Number(article.wordcount / 200)) : null;
        let imageOnError = `${ImageBase}/${Images[Math.floor(Math.random() * Images.length)]}`;

        return `<div class="sdlms-featured-card">
                    <div class="sdlms-featured-card-thumbnail">
                        <img src="${baseUrl}${article.image}" alt="thumbnail" class="image-autofit" style="height:160px; width:100%" onerror="this.onerror=null;this.src='${imageOnError}';">
                    </div>
                    <div category class="primary-header sdlms-featured-card-category sdlms-text-white-14px font-weight-500 p-1 pl-2 text-uppercase">
                        <div style="margin-top: 3px;">
                        ${article.category || 'deepthought'}
                        </div>
                    </div>

                    <div class="sdlms-featured-card-body p-2">
                        <div class="font-weight-bold px-1 text-ellipse-2 sdlms-featured-card-title">${article.title}</div>
                        <div content class=" p-1 sdlms-featured-card-description">
                            <div class="text-ellipse-2 sdlms-text-tertiary-18px" style="word-break: break-word;">
                                ${article.content}
                            </div>
                            <div class="sdlms-featured-card-nav">
                                <a data-article-pid=${article.pid} article-nav href="#">Continue reading...</a>
                            </div>
                        </div>
                    
                        <div class="d-flex pt-1 sdlms-featured-card-author-area">
                            <div class="featured-card-author-image">
                                <img class="image-autofit" src="${baseUrl}${article.author.picture || default_profile}" alt=""></img>
                            </div>
                            <div class="featured-card-author-info">
                                <div class="sdlms-card-author-name">
                                ${article.author.fullname || article.author.displayname || '@'+ article.author.username}
                                </div>
                                <div class="sdlms-card-author-signature text-ellipse" style="word-break: break-word;">
                                    ${article.author.signature}
                                </div>
                            </div>
                        </div>
                        <hr class="m-2">
                        <div class="d-flex justify-content-between sdlms-text-tertiary-12px">
                            <div class="pl-1">${timeToRead || 1} min read</div>
                                <div class="mr-2 d-flex">
                                    <img src="https://sdlms.deepthought.education/assets/uploads/files/view.png" alt=""></img>
                                    <span class="ml-1">${article.viewcount}</span>
                                </div>
                        </div>
                    </div>
                </div>
      `;
    }

    ArticlesIndex.exploreMoreCard = (data = [], baseUrl = "") => {
      let images = ''
      let authorImages = '';
      let imageOnError = `${ImageBase}/${Images[Math.floor(Math.random() * Images.length)]}`;
      const maxItems = 3;
      data.forEach((current, index) => {
        if (index >= maxItems) return;

        images = images + `<div style="overflow: hidden; width: ${334 / maxItems}px;">
          <img src="${baseUrl}/${current.image}" 
          height="100%"
          class="image-autofit" alt=""
          onerror="this.onerror=null;this.src='${imageOnError}';">
        </div>`;

        authorImages = authorImages + `<div 
          title="${current.author.fullname || current.author.displayname || '@'+ current.author.username}" 
          class="rounded-circle default-avatar member-overlap-item" 
          style="background: url(${baseUrl}${current.author.picture}), url(${baseUrl}${default_profile}) 0 0 no-repeat; background-size: cover;"
          onerror="this.onerror=null;this.src='${baseUrl}${current.author.picture || default_profile}';">
        </div>`
      })

      return `
          <div>
              <div class="sdlms-view-more-card m-auto">
                  <div style="height: 200px;">
                    <div class="d-flex images" style="height: 200px; transition: .3s">
                          ${images}
                    </div>
                    <div class="more-article-count">10+</div>
                  </div>
                  <div class="sdlms-card-title">
                      <div class="sdlms-asset-category-name">Explore more!</div>
                  </div>
                  <div class="sdlms-asset-title-container">
                      <div class="sdlms-asset-title" style="margin-top: 0px;font-size: 22px;line-height: 28px;">
                        Discover more from various different topics around.
                      </div>
                  </div>
                  <div class="sdlms-card-author d-flex" style="margin-top: 146px;">
                      <div style="margin-left: 15px;">
                        <div class="route d-flex">
                          ${authorImages}
                        </div>
                      </div>
                      <div class="sdlms-card-author-details">
                          <div class="sdlms-card-author-name">
                            <span class="font-weight-600">And many more</span> <span class="font-weight-400">
                              by the DeepThought community
                            </span>
                          </div>
                      </div>
                  </div>
                  <div class="sdlms-card-footer" style="margin-top: 220px;">
                      <hr>
                      <div class="d-flex justify-content-end">
                          <button id="explore-more-articles" class="btn btn-primary mr-3">
                            Explore! &nbsp; <i class="fa fa-arrow-right" aria-hidden="true"></i>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      `;
    }

    return ArticlesIndex;
});
