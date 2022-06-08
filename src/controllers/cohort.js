const groups = require('../groups');
const db = require('../database');
const helpers = require('../controllers/helpers');
const utils = require('./utils');
const user = require('../user');
const winston = require('winston');
const uploader = require('../controllers/FIleUpload');
const fs = require('fs');

const cohortController = module.exports;

cohortController.get = async function (req, res) {
    if (!req.uid) {
        return res.redirect('/login?share_redirect=true&url=/cohorts');
    }
    const collectionName = db.collections.DEFAULT;
    const isAdministrator = await user.isAdministrator(req.uid);
    if (!isAdministrator) throw new Error('Unauthorized! Only administrators can access this page');

    const cohort = {};
    cohort.title = "Manage Cohorts";
    cohort.cohorts = await db.findFields(collectionName, { type: 'cohort'}, ['name', 'memberCount', 'slug']);

    res.render("sdlms/cohorts", cohort);
};

cohortController.getCohortByName = async function (req, res) { 
    if (!req.uid || parseInt(req.uid) < 1) throw new Error ("Invalid user, please login");
    if (!req.params.name) throw new Error("Invalid API call");

    const collectionName = db.collections.DEFAULT;
    const isAdministrator = await user.isAdministrator(req.uid);
    if (!isAdministrator) throw new Error('Unauthorized! Only administrators can access this feature');

    const userFields =  [
		"username",
		"fullname",
		"picture",
	];

    const cohortData = {}
    cohortData.title = "Cohort";

    const [cohort, members] = await Promise.all([
        groups.getGroupData(req.params.name),
        db.findFields(collectionName, { _key: `group:${req.params.name}:members`})
    ])

    cohortData.title = cohort.name;
    cohortData.cohort = cohort;

    if (members) {
        let m = members.map(member => parseInt(member.value));
        cohortData.members = await Promise.all(m.map(async (member) => {
            let userData = await user.getUsersFields([member], userFields);
            return userData[0];
        }));
    } else {
        cohortData.members = [];
    }

    res.render("sdlms/cohort", cohortData);
}

cohortController.createCohort = async function (req, res) { 
    if (!req.uid || parseInt(req.uid) < 1) throw new Error ("Invalid user, please login");

    const isAdministrator = await user.isAdministrator(req.uid);
    if (!isAdministrator) throw new Error('Unauthorized! Only administrators can access this feature');

    if (!req.body.name) throw new Error("Cohort name is required");
    const cohortData = {};
    cohortData.name = req.body.name;
    cohortData.groupType = 'cohort';
    cohortData.description = req.body.description;

    const cohort = await groups.create(cohortData);
    helpers.formatApiResponse(200, res, cohort);
}

cohortController.updateCohort = async function (req, res) { 
    if (!req.uid || parseInt(req.uid) < 1) throw new Error ("Invalid user, please login");
    
    const isAdministrator = await user.isAdministrator(req.uid);
    if (!isAdministrator) throw new Error('Unauthorized! Only administrators can access this feature');
    
    const csvFileFields = ['email','username','uid']; // Must match the CSV file (Checking the fields are in order)
    let parsedData = {};
    let cohortName = "";
    if (req.body.name) {
        parsedData.name = req.body.name;
        cohortName = req.body.name;
    } else { 
        throw new Error("Cohort name is required"); 
    }
    if (!req.body.prev_name) throw new Error("Cohort previous name (old) is required to make modifications");

    if (req.body.description) parsedData.description = req.body.description;

    if (req.files && req.files.files) {
        let csvFile = await uploader.uploadContent(req);
        //let userList = await user.getUsersCSV();

        if (csvFile && csvFile.length !== 0) {
            let uids = [];
            let filepath = csvFile[0].url;
            let data = fs.readFileSync(filepath.replace('/assets', 'public'), { encoding:'utf8', flag:'r' });
            data = data.split('\n');
            let header = data.splice(0, 1)[0].split(',');
            csvFileFields.forEach((field, index) => {
                try {
                    // Check for the correct order of the fields in the CSV file
                    if (header[index].trim().toLowerCase() !== field) {
                        throw new Error(`Invalid CSV file structure`);
                    }
                } catch {
                    // Catch the error incase of missing fields
                    throw new Error(`Invalid CSV file.`);
                }
            });

            data = data.splice(1); // remove header
            data.forEach(function(line) {
                let uid = line.split(',')[2];
                if (uid && isNaN(uid)) throw new Error("Invalid CSV file/format");
                else if (uid && uid != 0) uids.push(Number(uid));
            })

            if (uids.length) {
                await addUsersToCohort(uids, cohortName);
            }
        }
    }

    if (req.body.members && utils.isJSON(req.body.members)) {
        await addUsersToCohort(req.body.members, cohortName);
    }

    let groupData = await groups.update(req.body.prev_name, parsedData);
    helpers.formatApiResponse(200, res, groupData);
}

cohortController.removeMembers = async function (req, res) {
    if (!req.uid || parseInt(req.uid) < 1) throw new Error ("Invalid user, please login");

    const isAdministrator = await user.isAdministrator(req.uid);
    if (!isAdministrator) throw new Error('Unauthorized! Only administrators can access this feature');

    if (!req.params.name) throw new Error("Cohort name is required");
    const cohortName = req.params.name;

    if (req.body.remove_uids && utils.isJSON(req.body.remove_uids)) {
        let uids = req.body.remove_uids;
        await Promise.all(uids.map( async (element) => {
            return await groups.leave(cohortName, element);
        }))
    }
    helpers.formatApiResponse(200, res, { removed: req.body.remove_uids});
}

cohortController.deleteCohort = async function (req, res) {
    if (!req.uid || parseInt(req.uid) < 1) throw new Error ("Invalid user, please login");

    const isAdministrator = await user.isAdministrator(req.uid);
    if (!isAdministrator) throw new Error('Unauthorized! Only administrators can access this feature');

    if (!req.params.name) throw new Error("Cohort name is required");
    helpers.formatApiResponse(200, res, await groups.destroy(req.params.name));
}

/**
 * @author imshawan
 * @date 28-04-2022
 * @function addUsersToCohort
 * @description Adds users to a particular cohort based on their uid
 * @param {Array} memberUids Array of UIDs
 * @param {String} cohortName Name of the cohort
 * @returns 
 */
async function addUsersToCohort (memberUids, cohortName) {
    return await Promise.all(memberUids.map( async (element) => {
        return await groups.join(cohortName, element);
    }))
}