"use strict";
var meta = require('../meta');

const groups = require('../groups');
const _ = require('lodash');
const categories = require('../categories');
const db = require('../database');
const user = require('../user');
const topics = require('../topics');
const plugins = require('../plugins');
const slugify = require('../slugify');
const winston = require('winston');
const Uploader = require('../controllers/FIleUpload');
const ObjectId = require('mongodb').ObjectId;
const nconf = require('nconf');
const axios = require('axios');
const { privileges } = require('../controllers/admin');
const userPrivileges = require('../privileges');
const utils = require('../controllers/utils');


const dtthon = module.exports;


/** 
    * @author: Shubham Bawner
    * @description: crud for project
*/

/**for testing: "tid": 370 */

dtthon.createProject = async function (req, res, next) {
    try {

        //db.creditDetails.insertOne({test: "test"});
        console.log("createProject", req.body);
        let tag = req.body.tags ?? [];


       
        const payload = {

            mainPid: 0,
            lastposttime: 0,
            postcount: 0,
            viewcount: 0,
            cid: parseInt(req.body.cid),
            uid: req.uid, // recruiter uid
            mainPid: 0,
            title: req.body.title ?? "",//*

            globalTags: tag ?? [], //! store slugified tag names as: tag:<slugified_tag_name>, use _key aspect of tag    

            type: "project",
            tasks: [],//*
            status: req.body.status ?? "draft", // published, draft, closed, visible

            short_description: req.body.short_description ?? "",//*
            description: req.body.description ?? "",//*
            start_time: null,//*
            //end_time: (Array.isArray(req.body.end_time) ? req.body.end_time : JSON.parse(req.body.end_time)).map(N => parseInt(N)),
            learning_outcomes: req.body.learning_outcomes ?? [],
            pre_requisites: req.body.pre_requisites ?? [],
            project_image: req.body.project_image ?? "",

            tools: req.body.tools ?? [],
        }

        const tid = await createDtThonTopic(payload);
        console.log(payload)
        return { tid };
    } catch (e) { 
        console.error(e); 
        throw new Error(e.message);;
    }

}

/**
 * published: see and make submission
 * visible: see but not make submission
 * draft: not visible
 * closed: not visible, end time is noted while closing it.
 */

dtthon.editProject = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        const luid = parseInt(req.uid);
        if (!req.uid || luid < 1) throw new Error("Unauthorized");

        const keys = {
            uid: luid,
            tid: parseInt(req.body.tid)
        }
        let parsedData = {};

        if (req.body.content) parsedData.content = req.body.content;
        if (req.body.title) parsedData.title = req.body.title;
        if (req.body.short_description) parsedData.topic_tid = req.body.short_description;
        if (req.body.description) parsedData.description = req.body.description;
        if (req.body.start_time) parsedData.start_time = req.body.start_time;
        //if (req.body.end_times) parsedData.end_time = req.body.end_times;
        if (req.body.project_image) parsedData.project_image = req.body.project_image;
        if (req.body.pre_requisites) parsedData.uploaded_images = req.body.pre_requisites;
        if (req.body.learning_outcomes) parsedData.uploaded_images = req.body.learning_outcomes;
        if (req.body.status) {
            parsedData.status = req.body.status;
            if (req.body.status == "published") {
                parsedData.start_time = Date.now();
            }
            if (req.body.status == "closed") {
                parsedData.end_time = Date.now();
            }
        }

        const state = await db.updateFieldWithMultipleKeys(collectionName, keys, parsedData);
        if (!state) { throw new Error("Unauthorized write access!"); }
        return state;
    } catch (e) { console.error(e); throw new Error(e.message); ;}
}

