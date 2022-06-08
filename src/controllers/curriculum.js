const db = require('../database');
const helpers = require('../controllers/helpers');
const slugify = require("../slugify");
const utils = require('./utils');

const curriculumController = module.exports;

const collectionName = db.collections.SDLMS.CURRICULUM;

curriculumController.get = async function (req, res) {   
    const uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect(`/login?share_redirect=true&url=/curriculums`);
	} 

    const Curriculum = {};
    Curriculum.title = "Curriculums";
    [Curriculum.curriculums, Curriculum.teaching_styles] = await Promise.all([
        db.findFields(collectionName, { type: 'curriculum' }, ['name', 'slug','uid']),
        db.findFields(db.collections.SDLMS.TEACHING_STYLE, { type: 'teaching_style' }, ['name', 'slug', 'TeachingStyleId'])
    ]);

    res.render("sdlms/curriculum/curriculums", Curriculum);
};

curriculumController.getBySlug = async function (req, res) {
    const uid = parseInt(req.uid);
    const slug = req.params.slug;

	if (!uid) {
		return res.redirect(`/login?share_redirect=true&url=/curriculums/${slug}`);
	}
    const Curriculum = {};
    Curriculum.title = "Manage curriculums";
    [Curriculum.curriculum, Curriculum.teaching_styles] = await Promise.all([
        db.findField(collectionName, {slug: slug }),
        db.findFields(db.collections.SDLMS.TEACHING_STYLE, { type: 'teaching_style' }, ['name', 'slug', 'TeachingStyleId'])
    ]);

    res.render("sdlms/curriculum/curriculum", Curriculum);
};

curriculumController.create = async function (req, res) {
    const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) { throw new Error("Unauthorized"); }

    const { name, teaser, teaching_style, TeachingStyleId } = req.body;

    let sessions = [];
    if (req.body.sessions) {
        if (utils.isJSON(req.body.sessions)) {
            if (!Array.isArray(req.body.sessions)) {
                sessions = JSON.parse(req.body.sessions)
            } else {
                sessions = req.body.sessions;
            }
        }
        else sessions = JSON.parse(req.body.sessions);
    }
    const curriculumId = await db.incrObjectField('global', 'nextCurriculumId');
    const currentTime = Date.now();
    const payload = {
        _key: `curriculum:${curriculumId}`,
        uid,
        curriculumId,
        name, 
        slug: slugify(name),
        teaser, 
        teaching_style, 
        TeachingStyleId,
        sessions,
        createdAt: currentTime,
        updatedAt: currentTime,
        type: 'curriculum',
    }

    const resp = await db.setField(collectionName, payload);
    helpers.formatApiResponse(200, res, { id: resp.curriculumId, slug: resp.slug });
}

curriculumController.update = async function (req, res) {
    const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) { throw new Error("Unauthorized"); }

    const curriculumId = parseInt(req.params.id);
    if (!curriculumId) { throw new Error("Invalid curriculum id"); }

    const keys = {
        type: 'curriculum',
        curriculumId: curriculumId,
    }

    const payload = {};
    ['name', 'teaser','teaching_style', 'TeachingStyleId'].forEach((field) => {
        if (req.body[field]) {
            payload[field] = req.body[field];
        }
    })

    let sessions = [];
    if (req.body.sessions) {
        if (utils.isJSON(req.body.sessions)) {
            if (!Array.isArray(req.body.sessions)) {
                sessions = JSON.parse(req.body.sessions)
            } else {
                sessions = req.body.sessions;
            }
        }
        else sessions = JSON.parse(req.body.sessions);
    }
    if (sessions.length) payload.sessions = sessions;
    if (payload.name) payload.slug = slugify(payload.name);
    payload.updatedAt = Date.now();

    const resp = await db.updateField(collectionName, keys, { $set: payload }, { upsert: false });
    helpers.formatApiResponse(200, res, { updated: resp && resp.result && resp.result.n === 1 } );
}

curriculumController.delete = async function (req, res) {
    const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) { throw new Error("Unauthorized"); }

    const curriculumId = parseInt(req.params.id);
    if (!curriculumId) { throw new Error("Invalid curriculum id"); }

    const keys = {
        type: 'curriculum',
        uid,
        curriculumId,
    }
    const response = await db.removeField(collectionName, keys);
    helpers.formatApiResponse(200, res, { deleted: response && response.result && response.result.n === 1 });
}

curriculumController.getCurriculums = async function (req, res) {
    const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) { throw new Error("Unauthorized"); }

    let curriculums = {};
	let count = 0;
    const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 5;
    const keys = {
        type: 'curriculum',
    };

    [curriculums, count] = await Promise.all([
        db.getFieldsWithPagination(collectionName, keys, limit, page),
        db.countDocuments(collectionName, collectionName, keys),
    ]);

    helpers.formatApiResponse(200, res, utils.paginate(`/sdlms${req.url}`, curriculums, count, limit, page));
}