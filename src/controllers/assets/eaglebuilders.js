const db = require('../../database');
const ObjectId = require('mongodb').ObjectId;
const meta = require('../../meta');

const eagleBuildersController = module.exports;

eagleBuildersController.get = async function (req, res, next) {
	const id = req.query.id;
	let page = req.params.page;
	const uid = parseInt(req.uid);

	const key = {
		$or: [{
			userId: uid,
		}, {
			uid: uid,
		}],
		type: 'eaglebuilder',
	};
	const collectionName = db.collections.DEFAULT;

	var perPage = meta.config.postsPerPage || 20;
	page = !isNaN(page) && page > 1 ? page - 1 : 0;

	let [data, total] = await Promise.all([
		db.getFieldsWithPagination(collectionName, key, perPage, page),
		db.countDocuments(collectionName, key),
	]);
	const tids = data.map(function (item) {
		return (item.tid || item.topicId);
	});


	// this method is returning the topics in the same order as the data but some data is mapped to the wrong topic
	// or there are more than one topic with the same id

	const topics = (await db.findFields(collectionName, {
		tid: {
			$in: tids,
		},
		pid: {
			$eq: null,
		},
	}) || []);

	data = data.map(function (eb) {
		eb.topic = topics.find(topic => topic.tid == (eb.tid || eb.topicId));
		return eb;
	});
	const pagination = {
		isPrev: page > 0,
		first: `/myassets/eaglebuilders`,
		prev: `/myassets/eaglebuilders/${page}`,
		current: page + 1,
		total: (Math.ceil(total / perPage) || 1),
		next: `/myassets/eaglebuilders/${page + 2}`,
		last: `/myassets/eaglebuilders/${(Math.ceil(total / perPage) || 1)}`,
		isNext: ((page + 2) <= Math.ceil(total / perPage)),
	};
	res.render('sdlms/assets/eaglebuilders/index', {
		title: 'Eaglebuilders',
		data: data,
		pagination: pagination,
	});
};
eagleBuildersController.manage = async function (req, res, next) {
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
			type: 'eaglebuilder',
		};
		if (isNaN(id)) {
			key._id = ObjectId(id);
		} else {
			key.pid = Number(id);
		}
		const data = await db.findField(collectionName, key);

		if (!data) throw new Error('Link you have followed is not valid');


		data.topic = await db.findField(collectionName, {
			tid: data.topicId,
			pid: {
				$eq: null,
			},
		});

		res.render('sdlms/assets/eaglebuilders/manage', {
			title: 'Eaglebuilders',
			data: data,
		});
	} catch (error) {
		res.render('sdlms/assets/error', {
			title: 'Sharer',
			message: error.message,
		});
	}
};