dtthon.getProjects = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        //get 1 project with a tid
        console.log(req.body)
        const uid = parseInt(req.uid)
        // let requirments = req.body.requirments ? (Array.isArray(req.body.requirments) ? req.body.requirments : JSON.parse(req.body.requirments)) : [];
        const isRecruiter = req.query.isRecruiter && await userPrivileges.users.isRecruiter(uid);
        if (req.query.tid) {
            const tid = parseInt(req.query.tid);
            if (!tid || tid < 1) throw new Error("Invalid tid");

            const keys = {
                tid: tid,
                status: { $regex: isRecruiter ? "published|draft|visible|closed" : "published|visible" }
            }

            const Project = await db.findField(collectionName, keys);

            if (!Project) { throw new Error("No Project found!"); }
            Project.recruiter = await user.getUserFields([Project.uid], [
                "username",
                "fullname",
                "userslug",
                "picture",
            ]);
            return Project;
        }

        //(get all projects for perticular filters, no login needed)

        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limitBy) || 5;
        let keys = {
            type: "project",
            status: { $regex: "published|closed|visible" }
        }



        if (req.query.fromDate || req.query.toDate || req.query.from || req.query.to) keys = { ...keys, ...getKeysByTime(req, isRecruiter ? "timestamp" : "start-time") }
        if (req.query.tags) {
            let tags = Array.isArray(req.query.tag) ? req.query.tag : [req.query.tag];
            keys = { ...keys, globalTags: { $regex: `${tags.join("$|")}$` } } // $ sign in regex is for newline, this is added for not getting webdevelopement when searching for tag web 
            //console.log(`tag:${req.query.tags.join("$|tag:")}$`)
        }
        // did not use internal functionality of isRecruiter, because: recruiter may want to see all projects on forum that are not made by him (just like applicant)
        if (isRecruiter) {
            keys.uid = req.uid;
            keys.status = { $regex: "published|closed|draft|visible" }
        }
        if (req.query.cid) keys.cid = parseInt(req.query.cid);

        
        let Projects = null;
        
        Projects = await db.findFieldsWithPagination(collectionName, keys, limit, page, {timestamp:-1})
        let count = await db.countDocuments(collectionName, keys);

        if (!Projects) { throw new Error("Unauthorized write access!"); }
        if (!isRecruiter) {
            Projects = await Promise.all(Projects.map(async (elem) => {
                let recruiter = await user.getUserFields([elem.uid], [
                    "username",
                    "fullname",
                    "userslug",
                    "picture",
                ]);
                return { ...elem, recruiter }
            }));
        }
            
        Projects = await Promise.all(Projects.map(async (elem) => {
            let macrodata = {};
            const applicant_count = await db.countDocuments(collectionName, { type: "submissionInfo", tid: elem.tid }); //count of applicants

            const pending_count = await db.countDocuments(collectionName, 
                { type: "submissionInfo", tid: elem.tid,  "submission_history.eval_status":"pending"}
            ); //count of pending applicants
            const reAsigned_count = await db.countDocuments(collectionName, 
                { type: "submissionInfo", tid: elem.tid,  "submission_history.eval_status":"re-asigned"}
            ); //count of pending applicants


            // macrodata.pending_count = 50; //count of  applicants

            return { ...elem, macrodata: {applicant_count, pending_count, reAsigned_count} }
        }));
        
        return utils.paginate(`/apps${req.url}`, Projects, count, limit, page);
    } catch (e) { console.error(e);throw new Error(e.message); }

}
dtthon.getCustomProjects = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        //get 1 project with a tid
        let requirments = req.query.requirments 
        console.log(requirments)
        if(!Array.isArray(requirments)) requirments = [requirments]

        if(!requirments.length) throw new Error("Invalid requirments passed!");

        //(get all projects for perticular filters, no login needed)

        const isRecruiter = req.query.isRecruiter ? JSON.parse(req.query.isRecruiter.toLowerCase()) : false;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limitBy) || 5;
        let keys = {
            type: "project",
            status: { $regex: "published|closed" }
        }



        if (req.query.fromDate || req.query.toDate || req.query.from || req.query.to) keys = { ...keys, ...getKeysByTime(req, isRecruiter ? "timestamp" : "start-time") }
        if (req.query.tags) {
            let tags = Array.isArray(req.query.tag) ? req.query.tag : [req.query.tag];
            keys = { ...keys, globalTags: { $regex: `${tags.join("$|")}$` } } // $ sign in regex is for newline, this is added for not getting webdevelopement when searching for tag web 
            //console.log(`tag:${req.query.tags.join("$|tag:")}$`)
        }
        // did not use internal functionality of isRecruiter, because: recruiter may want to see all projects on forum that are not made by him (just like applicant)
        if (isRecruiter) {
            keys.uid = req.uid;
            keys.status = { $regex: "published|closed|draft" }
        }
        if (req.query.cid) keys.cid = parseInt(req.query.cid);

        
        let Projects = null;
        
            let requirmentsKey = {}
            requirments.forEach(requirment => {
                requirmentsKey[requirment] = `$${requirment}`
            })
            console.log(requirmentsKey, keys)
            Projects = await db.Aggregate(collectionName, [{$match:keys},{$sort:{timestamp:-1}},{$skip:page * limit},{$limit:limit} , {$project:requirmentsKey}])
            //console.log(Projects, typeof projects)
        
        let count = await db.countDocuments(collectionName, keys);

        if (!Projects) { throw new Error("Unauthorized write access!"); }
        if (!isRecruiter && requirments.indexOf("recruiter") != -1) {
            Projects = await Promise.all(Projects.map(async (elem) => {
                let recruiter = await user.getUserFields([elem.uid], [
                    "username",
                    "fullname",
                    "userslug",
                    "picture",
                ]);
                return { ...elem, recruiter: recruiter }
            }));
        }
            
        if(requirments.indexOf("macrodata") > -1)
        Projects = await Promise.all(Projects.map(async (elem) => {
            let macrodata = {};
            macrodata.applicant_count = await db.countDocuments(collectionName, { type: "submissionInfo", tid: elem.tid }); //count of applicants

            macrodata.pending_count = await db.countDocuments(collectionName, 
                { type: "submissionInfo", tid: elem.tid,  "submission_history.eval_status":"pending"}
            ); //count of pending applicants
            macrodata.reAsigned_count = await db.countDocuments(collectionName, 
                { type: "submissionInfo", tid: elem.tid,  "submission_history.eval_status":"re-asigned"}
            ); //count of pending applicants


            // macrodata.pending_count = 50; //count of  applicants

            return { ...elem, macrodata:macrodata }
        }));
        
        return utils.paginate(`/apps${req.url}`, Projects, count, limit, page);
    } catch (e) { console.error(e);throw new Error(e.message); }

}

