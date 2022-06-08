/**
 * @author: Shubham Bawner
 * @description: all the razorpay operations are handled here.
 * ## this is where we will be using the razorpay api via importing the razorpay library/SDK.
 * *currently provided functions:
 * 0. connect
 * 1. createPayment
 * 2. createOrder
 */
const axios = require('axios');
const Razorpay = require('razorpay');
const nconf = require('nconf');
const { number } = require('yargs');
let r = nconf.get('razorpay');
var RazorpayInstance = null;

const razorpayWraper = module.exports;

// we dont want to expose actual razorpay function, but only the wraper functions.
razorpayWraper.connect = function () {
    if (RazorpayInstance === null)
        try {
            RazorpayInstance = new Razorpay({
                key_id: r.key_id,
                key_secret: r.key_secret,
            });
        } catch (e) {
            console.log(e);
        }
    else throw new Error('razorpay instance already exists');
}

// middleware utility to verify and validate the webhook request.
razorpayWraper.razorVerifyRequest = async function (req, res) {
    let body = req.body;
    let receivedSignature = req.get("x-razorpay-signature");
    let secret = r.webhook_secret;

    // code copied from razorpay site! for validating the secret request
    const response = await Razorpay.validateWebhookSignature(
        JSON.stringify(body),
        receivedSignature,
        new Buffer.from(secret, 'base64').toString('ascii')
    );

    return response;
}

razorpayWraper.generateOrder = async function (amount, receipt, notes, currency = 'INR') {
    try {
        if (RazorpayInstance === null) throw new Error('razorpay instance not connected');

        if(!amount || typeof amount!= 'number' || amount<1) throw new Error('appropriate amount grater than 1 rupee not provided, given: ' + amount + ' ' + typeof amount);
        amount*=100;
        
        var data = JSON.stringify({
            amount: amount,
            currency: currency,
            receipt: receipt,
            notes: notes
        });

        let authKey = `${r.key_id}:${r.key_secret}`;
        var config = {
            method: 'post',
            url: 'https://api.razorpay.com/v1/orders',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+Buffer.from(authKey).toString('base64')
            },
            data: data
        };
        
        let order = await axios(config)
            .then(function (response) {
                return response.data;
            }).catch(function (error) {
                console.log((error.response)?(error.response.data?error.response.data.error:error.response.data):error);
                throw new Error(error.response.data.error.description);
            });

        if (!order) throw new Error("payment initiation i.e.  orderID generation failed: ( razorpay side error: )");

        return order;

    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
}