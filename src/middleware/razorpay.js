'use strict';


const helpers = require('./helpers');
const razorVerifyRequest = require('../razorpay').razorVerifyRequest;

module.exports = function (middleware) {
    middleware.razorVerify = helpers.try(async function middlewareRazorpayVerify(req, res, next) {
        if (!await razorVerifyRequest(req, res))
            console.log(`razorpay webhook request not verified`);
        else
            req.webhookVerified = true;
        next();
    });
}