dtthon.deleteProject = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try{ 
    const tid = req.body.tid;

    const uid = parseInt(req.uid);
    if (!uid || uid < 1) throw new Error("unauthorised!");

    const keys = {
        tid: tid,
        type: "project",
        uid: uid
    }

    const state = await db.removeField(collectionName, keys);
    if (state.result.n === 1) { return { deleted: true } }
    else { return { deleted: false } }

} catch (e) { console.error(e); throw new Error(e.message);}

}

/** 
    * @author: Shubham Bawner
    * @description: crud for task
*/
dtthon.addTask = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        const luid = parseInt(req.uid);
        if (!req.uid || luid < 1) throw new Error("Unauthorized");
        const tid = req.body.tid;

        const keys = {
            uid: luid,
            tid: tid,
            type: "project"
        }

        console.log(req.body.task, typeof req.body.task)

        let task = req.body.task;
        let task_id = await db.incrObjectField('global', 'nextPid'); // task id
        let taskData = {
            task_id: task_id,
            task_title: task.task_title ?? "", 
            task_description: task.task_description ?? "", 
            // tools: task.tools ? Array.isArray(task.tools) ?  task.tools :JSON.parse(task.tools) : [],
            // assets: task.assets ? Array.isArray(task.assets) ?task.assets: JSON.parse(task.assets) : [],
            tools: task.tools ?? [],
            assets: [],
        }

        let state = await db.update(collectionName, keys, { $push: { tasks: taskData } });
        if (!state) { throw new Error("Unauthorized write access!"); }

        console.log(taskData)
        return { task_id };
    } catch (e) { console.error(e); throw new Error(e.message);; }
}

//? I am not verifying what data they are sending, not even keys...
dtthon.editTask = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        const luid = parseInt(req.uid);
        if (!req.uid || luid < 1) throw new Error("Unauthorized");
        const tid = parseInt(req.body.tid);
        const task_id = parseInt(req.body.task_id);

        const keys = {
            uid: luid,
            tid,
            type: "project",
            "tasks.task_id": task_id
        }

        const task = req.body.task

        const taskData = {}

        for (const key in task) {
            taskData[`tasks.$.${key}`] = task[key]
        }

        console.log(taskData)

        return await db.update(collectionName, keys, { $set: { ...taskData } });

    } catch (e) { console.error(e); throw new Error(e.message);}
}

dtthon.deleteTask = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        const luid = parseInt(req.uid);
        if (!req.uid || luid < 1) throw new Error("Unauthorized");
        const tid = parseInt(req.body.tid);
        const task_id = parseInt(req.body.task_id);

        const keys = {
            uid: luid,
            tid: tid,
            type: "project",
        }
        console.log(keys)
        const status = await db.update(collectionName, keys, { $pull: { tasks: { task_id } } })
        return {deleted: status.updated};

    } catch (e) { console.error(e); throw new Error(e.message);;}

}


/** 
    * @author: Shubham Bawner
    * @description: crud for Asset
*/
dtthon.addAsset = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        const uid = parseInt(req.uid);
        if(!uid || uid < 1) throw new Error("Unauthorized")
        const keys = {
            uid,
            tid: req.body.tid,
            type: "project",
            "tasks.task_id": req.body.task_id
            // "tasks.$.assets.asset_id": asset_id
        }

        const asset = req.body.asset;
        // if(!asset.asset_content) throw new Error("asset content title is required");
        const asset_id = await db.incrObjectField('global', 'nextPid'); // task id
        const assetData = {
            asset_id: asset_id,
            asset_title: asset.asset_title ,
            asset_description: asset.asset_description ?? "", 
            asset_type: asset.asset_type ?? "input_asset", // input_asset or display_asset
            asset_content: asset.asset_content, // tb, eb, article, reflection, quiz, other
            display_asset_url: asset.asset_type === "display_asset" ? asset.asset_url ?? "" : null,
            display_asset_image: asset.asset_type === "display_asset" ? asset.asset_image ?? "" : null,
            display_asset_video: asset.asset_type === "display_asset" ? asset.asset_video ?? "" : null,
            display_asset_docs: asset.asset_type === "display_asset" ? asset.asset_docs ?? "" : null,
            display_tb_tid: asset.asset_type === "display_asset" && asset.asset_content === "tb" ? asset.tb_tid ?? 0 : null,
            display_tb_pid: asset.asset_type === "display_asset" && asset.asset_content === "tb" ? asset.tb_pid ?? 0 : null,
            display_eb_tid: asset.asset_type === "display_asset" && asset.asset_content === "eb" ? asset.eb_tid ?? 0 : null,
            display_eb_pid: asset.asset_type === "display_asset" && asset.asset_content === "eb" ? asset.eb_pid ?? 0 : null,
            display_asset_reflection: asset.asset_type === "display_asset" && asset.asset_content === "reflection" ? asset.asset_reflection ?? "" : null,
        }
        
        const state = await db.update(collectionName, keys, { $push: { "tasks.$.assets": assetData } });
        if (!state) { throw new Error("Unauthorized write access!"); }

        console.log(assetData)
        return { asset_id };
    } catch (e) { console.error(e); throw new Error(e.message);; }
}

