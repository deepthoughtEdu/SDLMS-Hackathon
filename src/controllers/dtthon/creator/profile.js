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

    profile.title = 'Creator Profile';
    res.render('sdlms/dtthon/creator/profile', profile);
};