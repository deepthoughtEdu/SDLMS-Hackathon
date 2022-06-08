const {Fields, DTID} = require("../../middleware").typedValidation

const $project = new Fields()
    .id("cid")
    .string("title")
    .string("status", {enum: ["published", "draft", "closed", "visible"]})
    .string("description")
    .string("short_description")
    .array("tags", {type: "string"})
    .array("tools", {type: "string"})
    .array("pre_requisites", {type: "string"})
    .string("project_image")
    .array("learning_outcomes", {type: "string"})
const $createProject = Fields.copy($project)
    .addOptions("title", {required: true})
const $editProject = Fields.copy($project)
    .id("tid", {required: true})
const $getProjects = new Fields()
    .id("tid")
    .string("isRecruiter")
    .time("fromDate")
    .time("from")
    .time("toDate")
    .time("to")
    .array("tags", {type: "string"})
    .id("cid")
    .add("page")
    .add("limitBy", {type: ["string", "number"]})

const $deleteProject = new Fields()
    .id("tid", {required: true})

const $task = new Fields()
    .string("task_title")
    .string("task_description")
    .array("tools", {type: "string"})
const $addTask = new Fields()
    .id("tid", {required: true})
    .object("task", Fields.copy($task).required().addOptions("task_title", {required: true}))
const $editTask = new Fields()
    .id("tid", {required: true})
    .id("task_id", {required: true})
    .object("task", Fields.copy($task).required())
const $deleteTask = new Fields()
    .id("tid", {required: true})
    .id("task_id", {required: true})

const $asset = new Fields()
    .string("asset_title")
    .string("asset_description")
    .string("asset_type", {enum: ["input_asset", "display_asset"]})
    .string("asset_content", {enum: ["tb", "eb", "article", "reflection", "quiz", "other"]})
    .string("asset_url") //!place holder
    .string("asset_image")
    .string("asset_video")
    .string("asset_docs")
    .id("tb_tid")
    .id("tb_pid")
    .id("eb_tid")
    .id("eb_pid")
    .string("asset_reflection")

const $addAsset = new Fields()
    .id("tid")
    .id("task_id")
    .object("asset", Fields.copy($asset).required()
        .addOptions("asset_url", {requiresFieldsToBeEqual: {
            asset_type: "display_asset"
        }})
        .addOptions("asset_image", {requiresFieldsToBeEqual: {
            asset_type: "display_asset"
        }})
        .addOptions("asset_video", {requiresFieldsToBeEqual: {
            asset_type: "display_asset"
        }})
        .addOptions("asset_docs", {requiresFieldsToBeEqual: {
            asset_type: "display_asset"
        }})
        .addOptions("tb_tid", {requiresFieldsToBeEqual: {
            asset_type: "display_asset",
            asset_content: "tb"

        }})
        .addOptions("tb_pid", {
            asset_type: "display_asset",
            asset_content: "tb"

        })
        .addOptions("eb_tid", {
            asset_type: "display_asset",
            asset_content: "eb"

        })
        .addOptions("eb_pid", {
            asset_type: "display_asset",
            asset_content: "eb"

        })
        .addOptions("asset_reflection", {
            asset_type: "display_asset",
            asset_content: "reflection"

        })
    )
const $editAsset = new Fields()
    .id("tid")
    .id("task_id")
    .id("asset_id")
    .object("asset", Fields.copy($asset).required())
const $deleteAsset = new Fields()
    .id("tid")
    .id("task_id")
    .id("asset_id")

const $submissionTasks = new Fields()
    .id("task_id", {required: true})
    .array("assets", new Fields()
        .required()
        .id("asset_id", {required: true})
        .add("content", {type: ["string", "number", DTID]})
    )

const $getSubmissions = new Fields()
    .id("pid")
    .id("tid")
    .string("isRecruiter")
const $createSubmission = new Fields()
    .id("tid", {required: true})
    .time("timestamp")
    .array("tasks", Fields.copy($submissionTasks))
const $updateSubmission = new Fields()
    .id("pid", {required: true})
    .array("tasks", Fields.copy($submissionTasks).required())
const $submitSubmission = new Fields()
    .id("pid", {required: true})
    .array("tasks", Fields.copy($submissionTasks))
const $reviewSubmission = new Fields()
    .id("pid", {required: true})
    .string("status", {enum: ["re_asigned", "rejeted", "accepted"]})
module.exports = {
    $project,
    $createProject,
    $editProject,
    $getProjects,
    $deleteProject,
    $task,
    $addTask,
    $editTask,
    $deleteTask,
    $asset,
    $addAsset,
    $editAsset,
    $deleteAsset,
    $getSubmissions,
    $createSubmission,
    $updateSubmission,
    $submitSubmission,
    $reviewSubmission
}