"use strict";

const winston = require("winston");
const db = require("../../../database");
const user = require("../../../user");
const helpers = require('../../helpers');
const groups = require('../../../groups');
const privileges = require('../../../privileges');

const explorePage = module.exports;

explorePage.get = async function (req, res, next) {
    var explorePage = {};

    explorePage.title = 'Explore Page';
    res.render('sdlms/dtthon/applicant/explorePage', explorePage);
};