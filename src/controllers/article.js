const articleController = module.exports;
// const privileges = require('../privileges');
const db = require('../database');

articleController.get = async function (req, res, next) {
	const uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect('/');
	}
	const collectionName = db.collections.DEFAULT;

	const articles = await db.findFields(collectionName, { uid: uid, type: 'article' });
	res.render('sdlms/articles', { title: 'Articles', articles: articles });
};
