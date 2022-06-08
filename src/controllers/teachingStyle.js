const db = require('../database');
const helpers = require('../controllers/helpers');
const slugify = require("../slugify");
const utils = require('./utils');

const teachingStyleController = module.exports;
const collectionName = db.collections.SDLMS.TEACHING_STYLE;

const TeachingStyleFields = ['intents', 'processes', 'speaker_emotions', 'emoticons', 'feedbacks'];
teachingStyleController.get = async function (req, res) {   
    const uid = parseInt(req.uid);
	if (!uid) {
		return res.redirect(`/login?share_redirect=true&url=/teachingstyles`);
	} 

    const TeachingStyle = {};
    TeachingStyle.title = "Teaching Styles";
    TeachingStyle.teachingStyles = await db.findFields(collectionName, { type: 'teaching_style' }, ['name', 'slug', 'TeachingStyleId']);

    res.render("sdlms/teaching_style/index", TeachingStyle);
};

teachingStyleController.getBySlug = async function (req, res) {
    const uid = parseInt(req.uid);
    const slug = req.params.slug;

	if (!uid) {
		return res.redirect(`/login?share_redirect=true&url=/teachingstyles/${slug}`);
	}
    const TeachingStyle = {};
    TeachingStyle.teachingStyle = await db.findField(collectionName, { type: 'teaching_style', slug: slug });

    res.render("sdlms/teaching_style/teaching_style", TeachingStyle);
};

teachingStyleController.create = async function (req, res) {
    const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) { throw new Error("Unauthorized"); }
    
    const { name } = req.body;
    const currentTime = Date.now();
    const TeachingStyleId = await db.incrObjectField('global', 'nextTeachingStyleId');
    const payload = { 
        _key: `teaching_style:${TeachingStyleId}`,
        uid,
        TeachingStyleId,
        name, 
        slug: slugify(name),
        createdAt: currentTime,
        updatedAt: currentTime,
        type: 'teaching_style',
    };
    TeachingStyleFields.forEach((field) => {
        if (req.body[field]) {
            console.log(req.body[field]);
            console.log(typeof req.body[field]);
            if (utils.isJSON(req.body[field])) {
                if (!Array.isArray(req.body[field])) {
                    payload[field] = JSON.parse(req.body[field])
                } else {
                    payload[field] = req.body[field];
                }
            }
            else payload[field] = JSON.parse(req.body[field]);
        }
    });

    const resp = await db.setField(collectionName, payload);
    helpers.formatApiResponse(200, res, { id: resp.TeachingStyleId, slug: resp.slug });
}

teachingStyleController.update = async function (req, res) {
    const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) { throw new Error("Unauthorized"); }

    const TeachingStyleId = parseInt(req.params.id);
    if (!TeachingStyleId) { throw new Error("Invalid Teaching Style id"); }

    const keys = {
        uid,
        type: 'teaching_style',
        TeachingStyleId: TeachingStyleId,
    }

    const payload = {};
    if (req.body.name) {
        payload.name = req.body.name;
        payload.slug = slugify(req.body.name);
    }
    TeachingStyleFields.forEach((field) => {
        if (req.body[field]) {
            if (utils.isJSON(req.body[field])) {
                if (!Array.isArray(req.body[field])) {
                    payload[field] = JSON.parse(req.body[field])
                } else {
                    payload[field] = req.body[field];
                }
            }
            else payload[field] = JSON.parse(req.body[field]);
        }
    });

    payload.updatedAt = Date.now();

    const resp = await db.updateField(collectionName, keys, { $set: payload }, { upsert: false });
    helpers.formatApiResponse(200, res, { updated: resp && resp.result && resp.result.n === 1 } );
}

teachingStyleController.delete = async function (req, res) {
    const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) { throw new Error("Unauthorized"); }

    const TeachingStyleId = parseInt(req.params.id);
    if (!TeachingStyleId) { throw new Error("Invalid teachingStyle id"); }

    const keys = {
        type: 'teaching_style',
        uid,
        TeachingStyleId,
    }
    const response = await db.removeField(collectionName, keys);
    helpers.formatApiResponse(200, res, { deleted: response && response.result && response.result.n === 1 });
}

teachingStyleController.getTeachingStyles = async function (req, res) {
    const uid = parseInt(req.uid);
	if (!req.uid || uid < 1) { throw new Error("Unauthorized"); }

    let TeachingStyle = {};
	let count = 0;
    const page = parseInt(req.query.page) || 0;
	const limit = parseInt(req.query.limit) || 5;
    const keys = {
        type: 'teaching_style',
    };

    [TeachingStyle, count] = await Promise.all([
        db.getFieldsWithPagination(collectionName, keys, limit, page),
        db.countDocuments(collectionName, keys),
    ]);

    helpers.formatApiResponse(200, res, utils.paginate(`/sdlms${req.url}`, TeachingStyle, count, limit, page));
}