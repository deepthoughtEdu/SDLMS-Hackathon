"use strict";

const winston = require("winston");
const db = require("../../../database");
const user = require("../../../user");
const helpers = require('../../helpers');
const groups = require('../../../groups');
const privileges = require('../../../privileges');

const dashboard = module.exports;

dashboard.get = async function (req, res, next) {
    var dashboard = {};

    dashboard.title = 'Creator Dashboard';
    res.render('sdlms/dtthon/creator/dashboard', dashboard);
};