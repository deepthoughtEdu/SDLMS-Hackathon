"use strict";

const winston = require("winston");
const db = require("../../../database");
const user = require("../../../user");
const helpers = require('../../helpers');
const groups = require('../../../groups');
const privileges = require('../../../privileges');

const profile = module.exports;

profile.get = async function (req, res, next) {
    var profile = {};

    profile.title = 'Applicant Profile';
    profile.project = await db.findField(db.collections.DEFAULT, {tid: parseInt(req.params.tid)});
    res.render('sdlms/dtthon/applicant/profile', profile);
};