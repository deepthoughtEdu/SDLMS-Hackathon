'use strict';

const API = module.exports;

API.users = require('./users');
API.groups = require('./groups');
API.topics = require('./topics');
API.posts = require('./posts');
API.categories = require('./categories');
API.sdlms = require('./sdlms.api');
API.appApi = require('./app.api');
API.otpApi = require('./otp.api');
API.dtthon = require('./dtthon.api');
API.payments = require('./payments.api');
API.profilePage = require("./profilePage.api")