//? I am not verifying what data they are sending, not even keys...
dtthon.editAsset = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        const uid = req.uid;
        const tid = req.body.tid;
        const task_id = req.body.task_id;
        const asset_id = req.body.asset_id;

        const keys = {
            uid: uid,
            tid: tid,
            type: "project",
        }
        

        let asset = req.body.asset
        const project = await db.findField(collectionName, {...keys, "tasks.task_id": task_id, "tasks.assets.asset_id": asset_id})
        if(!project) throw new Error("No such asset found")
        const previousAsset = project.tasks?.find(task => task.task_id === task_id)?.assets?.find(asset => asset.asset_id === asset_id)
        if(!previousAsset) throw new Error("No such asset found")
        const assetData = {
            ...[
                "asset_title", 
                "asset_description", 
                "asset_type", 
                "asset_content"
            ].reduce(
                (assetData, key) => asset[key] ? {...assetData, [`tasks.$[outer].assets.$[inner].${key}`]: asset[key]} : assetData, 
                {}
            ),
            ...[
                "asset_url",
                "asset_image",
                "asset_video",
                "asset_docs"
            ].reduce((assetData, key) => {
                if(asset.asset_type === "input_asset") return {...assetData, [`tasks.$[outer].assets.$[inner].display_${key}`]: null}
                if(asset[key] == null) return assetData;

                if(asset.asset_type === "display_asset") return {...assetData, [`tasks.$[outer].assets.$[inner].display_${key}`]: asset[key]}
                if(previousAsset.asset_type === "display_asset") return {...assetData, [`tasks.$[outer].assets.$[inner].display_${key}`]: asset[key]}
                return {...assetData, [`tasks.$[outer].assets.$[inner].display_${key}`]: null}

            }, {}),
            ...[
                "tb_tid",
                "tb_pid",
                "eb_tid",
                "eb_pid",
                "asset_reflection"
            ].reduce((assetData, key) => {
                if(asset.type === "input_asset") return {...assetData, [`tasks.$[outer].assets.$[inner].display_${key}`]: null}
                if(asset[key] == null) return assetData

                if(
                    (asset.asset_type === "display_asset" || previousAsset.asset_type === "display_asset") 
                    && (
                        asset.asset_content === key.replace(/\_tid$|\_pid$^asset\_/, "")
                        || previousAsset.asset_content === key.replace(/\_tid$|\_pid$|^asset\_/, "")
                    )
                ) return {...assetData, [`tasks.$[outer].assets.$[inner].display_${key}`]: asset[key]}
                return {...assetData, [`tasks.$[outer].assets.$[inner].display_${key}`]: null}
            })
        }
        let arrayFilterOptions = {arrayFilters: [{"outer.task_id": task_id}, {"inner.asset_id": asset_id}]}
        
        let query = [keys,{ $set: { ...assetData }}, arrayFilterOptions]

        console.log(query)
        console.log(collectionName)
        return {"modified": (await db.updateField(collectionName, ...query)).n > 0};

    } catch (e) { console.error(e); throw new Error(e.message);}
}

dtthon.deleteAsset = async function (req, res, next) {
    const collectionName = db.collections.DEFAULT;
    try {
        const luid = parseInt(req.uid);
        if (!req.uid || luid < 1) throw new Error("Unauthorized");

        const tid = parseInt(req.body.tid);

        const task_id = parseInt(req.body.task_id);

        const asset_id = parseInt(req.body.asset_id);

        const keys = {
            uid: luid,
            tid: tid,
            type: "project",
        }
        const arrayFilterOptions = {arrayFilters: [{"outer.task_id" : task_id}]}
        const status = await db.updateField(collectionName, keys, {$pull: {"tasks.$[outer].assets": {asset_id} }}, arrayFilterOptions)
        return {"deleted": status.result.n > 0};

    } catch (e) { console.error(e); throw new Error(e.message);;}

}


