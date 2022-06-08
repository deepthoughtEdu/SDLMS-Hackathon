"use strict";

const winston = require("winston");
const db = require("../../../database");
const user = require("../../../user");
const helpers = require('../../helpers');
const groups = require('../../../groups');
const privileges = require('../../../privileges');

const storyboard = module.exports;

storyboard.get = async function (req, res, next) {
    var storyboard = {};

    storyboard.title = 'Creator Storyboard';
    storyboard.project = await db.findField(db.collections.DEFAULT,{tid: parseInt(req.params.tid)});
    res.render('sdlms/dtthon/creator/storyboard', storyboard);
};