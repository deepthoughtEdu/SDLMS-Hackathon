const db = require('../../database');
const ObjectId = require('mongodb').ObjectId;
const meta = require('../../meta');
const user = require("../../user");

const articleController = module.exports;
const userFields = ['username', 'picture', 'fullname', 'signature'];

articleController.get = async function (req, res) {
	let page = req.params.page;
	const uid = parseInt(req.uid);

	const collectionName = db.collections.DEFAULT;
	const key = {
		uid: uid,
		type: 'article',
	};

	var perPage = meta.config.postsPerPage || 20;
	page = !isNaN(page) && page > 1 ? page - 1 : 0;

	const [data, total] = await Promise.all([
		db.getFieldsWithPagination(collectionName, key, perPage, page),
		db.countDocuments(collectionName, key)
	]);
	// let tids = data.map(function (item) {
	// 	return (item.tid || item.topicId);
	// });

	// let topics = (await db.findFields(collectionName, {
	// 	tid: {
	// 		$in: tids
	// 	},
	// 	pid: {
	// 		$eq: null
	// 	}
	// }) || []);

	// data = data.map(function (eb) {
	// 	eb.topic = topics.find((topic) => topic.tid == (eb.tid || eb.topicId));
	// 	return eb;
	// })
	const pagination = {
		isPrev: page > 0,
		first: `/myassets/articles`,
		prev: `/myassets/articles/${page}`,
		current: page + 1,
		total: (Math.ceil(total / perPage) || 1),
		next: `/myassets/articles/${page + 2}`,
		last: `/myassets/articles/${(Math.ceil(total / perPage) || 1)}`,
		isNext: ((page + 2) <= Math.ceil(total / perPage)),
	};
	res.render('sdlms/assets/articles/index', {
		title: 'Articles',
		data: data,
		pagination: pagination,
	});
};

articleController.manage = async function (req, res) {
	const collectionName = db.collections.DEFAULT;
	try {
		const id = req.params.id;
		const uid = parseInt(req.uid);
		const key = {
			$or: [{
				userId: uid,
			}, {
				uid: uid,
			}],
			type: 'article',
		};
		if (isNaN(id)) {
			key._id = ObjectId(id);
		} else {
			key.pid = Number(id);
		}
		const data = await db.findField(collectionName, key);

		if (!data) throw new Error('Link you have followed is not valid');

		res.render('sdlms/assets/articles/manage', {
			title: 'Articles',
			data: data,
		});
	} catch (error) {
		res.render('sdlms/assets/error', {
			title: 'Sharer',
			message: error.message,
		});
	}
};