dtthon.getSubmissions = async req => {
    const collectionName = db.collectionField.DEFAULT
    const uid = parseInt(req.uid)
    if(!uid || uid < 1)throw new Error("Unauthorised")
    const isRecruiter = req.body.isRecruiter && await userPrivileges.users.isRecruiter(uid)
    const pid = req.body.pid
    if(pid) {
        const keys = {
            pid,
            type: "submission"
        }
        const submission = await db.findField(collectionName, isRecruiter ? {
            ...keys, 
            status: {
                $regex: "^(?!in_progress)+$"
            }
        } : {
            ...keys,
            uid
        })
        if(!submission) throw new Error("No submission found")
        return submission
    }
    const tid = req.body.tid
    const keys = {
        status: {
            $regex: isRecruiter ? "^(?!in_progress)$" : "^(submitted|accepted|rejected)$"
        },
        type: "submission"
    }
    const result = await db.findField(collectionName, tid ? {...keys, tid} : keys)
    if(!result) throw new Error("No submission found!")
    return result
}
dtthon.createSubmission = async req => {
    const collectionName = db.collections.DEFAULT
    const uid = parseInt(req.uid)

    if(!uid || uid < 1) throw new Error("Unauthorised")

    const tid = req.body.tid
    const timestamp = req.body.timestamp ?? Date.now()

    const project = await db.findField(collectionName, { type: "project", tid, status: "published" })
    if(!project) throw new Error("No project found!")

    const recruiter_uid = project.uid
    const tasks = project.tasks.map(task => {
        const innitialTaskSubmission = req.body.tasks.find(
            taskSubmission => taskSubmission.task_id === task.task_id
        )
        const assets = task.assets.reduce((assets, asset) => {
            if(Asset.asset_type !== "input_asset") return assets
            const innitialAssetSubmission = innitialTaskSubmission?.assets.find(
                assetSubmission => assetSubmission.asset_id === Asset.asset_id
            )
            return [
                ...assets,
                {
                    asset_id: asset.asset_id,
                    type: asset.asset_type_content,
                    comment: "",
                    content: innitialAssetSubmission?.content ?? null
                }
            ]
        }, [])
        return {
            task_id: task.task_id,
            status: "in_progress",
            assets
        }
    })
    const pid = await db.incrObjectField('global', 'nextPid');
    const submissionHistoryPid = await db.incrObjectField("global", "nextPid");
    const submission = {
        pid,
        uid,
        tid,
        timestamp,
        recruiter_uid,
        tasks,
        status: req.body.tasks == null ? "pending" : "in_progress",
        type: "submission"
    }
    await db.setField(collectionName, {
        pid: submissionHistoryPid,
        uid,
        recruiter_uid,
        currentSubmission: null,
        history: [],
        type: "submission_history",
        submission_pid: pid
    })
    return await db.setFielfd(collectionName, submission)
}
dtthon.updateSubmission = async req => {
    const collectionName = db.collections.DEFAULT
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unauthorised")

    const pid = req.body.pid
    if(req.body.task.length < 1) throw new Error("Nothing changed!")
    const keys = {uid, pid, type: "submission", status: {
        $regex: "^(re_assigned|in_progress|pending)$"
    }}
    const submission = await db.findField(collectionName, keys)
    if(!submission) throw new Error("Can't update submission!")
    const updates = formatTasksForUpdate(req.body.tasks, submission)
    const result = await db.updateField(collectionName, keys, {
        ...updates,
        status: "in_progress"
    })
    return {"modified": result.n > 0};
}
dtthon.submitSubmission = async req => {
    const collectionName = db.collections.DEFAULT
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unathorised")
    const pid = req.body.pid
    const submission = await db.findField(collectionName, {uid, pid, type: "submission"})
    const submittedTasks = submission.tasks.map(task => ({
        task_id: task.task_id,
        submittedAssetNumber: task.assets.reduce(
            (submittedAssetNumber, asset) => asset.content ? submittedAssetNumber + 1 : submittedAssetNumber, 0
        )
    }))
    const submittedTaskNumber = submittedTasks.reduce((submittedTaskNumber, submittedTasks, index) => (
        submission.tasks[index].assets.length > submittedTasks.submittedAssetNumber 
        ? submittedTaskNumber 
        : submittedTaskNumber + 1
    ), 0 )
    const totalSubmittedAssets = submittedTasks.reduce((totalSubmittedAssets, submittedTask) => (
        totalSubmittedAssets + submittedTask.submittedAssetNumber
    ),0)
    const completed = submittedTaskNumber >= submission.tasks.length
    if(!(req.body.task == null ? /^(reassigned|in\_progress)$/ : /^(reassigned|in\_progress|pending)$/).test(submission.status)) throw new Error("Can't submit to this project!")

    const result = await db.updateField(collectionName, {
        uid,
        pid,
        type: "submission",
        ...formatTasksForUpdate(req.body.tasks, submission)
    }, {$set: {status: "submitted"}})
    await db.updateField(collectionName, {
        uid,
        submission_pid: pid,
        type: "submission_history"
    }, {$set: {currentSubmission: {
        submission_time: Date.now(),
        submittedTasks,
        submittedTaskNumber,
        totalSubmittedAssets,
        completed,
        reviewStatus: "not_reviewed",
        submission
    }}})
    return result

}

