function onLogin(req){
    if (not logged in) throw error
    search for cocredDetails object in cocredDetails collection for user 
    if(not found) then create
    return the details of user to frontend
}

----------------------------------------------------------------------------------------
/*
type: "cocred"/"debit"
data:{
    amount:number
    (if cocred topup:)
    razorpayOrderID,
    razorpayPaymentID,
    (else if module purchase:)
    expiry
    amount
    invoice (if subscription module,it's the as is object fetched from priceList)
req
}
*/
function processTransaction(string type, object data, req){

    if(not authentick ) unauthorised
    lock cocredDetails of user
    if( already it is Locked ) then return error
    
    if(type == 'debit'){
        . valiadte balance of user in cocredDetails , against the debit amount
        . if(not found enough balance) 
            . unlock cocredDetail document in database
            . throw the error
        . if(invoice object is provided) create purchase object with invoices object,
            *   1st invoice paid, others pending, with their IDs, timestamps and expiris..
            *   adding subsceiptionTime, subscriotionTimeUnit, ... to purchase object
            store in module_purchase_orders
        . else: create purchase object in module_purchase_orders with all required data fields: created, status...
        . push this debit transaction in cocredDetails of user in cocredDetails collection
        . decrease cocredDetails's cocred balance 
    }
    else if(type == 'cocred'){
        . update cocredOrder object with razorpay orderID, paymentID, status = success, timestamp... 
        . push the cocred transaction to cocredDetails of user in cocredDetails collection
        . increment cocredDetails's cocred balance 
    }
    else{
        throw error: invalid transaction type!
    }

    unlock cocredDetail document in database
}
/*
data:{
    amount:number
    expiry
    amount
    invoice (if subscription module,it's the as is object fetched from priceList)
req
}
*/
function processDebitTransaction(){
    if(not authentick ) unauthorised

    let db_resp = await db.FindOne("cocredDetails", 
    { query:{uid:1, cocredBalance:{$gte:amount}, status:"unlocked"} , 
      update:{
          $set:{status:"locked"}, 
          $incr:{cocredBalance:-1*amount} , 
          $set:{status:"unlocked"}} 
        }
        new:true
        )
    if(db_resp.lastErrorObject.updatedExisting){ 
        . create purchase_order object in purchase_orders
        . push this debit transaction in cocredDetails of user in cocredDetail collection
        return { status:success }
    }
    else return { error: " try after some time "}
}
/*
data:{
    amount:number
    razorpayOrderID,
    razorpayPaymentID,
req
}
*/
function processCreditTransaction(){
    if(not authentick ) unauthorised
    . lock
    . increment cocredDetails's cocred balance 
    . push the cocred transaction to cocredDetails of user in cocredDetails collection
    . unlock
    . update cocredOrder object with razorpay orderID, paymentID, status = success, timestamp... 
}
----------------------------------------------------------------------------------------

function purchaseCocreds(req){
    if (not logged in) error: unauthorised
    . make cocredOrder object with null fields for raz. order & payments and uid store in cocredOrders collection
    . make razorpay order 
    . if (could not be made) update createOrder accordingly...
    . store orderID in cocredOrder
    . return orderID (to frontend client side)
}

function purchaseModule(req){
    if (not logged in) error: unauthorised
    verify module and amount with priceList (by getting pricelist for req.priceListID )
    get debit amount as the module price found in priceList collection
    get expiry from module 
    if(priceList has invoice object) processTransaction("debit", {amount, expiry, invoice}, req)
    else processTransaction("debit", {amount, expiry}, req)
}


-----------------------------------------------------------------------------------------

function initiatePayment(){         //client side
    validate login
    call server for purchaseCocreds(req), get orderID 
    initiate razorpay object with orderID and callback url      // needs research
}

function initiatepurchaseModule(){
    validate login
    call purchaseModule(priceListID) server api with priceListID
}
------------------------------------------------------------------------------------


function paymentSuccess(req){
    processTransaction("cocred", {req.razorpayOrderID, razorpayPaymentID}, req)
}

function paymentFailure(req){
    if(not authentick) error: unauthorised
    update cocredOrder object with razorpay paymentID, status = failed, timestamp...
}

------------------------------------------------------------------------------------------


//TODO-----------------------------------------------
1. module purchase
2. cocred purchase
3. re-name remaning collections: db.cocredDetails.renameCollection(cocred_details)
4. web hooks for when payment done (failed and success)
https: //razorpay.com/docs/webhooks/setup-edit-payments/
