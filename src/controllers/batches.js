const winston = require('winston');
const privileges = require('../privileges');
const db = require('../database');

const batchesController = module.exports;

batchesController.get = async function (req, res, next) {
	const uid = parseInt(req.uid);
	const isTeacher = await privileges.users.isTeacher(uid);
	if (!isTeacher) {
		throw new Error('Unauthorized! Only teachers can access this page');
	}
	res.render('sdlms/batches', { title: 'Batches' });
};

batchesController.getByCid = async function (req, res, next) {
	const uid = parseInt(req.uid);
	const isTeacher = await privileges.users.isTeacher(uid);
	const collectionName = db.collections.DEFAULT;
	if (!isTeacher) {
		throw new Error('Unauthorized! Only teachers can access this page');
	}
	const Batch = {};
	Batch.title = 'Manage Batch';

    const cid = parseInt(req.params.cid);
    const [batchData, cohorts, sessions, teaching_styles] = await Promise.all([
        db.findField(collectionName, { categoryType: 'batch', cid: cid }),
        db.findFields(collectionName, { type: 'cohort'}, ['name', 'slug']),
        db.findFields(collectionName, { batchCategoryId: cid, type: 'session'}),
        db.findFields(db.collections.SDLMS.TEACHING_STYLE, { type: 'teaching_style' }, ['name', 'slug', 'TeachingStyleId'])
    ])
    if (!batchData) throw new Error('Invalid batch');
    Batch.batch = batchData;
    if (batchData) { Batch.title = batchData.name }

    Batch.cohorts = [];
    Batch.sessions = sessions;
    Batch.teaching_styles = teaching_styles;

	if (cohorts) {
		Batch.cohorts = await Promise.all(cohorts.map(async (cohort) => {
			const members = await db.findFields(collectionName, { _key: `group:${cohort.name}:members` });
			if (members) return { ...cohort, members: members.map(member => parseInt(member.value)) };
			return { ...cohort, members: [] };
		}));
	}

	return res.render('sdlms/batch', Batch);
};