dtthon.reviewSubmission = async req => {
    const collectionName = db.collections.DEFAULT
    const uid = req.uid
    if(!uid || uid < 1) throw new Error("Unathorised")
    const pid = req.body.pid
    const status = req.body.status
    const keys = {
        submission_pid: pid,
        type: "submission_history"
    }
    const submissionHistory = await db.findField(collectionName, keys)

    if(submissionHistory?.currentSubmission == null) throw new Error("No submission to review")
    await db.updateField(collectionName, keys, {
        $push: {
            history: {
                ...submissionHistory.currentSubmission,
                status: "reviewed"
            }
        },
        $set: {
            currentSubmission: null
        }
    })
    const updateResult = await db.updateField(collectionName, {
        pid,
        type: "submission"
    }, {$set: {status}})
    return {modified: updateResult.n > 0}

}
//create submission info object
// dtthon.submissionInfo = async function (req) {
//     const collectionName = db.collections.DEFAULT;
//     try {
//     const uid = parseInt(req.uid);
//     const tid = req.body.tid;
//     const timestamp = req.timestamp ?? Date.now();

//     if (!uid || uid < 1) {
//         throw new Error('Unauthorised');
//     }
    
//     let status = await db.findField(collectionName, { type: "project", tid });
//     console.log(status)
//     if (status['status'] != "published") {
//         throw new Error('no published project with given tid found ! : ' + tid);
//     }
//     // if (req.toPid && !utils.isNumber(req.toPid)) {
//     //     throw new Error('error:invalid-pid');
//     // }
//     let recruiter_uid = status.uid;
//     if(!recruiter_uid) throw new Error("Invalid project! attached recruiter not found !");
    
//     let userName = await db.getObjectField('user:' + uid, 'username');

//     const pid = await db.incrObjectField('global', 'nextPid');
//     let postData = {
//         pid,
//         uid,
//         tid,
//         cid: status.cid,
//         timestamp,
//         type: "submissionInfo",
//         attachment_type: "project",
//         attachment_id: tid,
//         recruiter_uid: recruiter_uid,
//         name: userName, // name of the user
//         selected_submit_time: req.body.submit_time,
//         latest_task_submit_time: req.body.latestSubmissionTime,
//         submission_history: []
//     };

//     // if (req.toPid) {
//     //     postData.toPid = req.toPid;
//     // }
//     // if (req.ip && meta.configs.trackIpPerPost) {
//     //     postData.ip = req.ip;
//     // }
//     // if (req.handle && !parseInt(uid, 10)) {
//     //     postData.handle = req.handle;
//     // }


//     await db.setObject('post:' + postData.pid, postData);

//     //,ysterious nodebb operations... ;)
//     await Promise.all([
//         db.incrObjectField('global', 'postCount'),
//         //User.onNewPostMade(postData),
//         //Posts.uploads.sync(postData.pid),
//     ]);

//     console.log(postData)
//     return { tid, pid };

// } catch (e) { console.error(e);throw new Error(e.message); }


// };

// dtthon.getSubmissions = async function (req) {
//     const collectionName = db.collections.DEFAULT;
//     try {
//     const page = parseInt(req.query.page) || 0;
//     const limit = parseInt(req.query.limitBy) || 5;
//     const uid = parseInt(req.uid)
//     const isRecruiter = req.query.isRecruiter && await userPrivileges.users.isRecruiter(uid);
    
//     if (!uid || uid < 1) throw new Error("Unauthorised");
//     let keys = {
//         type: "submissionInfo",
//         uid
//     }
//     if (isRecruiter){ 
//         const tid = req.query.tid;
//         if(tid) keys.tid = tid
//     };
//     let submissions = await db.findFieldsWithPagination(collectionName, keys, limit, page, {timestamp:-1});
//     const count = !submissions ? await db.countDocuments(collectionName, keys) : 0;

//     return utils.paginate(`/apps${req.url}`, submissions, count, limit, page);
// } catch (e) { console.error(e); throw new Error(e.message);}

// }

// dtthon.makeSubmission = async function (req) {
//     const collectionName = db.collections.DEFAULT;
// try{ 
//     //console.log(req.body)

//     const timestamp = req.timestamp || Date.now();
//     const uid = req.uid
//     if (!uid || uid<1) {
//         throw new Error('Unauthorised');
//     }

    
//     const submission_pid = req.body.submission_pid
    
//     const submissionInfo = await db.findField(collectionName, {pid: submission_pid, type: "submissionInfo"});
//     if(!submissionInfo) throw new Error("invalid submission-pid provided");

    
//     const tid = submissionInfo.tid;
//     const project = await db.findField(collectionName, {tid, type: "project"});
//     if(project.status!="published") throw new Error("currently this project is not accepting submissions!");


//     console.log(submissionInfo)
    
