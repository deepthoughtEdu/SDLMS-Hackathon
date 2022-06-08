const quizController = module.exports;
// const privileges = require('../privileges');
const db = require('../database');

quizController.get = async function (req, res, next) {
	const uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect('/');
	}
	const collectionName = db.collections.DEFAULT;
	const quizzes = await db.findFields(collectionName, { uid: uid, type: 'quiz' });

	res.render('sdlms/quizPage', { title: 'Quizzes', quizzes: quizzes });
};
