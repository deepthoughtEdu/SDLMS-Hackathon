"use strict";

const router = require("express").Router();
const middleware = require("../../middleware");
const controllers = require("../../controllers");
const routeHelpers = require("../helpers");
const razorpayWraper = require('../../razorpay');

const setupApiRoute = routeHelpers.setupApiRoute;

/**
 * @author Shubham Bawner
 * @description This file handles all the custom routes that are required for the razorpay payments to function. 
 */

module.exports = function () {

    let userAuth = [middleware.authenticate, middleware.authenticateOrGuest]

    razorpayWraper.connect()

    setupApiRoute(router, 'post', '/razorpay/success', [middleware.razorVerify],  
    controllers.write.payments.onPaymentCapturedWebhook);
    
    setupApiRoute(router, 'post', '/razorpay/failure', [middleware.razorVerify], 
    controllers.write.payments.onPaymentFailureWebhook);
    
    setupApiRoute(router, 'post', '/order', [...userAuth], 
    controllers.write.payments.generateOrder);
    
    setupApiRoute(router, 'post', '/purchase', [...userAuth], 
    controllers.write.payments.purchaseModule);
    
    return router;
}