//     if(!req.body.task_submissions ) 
//     throw new Error("invalid task-submissions");

//     const asset_submissions = req.body.asset_submissions;
//     const asset_submissions_length = asset_submissions.length;

//     if(asset_submissions_length > 1) 
//     throw new Error("currently only one task submission is allowed at a time ");
//     if(asset_submissions_length < 1)
//     throw new Error("no task submission found");
//     const processed_asset_submissions = await Promise.all([asset_submissions.map(async raw_asset_submission => {
//         const asset_id = raw_asset_submission.asset_id
//         const asset = project.tasks.reduce((asset, task) => task.assets.find(asset => asset.asset_id === asset_id) ?? asset, null)
//         if(asset == null) throw new Error("invalid task-id provided :"+task_id);
//         if(asset.asset_type === "display_asset") throw new Error("Can only submit to input asset")

//         /* const asset_submission = {
//             submission_type: asset.asset_content
//          }*/
//         const asset_submission = {
//             asset_id,
//             submission_type: asset.asset_content, // tb, eb, article, reflection, quiz, other
//             submission_url: raw_asset_submission.asset_url ?? "",
//             submission_image: raw_asset_submission.asset_image ?? "",
//             submission_video: raw_asset_submission.asset_video ?? "",
//             submission_docs: raw_asset_submission.asset_docs ?? "",
//             tb_tid: raw_asset_submission.asset_content === "tb" ? raw_asset_submission.tb_tid ?? 0 : null,
//             tb_pid: raw_asset_submission.asset_content === "tb" ? raw_asset_submission.tb_pid ?? 0 : null,
//             eb_tid: raw_asset_submission.asset_content === "eb" ? raw_asset_submission.eb_tid ?? 0 : null,
//             eb_pid: raw_asset_submission.asset_content === "eb" ? raw_asset_submission.eb_pid ?? 0 : null,
//             submission_reflection: raw_asset_submission.asset_content === "reflection" ? raw_asset_submission.asset_reflection ?? "" : null,
//         }
//         if(asset_submission.submission_url.length < 1) throw new Error("Submission url must be provided")
        
//         await db.update(collectionName, {
//             tid: asset_submission.tb_tid < 1 ? asset_submission.tb_tid : asset_submission.eb_tid,
//             pid: asset_submission.tb_pid < 1 ? asset_submission.tb_pid : asset_submission.eb_pid,
//             type: {$in: ["eagleBuilder", "threadBuilder"]}
//         }, {$set: {frozen: true}})
//         if(
//             submissionInfo.submission_history.some(
//                 submission => submission.asset_submissions[asset_id] && submission.eval_status != "re-asigned"
//             )
//         ) throw new Error("The a submission has been submitted and not yet re assigned, please try again later!")
//         return asset_submission
//     })])
    

//     const submission_id = await db.incrObjectField('global', 'nextPid');
//     const submission = {
//         timestamp: timestamp,
//         submission_id: submission_id,
//         eval_status: req.body.eval_status?req.body.eval_status:"pending",
//         //response_url: req.body.response_url,
//         submit_time: Date.now(),
//         asset_submissions: processed_asset_submissions
//     };
    
//     const key = { type: "submissionInfo", pid: submission_pid, uid }
//     console.log(key, submission)
//     const status = await db.update(collectionName, key, { $push: {submission_history : submission}, $set: { latest_task_submit_time: submission.submit_time } });

//     return {status, submission_id};

// }catch(e){
//     console.log(e)
//     throw new Error(e.message);
// }
// }

// dtthon.reviewSubmission = async function (req) {
//     const collectionName = db.collections.DEFAULT;
//     try{ 
//     const uid = parseInt(req.uid);
//     const submission_pid = parseInt(req.body.pid);
//     const submission_id = parseInt(req.body.submission_id);
//     const review_status = req.body.review_status;
//     console.log(req.body, submission_pid, submission_id, review_status)
//     if(!uid || uid<1){
//         throw new Error('Unauthorised');
//     }

//     let key = { type: "submissionInfo", pid: submission_pid,recruiter_uid: uid, "submission_history.submission_id": submission_id }  


//     let status = await db.update(collectionName, key, { $set: { "submission_history.$.eval_status": review_status } });

//     console.log(status, key)
    
//     if(status)
//     return {status:"success"};
//     else return {status:"failure"};

// }catch(e){
//     console.log(e)
//     throw new Error(e.message);
// }
// }

