const db = require("../database")
const utils = require("../controllers/utils")
const Uploader = require("../controllers/FIleUpload");

const ProfilePage = module.exports

ProfilePage.createProfile = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const tid = db.incrObjectField("global", "nextTid")
    const annecdotesPid = db.incrObjectField("global", "nextPid")
    const qualitiesPid = db.incrObjectField("global", "nextPid")
    const accoladesPid = db.incrObjectField("global", "nextpid")
    const annecdote = await db.setField(PROFILE, {
        pid: annecdotesPid,
        parent_id: tid,
        annecdotes: [],
        type: "profile_annecdotes"
    })
    if(!annecdote) throw new Error("couldn't create annecdote list")
    const quality = await db.setField(PROFILE, {
        pid: qualitiesPid,
        parent_id: tid,
        qualities: [],
        type: "qualities"
    })
    if(!quality) throw new error("couldn't create quality list")
    const accolades = await db.setField(PROFILE, {
        pid: accoladesPid,
        parent_id: tid,
        accolades,
        type: "accolades"
    })
    if(!accolades) throw new Error("couldn't create accolade list")
    const payload = {
        uid,
        tid,
        bio: req.body.bio,
        annecdotes: annecdotesPid,
        qualities: qualitiesPid,
        accolades: accoladesPid,
        assets: [],
        type: "profile"
    }
    const result = await db.setField(PROFILE, payload)
    if(!result) throw new Error("Couldn't create profile")
    return result
}

ProfilePage.updateProfile = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const tid = req.body.tid
    const keys = {
        uid,
        tid,
        type: "profile"
    }
    const result = await db.updateField(PROFILE, keys, {$set: req.body.bio ? {bio: req.body.bio} : {}})
    return {modified: result.n > 0}
}

ProfilePage.addAsset = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const tid = req.body.tid
    const keys = {
        uid,
        tid,
        type: "profile"
    }
    const payload = {
        $push: {
            assets: {$each: Array.isArray(req.body.assets) ? req.body.assets : [req.body.assets]} 
        }
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.deleteAssets = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const tid = req.body.tid
    const keys = {
        uid,
        tid,
        type: "profile"
    }
    const payload = {
        $pull: {
            assets: {$in: Array.isArray(req.body.assets) ? req.body.assets : [req.body.assets]}
        }
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.addAnecdotes = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        pid,
        parent_id,
        type: "profile_annecdotes"
    }
    const payload = {
        $push: {
            annecdotes: {$each: await Promise.all((Array.isArray(req.body.annecdotes) ? req.body.annecdotes : [req.body.annecdotes]).map(async message => {
                const annecdote_id = await db.incrObjectField("global", "pid")
                const timestamp = Date.now0
                return {
                    annecdote_id,
                    timestamp,
                    message,
                    uid
                }
            }))} 
        }
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.updateAnnecdote = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        pid,
        parent_id,
        type: "annecdotes",
        "annecdotes.annecdote_id": req.body.annecdote_id,
        "annecdotes.uid": uid
    }
    const payload = {
        "annecdotes.$.message": req.body.message
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.deleteAnnecdotes = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        uid,
        pid,
        parent_id,
        type: "profile_annecdotes"
    }
    const payload = {
        $pull: {
            annecdotes: {$in: (Array.isArray(req.body.annecdotes) ? req.body.annecdotes : [req.body.annecdotes]).map(annecdote_id => ({annecdote_id}))}
        }
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.addAccolades = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        uid,
        pid,
        parent_id,
        type: "accolades"
    }
    const payload = {
        $push: {
            annecdotes: {$each: await Promise.all((Array.isArray(req.body.accolades) ? req.body.accolades : [req.body.accolades]).map(async message => {
                const accolades_id = await db.incrObjectField("global", "pid")
                const timestamp = Date.now()
                return {
                    annecdote_id: accolades_id,
                    timestamp,
                    message
                }
            }))} 
        }
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.updateAccolade = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        uid,
        pid,
        parent_id,
        type: "accolades",
        "accolades.accolade_id": req.body.accolade_id,
    }
    const payload = {
        "accolades.$.message": req.body.message
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.deleteAccolades = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        uid,
        pid,
        parent_id,
        type: "accolades"
    }
    const payload = {
        $pull: {
            accolades: {$in: (Array.isArray(req.body.accolades) ? req.body.accolades : [req.body.accolades]).map(accolade_id => ({annecdote_id: accolade_id}))}
        }
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.addQualities = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        uid,
        pid,
        parent_id,
        type: "qualities"
    }
    const payload = {
        $push: {
            qualities: {$each: await Promise.all((Array.isArray(req.body.qualities) ? req.body.qualities : [req.body.qualities]).map(async ({message, type, annecdotes}) => {
                const quality_id = await db.incrObjectField("global", "pid")
                const timestamp = Date.now0
                const annecdotePid = await db.incrObjectField("global", "nextPid")
                const annecdote = {
                    pid: annecdotePid,
                    parent_id: quality_id,
                    annecdotes: [],
                    type: "profile_annecdotes"
                }
                const annecdoteResult = await db.setField(PROFILE, annecdote)
                if(!annecdoteResult) throw new Error("Server error! Coudn't create annecdote for quality")

                return {
                    quality_id,
                    timestamp,
                    message,
                    annecdotes: annecdotePid,
                    questions: []
                }
            }))}
        }
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.updateQuality = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        uid: uid,
        pid,
        parent_id,
        type: "qualities",
        "qualities.quality_id": req.body.quality_id,
    }
    const payload = {
        "qualities.$.message": req.body.message,
        ...(req.body.type ? {"qualities.$.message": req.body.type} : {})
    }
    const result = await db.updateField(PROFILE, keys, {$set: payload})
    return {modified: result.n > 0}
}
ProfilePage.deleteQualities = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const pid = req.body.pid
    const parent_id = req.body.parent_id
    const keys = {
        uid,
        pid,
        parent_id,
        type: "profile"
    }
    const payload = {
        $pull: {
            qualities: {$in: (Array.isArray(req.body.qualities) ? req.body.qualities : [req.body.qualities]).map(quality_id => ({quality_id}))}
        }
    }
    const result = await db.updateField(PROFILE, keys, payload)
    return {modified: result.n > 0}
}
ProfilePage.qualityAddQuestion = async req => {
    const PROFILE = db.collections.PROFILE.MAIN
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")

}
ProfilePage.getAssets = async (req) => {
    const CollectionName = db.collections.DEFAULT
    const uid = parseInt(req.uid)
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const keys = {
        $or: [{
            userId: uid
        }, { uid }],
        type: {
            $in: ['eaglebuilder', 'spreadsheet', 'threadbuilder', 'article', 'quiz']
        }
    }
    const page = req.query.page || 0
    const limit = req.query.limitBy || 5
    const assets = await db.getFieldsWithPagination(CollectionName, keys, limit, page, {timestamp: -1})
    const count = await db.countDocuments(CollectionName, keys)
    return utils.paginate(req.url, assets, count, limit, page)
}
ProfilePage.createQuality = async req => {
    const Qualities = db.collections.ProfilePage.Qualities
    const uid = parseInt(req.uid)
    if(!uid || uid < 1) throw new Error("Unauthorised")
    const payload = {
        uid,
        type: req.body.type,
        name: req.body.name,
        description: req.body.description
    }
    const uploads = await Uploader.uploadContent(req)
    uploads.forEach(upload => {
        if(upload.field !== "file") return
        payload.file = upload.url
    })
    
}

ProfilePage.get = async (req) => {
    return "API in progress"
}