"use strict";
var meta = require('../meta');

const groups = require('../groups');
const _ = require('lodash');
const categories = require('../categories');
const db = require('../database');
const user = require('../user');
const topics = require('../topics');
const plugins = require('../plugins');
const slugify = require('../slugify');
const winston = require('winston');
const Uploader = require('../controllers/FIleUpload');
const ObjectId = require('mongodb').ObjectId;
const nconf = require('nconf');
const axios = require('axios');
const { privileges } = require('../controllers/admin');
const userPrivileges = require('../privileges');
const utils = require('../controllers/utils');

const razorpayWraper = require(`../razorpay`);
const { handleErrors } = require('../controllers/errors');

const payments = module.exports;

let w = console.log

payments.onPaymentCapturedWebhook = async function (req, res) {
    try {
        let errorMsg = `razorpay webhook request not verified +\n ${req.url} +\n ${JSON.stringify(req.body)} \n+ ${JSON.stringify(req.rawHeaders)}`
        if (!req.webhookVerified) throw new Error(errorMsg);
        w(req.body, req.body.payload.payment.entity, "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        let orderID = req.body.payload.payment.entity.order_id
        let cocred_order = req.body.payload.payment.entity.notes
        const uid = cocred_order.uid
        req.uid = uid
        console.log(req.uid, req.webhookVerified, cocred_order.cocredOrderID)
        if (!(cocred_order && cocred_order.quantity && cocred_order.cocreds)) {
            console.log('cocredOrder object not found', req.body.payment.entity)
            throw new Error('cocredOrder object not found' + JSON.stringify(req.body.payment.entity))
        }
        let cocreds = cocred_order.quantity * cocred_order.cocreds
        transaction.cocredsTransaction("credit", cocreds, req, cocred_order.cocredOrderID)

        const data = { status: "success", paymentID: req.body.payload.payment.entity.id }
        cocredOrder.updateRazorpayDetails(data, req, { orderID: orderID })

        console.log(`payment captured for orderID : ${orderID}`)
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

payments.onPaymentFailureWebhook = async function (req, res) {
    try {
        let errorMsg = `razorpay webhook request not verified +\n ${req.url} +\n ${JSON.stringify(req.body)} \n+ ${JSON.stringify(req.rawHeaders)}`
        if (!req.webhookVerified) throw new Error(errorMsg);

        const orderID = req.body.payload.payment.entity.order_id
        const data = { status: "failure", paymentID: req.body.payload.payment.entity.id, error: req.body.payload.payment.entity.error_description }
        const resp = await cocredOrder.updateRazorpayDetails(data, req, { orderID: orderID })
        w(resp);
        w(req.query)
        console.log(`payment failed for orderID : ${orderID}`)
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

payments.generateOrder = async function (req, res) {
    try {
        if (!req.uid) throw new Error('user not logged in');
        let productID = req.body.productID;
        let quantity = req.body.quantity;
        w(productID, quantity, typeof quantity, req.body)
        if (typeof quantity != 'number' || quantity <= 0 || quantity % 1 > 0) throw new Error(`quantity must be a positive integer, given: ${typeof quantity} : ${quantity} `)

        if (!(productID && quantity)) throw new Error('productID/non-zero quantity required, given : ' + JSON.stringify(req.body));
        const product = await cocredProduct.getCocredProduct(productID)
        if (!product) throw new Error('cocredProduct not found or productID not valid');
        if (product.status !== 'active') throw new Error(`cocredProduct : ${productID} is expired or not active`);

        const amount = product.amount * quantity;
        const cocredOrderID = `cocredOrder:${Date.now()}${Math.random().toString(36)}${Math.random().toString(36)}`
        const notes = { cocreds: product.cocredsOffered, quantity: quantity, cocredOrderID: cocredOrderID, uid: req.uid }
        const order = await razorpayWraper.generateOrder(amount, productID, notes, 'INR');

        const data = { amount: amount, quantity: quantity, orderID: order.id, status: "pending", productID: productID }
        return {
            cocredOrder: await cocredOrder.initiateCocredOrder(data, req, cocredOrderID)
            , order: order
        }
    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
};

payments.purchaseModule = async function (req, res) {
    try {
        if (!req.uid) throw new Error("unauthorised user!!!")

        let listedItem = await priceList.getPriceList(req.body.priceListID);
        w(listedItem, req.body)

        if (!listedItem) throw new Error("valid priceList not found or priceListID not valid", { code: `INVALID_PRICELIST` })
        if (listedItem.end_date < Date.now()) throw new Error(`priceList expired already b4 ${listedItem.end_date + new Date.getTime()}`)
        if (listedItem.moduleID != req.body.moduleID) throw Error(`moduleID mismatch, invalid request ${JSON.stringify(listedItem)}`)

        // const module = isCurrentlyEnrolled(req.uid, moduleID) //returns module if enrolled, else returns null
        // if( !listedItem.multple_enrollment==true && module) 
        //     throw Error(`already enrolled in the module! ${JSON.stringify(module)}`)
        const purchaseOrderID = `purchaseOrder:${Date.now()}${Math.random().toString(36)}${Math.random().toString(36)}`
        const invoiceID = `invoice:${Date.now()}${Math.random().toString(36)}${Math.random().toString(36)}`

        const cocreds = listedItem.cocreds
        const subscriptionCocreds = listedItem.subscriptionCocreds


        let balance = 0;
        let order = {}
        if (cocreds) {
            balance = await transaction.cocredsTransaction("debit", listedItem.cocreds, req, purchaseOrderID)
            order = await modulePurchaseOrders.createModulePurchase(req, listedItem, purchaseOrderID)
        } else if (subscriptionCocreds){
            balance = await transaction.cocredsTransaction("debit", subscriptionCocreds, req, invoiceID)
            order = await modulePurchaseOrders.createModulePurchase(req, listedItem, invoiceID)
        }


        return { order: order, listedItem: listedItem, balance: balance - listedItem.cocreds }
    } catch (e) {
        console.log(e)
        // helper.handleErrors(e)
        throw new Error(e)
    }
}

let getUserInfo = {}
// const cocredOrderID = generateUniqueID(`cocredOrder:${Date.now()}`);
getUserInfo.cocredOrders = async function (req, res) {
    if (!req.uid) throw new Error('user not logged in');
    return await cocredOrder.getOrders(req);
}
getUserInfo.modulePurchases = async function (req, res) { // get all module_purchase_orders
    if (!req.uid) throw new Error('user not logged in');
    return await modulePurchaseOrders.getAllPurchases(req)
}
getUserInfo.cocredDetails = async function (req, res) {
    if (!req.uid) throw new Error('user not logged in');
    return await transaction.getCocredTransactions(req)
}
payments.getUserInfo = getUserInfo;

/*////////////////////////////////////////////////////////////////*/

// just like shop, so all functionalty like presenting available products, filtering them, LISTING a priduct, etc. 
// but not purchasing product! as it is part of payment module, here explicitly we have tools for managing the our shop.
let marketPlace = {}

marketPlace.getAllPriceLists = async function (req, res) {
    return await priceList.getAllPriceLists(req)
}

marketPlace.getAllCocredProducts = async function (req, res) {
    return await cocredProduct.getAllActiveCocredProducts(req)
}

payments.marketPlace = marketPlace;


/*//////////////////////////////////////////////////////////////*/
const collections = {
    MODULEPURCHASEORDERS: 'module_purchase_orders', //only get
    MODULES: 'modules', /*restricted crud*/
    COCREDORDERS: 'cocred_orders', //only get
    PRICELIST: 'price_list',/*restricted crud*/
    COCREDDETAILS: 'cocred_details', // only get
    COCREDPRODUCTS: 'cocred_products' /*restricted crud*/
}

/*//////////////////////////////////////////////////////////////*/
const cocredOrder = {}
cocredOrder.initiateCocredOrder = async function (order, req, cocredOrderID) {
    try {
        if (!req.uid) throw new Error('user not logged in');
        if (!(order.amount && order.quantity && order.orderID && order.productID))
            throw new Error(`amount/quantity/productID/orderID required, given : ${JSON.stringify(order)}`);

        const cocred_order = {
            uid: req.uid,
            status: "pending",
            error: null,
            amount: order.amount,
            quantity: order.quantity,
            productID: order.productID,
            paymentID: null,
            orderID: order.orderID,
            updatedUID: null, lastUpdated: null,
            created: Date.now(),
            cocredOrderID: cocredOrderID ? cocredOrderID : `cocredOrder:${Date.now()}` + Math.random().toString(36) + Math.random().toString(36)
        }
        console.log(cocred_order, 'cocred_order')
        return await db.setField(collections.COCREDORDERS, cocred_order);
    } catch (e) { console.log(e); throw new Error(e) }
}

//query = {cocredOrderID:cocredOrderID, orderID:orderID}
cocredOrder.getCocredOrder = async function (query) {
    return await db.findField(collections.COCREDORDERS, { or: [{ cocredOrderID: query.cocredOrderID }, { orderID: query.orderID }] });
}

cocredOrder.updateRazorpayDetails = async function (data, req, identifier) {
    console.log(req.uid, req.webhookVerified, identifier)
    if (!identifier.cocredOrderID && !identifier.orderID) throw new Error('cocredOrderID or orderID required');
    let query = null;
    if (identifier.cocredOrderID) {
        query = { cocredOrderID: identifier.cocredOrderID }
    } else {
        query = { orderID: identifier.orderID }
    }

    let update = {}
    if (data.paymentID) update.paymentID = data.paymentID
    if (data.orderID) update.orderID = data.orderID
    if (data.status) update.status = data.status
    if (data.error) update.error = data.error
    if (data.updatedUID) update.updatedUID = req.uid
    if (data.lastUpdated) update.lastUpdated = Date.now()

    console.log(query, update)
    return await db.updateField(collections.COCREDORDERS, query, { $set: update });
}

//pagination needed
cocredOrder.getOrders = async function (req) {
    if (!req.uid > 0) throw new Error("unauthorised access")
    return await db.findFields(collections.COCREDORDERS, { uid: req.uid });
}

/*//////////////////////////////////////////////////////////////*/
const cocredProduct = {}
cocredProduct.getCocredProduct = async function (productID) {
    if (!productID) throw new Error('productID required');
    return await db.findField(collections.COCREDPRODUCTS, { productID: productID });
}
cocredProduct.getFilteredCocredProducts = async function (productID) { }

cocredProduct.getAllActiveCocredProducts = async function (req) {
    return await db.findFields(collections.COCREDPRODUCTS, { "status": "active" });
}

/*//////////////////////////////////////////////////////////////*/
const transaction = {}

const types = {
    CREDIT: 'credit',
    DEBIT: 'debit'
}
transaction.cocredsTransaction = async function (type, cocreds, req, referanceID) {
    // if ((!req.uid > 0 && !req.webhookVerified)) throw new Error("unauthorised access")
    if (!(type && cocreds && referanceID)) throw new Error("type/cocreds/referance_object all required" + `given: ${type} ${cocreds} ${referenceID}`)
    console.log(req.uid, req.webhookVerified, referanceID)
    let transactionResult = null;
    if (type == types.CREDIT)
        transactionResult = cocredsCreditTransaction(cocreds, req.uid, referanceID)
    else if (type == types.DEBIT)
        transactionResult = cocredsDebitTransaction(cocreds, req.uid, referanceID)
    else throw new Error("invalid transaction type")
    return transactionResult;
}
const cocredsDebitTransaction = async function (cocreds, uid, referanceID) {
    const compareOperation = {
        cocredBalance: {
            $cond: [
                { $gte: ["$cocredBalance", cocreds] },
                { $add: ["$cocredBalance", -1 * cocreds] },
                "$cocredBalance"]
        }
    }

    console.log(JSON.stringify({
        query: { "uid": uid },
        update: [{ $set: compareOperation }],

    }))

    const oldDoc = await db.findOneAndUpdate(
        collections.COCREDDETAILS,
        { "uid": uid },
        [{ $set: compareOperation }],
    )
    console.log(oldDoc)
    if (!oldDoc.value) throw new Error("debit transaction impossible: balance is 0, please recharge cocreds first")
    const balance = oldDoc ? oldDoc.value.cocredBalance : 0 - cocreds;
    console.log(balance + '??????????????????????????????????????????')
    if (balance < cocreds || isNaN(balance)) throw new Error(`debit transaction impossible: balance less than cocreds by ${cocreds - balance} cocreds`)


    await db.updateField(collections.COCREDDETAILS, { uid: uid }, {
        $push: {
            transactions: {
                type: types.DEBIT,
                cocreds: cocreds,
                referanceID: referanceID,
                created: Date.now()
            }
        }
    })


    return balance - cocreds;

}
const cocredsCreditTransaction = async function (cocreds, uid, referanceID) {
    let transaction = {
        type: types.CREDIT,
        cocreds: cocreds,
        referanceID: referanceID,
        created: Date.now()
    }
    let freshDetails = {
        created: Date.now(),
        creatorUID: uid
    }
    const details = await db.findOneAndUpdate(
        collections.COCREDDETAILS,
        { uid: uid },
        {
            $inc: { cocredBalance: cocreds },
            $push: { transactions: transaction },
            $set: {
                updatedUID: uid,
                lastUpdated: Date.now(),
                asOfDate: Date.now()
            },
            $setOnInsert: freshDetails
        },
        { upsert: true }
    )
    return details.cocredBalance;
}
transaction.getCocredTransactions = async function (req) {
    if (!req.uid) throw new Error("uid required")
    return await db.findField(collections.COCREDDETAILS, { uid: req.uid });
}
/*//////////////////////////////////////////////////////////////*/
const TimeUnit = {
    DAY: 86400000000,
    WEEK: 604800000000,
    MONTH: 2592000000000,
    YEAR: 31536000000000
} // day/week/month/year
const modulePurchaseOrders = {}
modulePurchaseOrders.getAllPurchases = async function (req) {
    if (!req.uid > 0) throw new Error("unauthorised access")
    return await db.findFields(collections.MODULEPURCHASEORDERS, { uid: req.uid });
}
modulePurchaseOrders.createModulePurchase = async function (req, priceList, orderReferenceID) {
    try {
        if (!req.uid) throw new Error("unauthorised access")
        if (!priceList) throw Error(`priceList not provided`)
        // validate priceList object with db, 
        //     error:2priceList object not valid

        const subscriptionTime = priceList.subscriptionTime;
        const subscriptionTimeUnit = priceList.subscriptionTimeUnit;
        const subscriptionCocreds = priceList.subscriptionCocreds;
        const duration = priceList.duration;

        const module_duration = priceList.module_duration;
        const now = Date.now();

        const module_purchase_order = {
            "creatorUID": req.uid,
            "priceListID": priceList.priceListID,
            "purchaseDate": now,
            "status": "active",

            "updatedUID": null,
            "lastUpdated": null,
            "uid": req.uid,
            "purchaseOrderID": orderReferenceID ? orderReferenceID : `purchaseOrder:${now}${Math.random().toString(36)}${Math.random().toString(36)}`,
            "moduleID": priceList.moduleID,
            "cocreds": priceList.cocreds
        }

        if (!(module_purchase_order.priceListID && module_purchase_order.moduleID ))
            throw new Error(`invalid module purchase order ${JSON.stringify(priceList)}`)

        if (subscriptionTime && subscriptionTimeUnit && subscriptionCocreds && duration) {
            module_purchase_order.subscriptionTime = subscriptionTime;
            module_purchase_order.subscriptionTimeUnit = subscriptionTimeUnit;
            module_purchase_order.subscriptionCocreds = subscriptionCocreds;
            module_purchase_order.duration = duration;
            module_purchase_order.invoices = [];
            const invoiceDuration = TimeUnit[subscriptionTimeUnit] * subscriptionTime;
            module_purchase_order.expiry = now + invoiceDuration;

            const totalDuration = TimeUnit['DAY'] * duration;

            console.log(totalDuration, invoiceDuration, totalDuration/invoiceDuration)

            for (let i = now; i < now + totalDuration; i += invoiceDuration) {
                module_purchase_order.invoices.push({
                    invoiceID: orderReferenceID ? orderReferenceID :`invoice:${now}${Math.random().toString(36)}${Math.random().toString(36)}`,
                    invoiceDate: i,
                    cocreds: subscriptionCocreds,
                    status: 'unpaid',
                    paidDate: null
                })
            }

            module_purchase_order.invoices[0].paidDate = now;
            module_purchase_order.invoices[0].status = 'paid';


        } else {
            module_purchase_order.expiry = now + priceList.module_duration;
        }

        let resp = await db.setField(collections.MODULEPURCHASEORDERS, module_purchase_order)
        console.log(resp + " ******** " + JSON.stringify(resp))

        return module_purchase_order
    } catch (e) { console.log(e); throw new Error(e) }
}
/*//////////////////////////////////////////////////////////////*/

const priceList = {}
priceList.getPriceList = async function (priceListID) {
    return await db.findField(collections.PRICELIST, { priceListID: priceListID });
}

priceList.getAllPriceLists = async function (req) {
    if (!req.uid) throw new Error("unauthorised access")
    let keys = applyFilters(req)
    return await db.findFields(collections.PRICELIST, keys);
}

priceList.getYourPriceLists = async function (req) {
    if (!req.uid) throw new Error("unauthorised access")
    let keys = applyFilters(req)
    keys.uid = req.uid
    return await db.findFields(collections.PRICELIST, keys);
}

priceList.listModule = async function (req) {
    if (!req.uid) throw new Error("unauthorised access")

}


//*//////////////////////////////////////////////////////////////*/
//Utility function to build keys with aggregation pipeline for getting specific docs
//*//////////////////////////////////////////////////////////////*/

const applyFilters = function (req) {
    return {}
}

// TODO integrate scheduler to auto deduct
// TODO apis for setting/modifying modules and pricelist and cocredProducts
// TODO standardise status values: paid unpaid pending locked unlocked...( creating JSONs...)
