const assetsController = module.exports;
const meta = require('../../meta');
const db = require('../../database');

assetsController.eaglebuilders = require('./eaglebuilders');
assetsController.quizes = require('./quizes');
assetsController.articles = require('./articles');
assetsController.spreadsheets = require('./spreadsheets');
assetsController.threadbuilders = require('./threadbuilders');

assetsController.get = async function (req, res, next) {
	const collectionName = db.collections.DEFAULT;
	let page = req.params.page;
	const uid = parseInt(req.uid);

	const key = {
		$or: [{
			userId: uid,
		}, {
			uid: uid,
		}],
		type: {
			$in: ['eaglebuilder', 'spreadsheet', 'threadbuilder', 'article', 'quiz'],
		},
	};
	var perPage = meta.config.postsPerPage || 20;
	page = !isNaN(page) && page > 1 ? page - 1 : 0;

	let [data, total] = await Promise.all([
		db.getFieldsWithPagination(collectionName, key, perPage, page),
		db.countDocuments(collectionName, key),
	]);
	const tids = data.map(function (item) {
		return (item.tid || item.topicId);
	});

	const topics = (await db.findFields(collectionName, {
		tid: {
			$in: tids,
		},
		pid: {
			$eq: null,
		},
	}) || []);

	data = data.map(function (asset) {
		asset.topic = topics.find(topic => topic.tid == (asset.tid || asset.topicId));
		return asset;
	});

	const pagination = {
		isPrev: page > 0,
		first: `/myassets/explore`,
		prev: `/myassets/explore/${page}`,
		current: page + 1,
		total: (Math.ceil(total / perPage) || 1),
		next: `/myassets/explore/${page + 2}`,
		last: `/myassets/explore/${(Math.ceil(total / perPage) || 1)}`,
		isNext: ((page + 2) <= Math.ceil(total / perPage)),
	};
	res.render('sdlms/assets/index', {
		title: 'Assets',
		data: data,
		pagination: pagination,
	});
};