function formatTasksForUpdate(tasks, submission) {
    if(tasks == null) return {}
    return tasks.reduce((updates, task) => {
        const taskIndex = submission.tasks.findIndex(Task => Task.task_id === task.task_id)
        if(taskIndex < 0) return updates
        return {
            ...updates,
            ...task.assets.reduce((updates, asset) => {
                const assetIndex = submission.tasks[taskIndex].assets.findIndex(
                    Asset => Asset.asset_id === asset.asset_id
                )
                if(assetIndex < 0) return updates
                return {
                    ...updates,
                    [`tasks.${taskIndex}.assets.${assetIndex}.content`]: asset.content
                }
            })
        }
    })
}
    /**
         * //! under construction !!
         * @author Shubham Bawner
         * @desc creates dtThon project as a topic, that is associated with multiple cids 
         */
    const createDtThonTopic = async function (data, tid) {
        try{ 
        // This is an internal method, consider using Topics.post instead
        const timestamp = data.timestamp || Date.now();

        tid = tid ?? await db.incrObjectField('global', 'nextTid');

        let topicData = {
            tid: tid,
            ...data,
            slug: tid + '/' + (slugify(data.title) || 'topic'),
            timestamp: timestamp,

            //! note that data has to have:
            // uid: data.uid,
            // cid: data.cid,//! needs to be an array of cids
            // mainPid: 0,
            // title: data.title,
            // slug: tid + '/' + (slugify(data.title) || 'topic'),
            // lastposttime: 0,
            // postcount: 0,
            // viewcount: 0,
        };

        if (data.picture) {
            topicData.picture = data.picture;
        }
        if (data.type) {
            topicData.type = data.type;
        }

        const result = await plugins.hooks.fire('filter:topic.create', { topic: topicData, data: data });
        topicData = result.topic;
        await db.setObject('topic:' + topicData.tid, topicData);

        for (let i = 0; i < topicData.cid.length; i++) {
            let cid = topicData.cid[i];
            await Promise.all([
                db.sortedSetsAdd([
                    'topics:tid',
                    'cid:' + cid + ':tids',
                    'cid:' + cid + ':uid:' + topicData.uid + ':tids',
                ], timestamp, topicData.tid),
                db.sortedSetsAdd([
                    'topics:views', 'topics:posts', 'topics:votes',
                    'cid:' + cid + ':tids:votes',
                    'cid:' + cid + ':tids:posts',
                ], 0, topicData.tid),
                categories.updateRecentTid(cid, topicData.tid),
                user.addTopicIdToUser(topicData.uid, topicData.tid, timestamp),
                db.incrObjectField('category:' + cid, 'topic_count'),
                db.incrObjectField('global', 'topicCount'),
                Topics.createTags(data.tags, topicData.tid, timestamp),
            ]);
        }
        console.log('----topicData----', topicData);

        plugins.hooks.fire('action:topic.save', { topic: _.clone(topicData), data: data });
        return topicData.tid;
    }catch(e){
        console.log(e)
        throw new Error(e.message);
    }
    };

//--- helper function

let getKeysByTime = (req, parameter) => {
    try{ 

    let from = (!isNaN(parseInt(req.query.from)) && JSON.stringify(req.query.from).length >= 12)
        ? parseInt(req.query.from) : Date.now() - (3600000 * 24 * 7) //default period 1 week, 3600000 is no. of milliseconds in 1 hour
    let to = (!isNaN(parseInt(req.query.to)) && JSON.stringify(req.query.to).length >= 12)
        ? parseInt(req.query.to) : Date.now()  //default period 1 week, 3600000 is no. of milliseconds in 1 hour

    let customFromDate = undefined, customToDate = undefined;

    if (req.query.fromDate) {
        customFromDate = req.query.fromDate.split('/') // pass as "yyyy/mm/dd"
        customFromDate[1]--;//month is by default taken from 0(0 is Jan), but query is to be passed as general date(Jan is 1) 
        from = !isNaN(new Date(...customFromDate).getTime()) ? new Date(...customFromDate).getTime() : from;
    } if (req.query.toDate) {
        customToDate = req.query.toDate.split('/')  // pass as "yyyy/mm/dd"
        customToDate[1]--;//month is by default taken from 0(0 is Jan), but query is to be passed as general date(Jan is 1) 
        to = !isNaN(new Date(...customToDate).getTime()) ? new Date(...customToDate).getTime() : to;
    }
    const keys = {
        $and: [
            { [parameter]: { $gte: from } },
            { [parameter]: { $lte: to } },
        ]
    };
    return keys;
}catch(e){
    console.log(e)
    throw new Error(e.message);
}
}

/* //TODO LIST  dtthons.api.js
3. //TODO add field validation for tasks, assets ...
3. //TODO remove unwanted console logs
3. //TODO lock tb after submission
3. //TODO submission to asset
*/

/* //TODO LIST  sdl.api.js
 * TODO delete Comment api is not working
 * TODO testing left for creating with toPid
 */

/* //TODO LIST payments...
1. need different collection for payments
2. need razorpay transaction (make payment)
3. need transaction history, track of all the transactions(buy, sell, etc)(maybe refunds, bonuses ...)
3.1 need each transaction details to be stored, id of payment from razorpay, purchase id from our side, etc properly
4. need catalogue of all products currently purchased by the user
5. need CRUD for products
6. need locking mechanism for transactions, when a payment/purchase is hapening we need to lock the same user from making any other payment/purchase
*/
