const articleController = module.exports;
//const privileges = require('../privileges');
const db = require('../../database');
const user = require('../../user');
const meta = require('../../meta');
const nconf = require('nconf');

const userFields = ['username', 'picture', 'fullname', 'signature'];
const collectionName = db.collections.SDLMS.ARTICLES_HOME;

articleController.get = async function (req, res) {
    const [page, limit] = [0, 8, 4];

    const ArticlesHome = {};
    ArticlesHome.title = "Article's Home";

    const [trendingArticles, articles, featured, upNext] = await Promise.all([
        db.getFieldsWithPagination(collectionName, { viewcount: { $exists: true }, status: 'published' }, limit, page, { viewcount: -1 }),
        db.getFieldsWithPagination(collectionName, { status: 'published' }, limit, page),
        db.findFields(collectionName, { featured: true, status: 'published' }),
        db.getFieldsWithPagination(collectionName, { status: 'published'}, limit, page + 1),
    ]);

    const articlesNextPage = await populateMetadata(upNext);
    ArticlesHome.trending = await populateMetadata(trendingArticles);
    ArticlesHome.articles = await populateMetadata(articles);
    ArticlesHome.featured = await populateMetadata(featured);
    ArticlesHome.articlesNextPage = articlesNextPage.map(item => { return { pid: item.pid ,author: item.author, image: item.image, category: item.category } });
    ArticlesHome.baseUrl = nconf.get('url');

    res.render("articles/index", ArticlesHome);   
}

articleController.getArticles = async function (req, res) {

    const Articles = {};
    Articles.title = 'Articles';

    let page = req.params.page;
    var perPage = meta.config.postsPerPage || 20;
	page = !isNaN(page) && page > 1 ? page - 1 : 0;

	const [articles, total] = await Promise.all([
		db.getFieldsWithPagination(collectionName, { status: 'published' }, perPage, page),
		db.countDocuments(collectionName, { status: 'published' })
	])

    Articles.articles = await populateMetadata(articles);
    Articles.baseUrl = nconf.get('url');

    Articles.pagination = {
		isPrev: page > 0,
		first: `/articleshome/articles`,
		prev: `/articleshome/articles/${page}`,
		current: page + 1,
		total: (Math.ceil(total / perPage) || 1),
		next: `/articleshome/articles/${page + 2}`,
		last: `/articleshome/articles/${(Math.ceil(total / perPage) || 1)}`,
		isNext: ((page + 2) <= Math.ceil(total / perPage)),
	};

    res.render("articles/articles", Articles);
};


articleController.viewArticle = async function (req, res) {
    const pid = Number(req.params.pid);
    const Article = {};
    let article = {};

    Article.title = 'View article';
    const homePage = nconf.get('sdlms_env') === 'development' ? '/articleshome/articles' : nconf.get('url');
    const approved = await db.findField(collectionName, { _key: `article:${pid}:approved` });
    let errorPage = {
        title: 'Not found',
        error: 'Oops! that wasn\'t found',
        message: 'The article you are looking for might have been removed, had its name changed or is temporarily unavailable.',
        homepage: homePage,
        action: 'Back to articles',
    };

    if (approved && Object.keys(approved).length != 0) {
        article = await db.findField(db.collections.DEFAULT, { pid: pid, type: 'article', status: 'published' });
        if (article) {
            let [author, category] = await Promise.all([
                user.getUserFields(article.uid, userFields),
                db.findField(db.collections.DEFAULT, { cid: article.cid }),
                db.incrementCount(db.collections.DEFAULT, { pid: pid, type: 'article' }, "viewcount"),
                db.incrementCount(collectionName, { _key: `article:${pid}:approved`}, "viewcount")
            ]);
    
            article.user = author;
            article.category = category.name;
        } else {
            return res.render("articles/error", errorPage);
        }
    } else {
        return res.render("articles/error", errorPage);
    }
    
    Article.article = article;
    Article.homepage = homePage;

    res.render("articles/article_view", Article);
}

articleController.search = async function (req, res) {
    const query = req.query.term;
    const Articles = {};

    Articles.title = `Search - ${query}`;
    Articles.query = query;

    let keys = {$or: [{title: {$regex: query, $options: '$i'}, raw: {$regex: query, $options: '$i'}}], status: 'published'};

    let page = req.params.page;
    var perPage = meta.config.postsPerPage || 20;
	page = !isNaN(page) && page > 1 ? page - 1 : 0;

	const [articles, total] = await Promise.all([
		db.getFieldsWithPagination(collectionName, keys, perPage, page),
		db.countDocuments(collectionName, keys)
	])

    Articles.articles = await populateMetadata(articles);
    Articles.baseUrl = nconf.get('url');
    Articles.total = total;
    Articles.itemsCount = articles.length;

    Articles.pagination = {
		isPrev: page > 0,
		first: `/articleshome/articles`,
		prev: `/articleshome/articles/${page}`,
		current: page + 1,
		total: (Math.ceil(total / perPage) || 1),
		next: `/articleshome/articles/${page + 2}`,
		last: `/articleshome/articles/${(Math.ceil(total / perPage) || 1)}`,
		isNext: ((page + 2) <= Math.ceil(total / perPage)),
	};

    res.render("articles/search", Articles);
}

/**
 * @author imshawan
 * @date 11-05-2022
 * @function populateMetadata
 * @description Populates metadata for the articles i.e author, category, etc
 * @param {Array} data 
 * @returns Array of objects with populated metadata
 */

async function populateMetadata (data) {
    if (typeof data != 'object') return [];
    if (data && !Array.isArray(data)) {
        data = [data]
    }
    return await Promise.all(data.map(async (item) => {
        let [userData, category] = await Promise.all([
            user.getUserFields(item.uid, userFields),
            db.findField(db.collections.DEFAULT, { $or: [{ cid: item.cid }, { cid: parseInt(item.cid) }] })
        ]);
        return { ...item, category: category.name, author: userData };
    }));
}