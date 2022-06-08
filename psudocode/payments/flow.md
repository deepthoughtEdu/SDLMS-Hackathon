input: req OR {authToken and uid}
returns: {created:true/false, msg: already exists}

function setUpCocredDetails(req){ 
    validate user
    search for cocredDetails object in cocredDetails collection for user 
    if(not found) then create
        return {created:true}
    else return {created:false, msg: already exists}
}

----------------------------------------------------------------------------------------
inputs: priceList ID , moduleID 

error:1. valid priceList not found or priceListID not valid
error:2. priceList expired already at + time
error:3. moduleID mismatch, invalid request
error:4. debit transaction impossible: balance less than cocreds{difference} 
error:5. already enrolled in the module!

function purchaseModule(priceList ID , moduleID, req){         $rout$
    . if (not logged in) error: unauthorised

    . getPriceList(priceListID)
    . if not fund: throw error: valid priceList not found or priceListID not valid
    . if priceList expired: throw error: priceList expired already at + time
    . verify module with priceList 
        if moduleID mismatch: error:3. moduleID mismatch, invalid request

    . if( isCurrentlyEnrolled(req.uid, moduleID) && forceEntry==false)
        . throw error:5. already enrolled in the module!
    
    . purchaseOrder = createModulePurchase( priceList object )
    
    . cocredsTransaction("debit", priceList.cocreds,purchaseOrderID, req)
    . error: cocredDetails not found for this uid:
        . setUpCocredDetails(uid, authToken)
        . cocredsTransaction("credit", priceList.cocreds,  {uid, authToken})
    . error: debit transaction impossible: balance less than cocreds{difference} 
        . throw:error 4. debit transaction impossible: balance less than cocreds{difference} 


    return purchaseOrder object
    
}

----------------------------------------------------------------------------------------------

/*

*/
input: paymentID, orderID, uid, authToken
output: (?)
error:  1. cocredOrder object not found (critical error!! )

function onPaymentCapturedWebhook({paymentID, orderID,cocredOrderID, uid, authToken}){    $rout$     
    . validate that webhook from raz. via authToken
    . if not authentic: return
    . validate payment signature //!!
    . if not authentic: return
    . getCocredOrder(orderID), cocreds = cocredOrder.quantity * cocredOrder.cocreds
        . if not found: error:1. cocredOrder object not found, 
            . notify user with orderID, paymentID
    . cocredsTransaction("credit", cocreds ,cocredOrderID or cocredOrder object,  {uid, authToken})
    . updateRazorpayDetails({paymentID, "success"}, {uid, authToken}, orderID )
    . notify user about payment: success, amount, orderID, time.
}

function onPaymentFailureWebhook({paymentID, orderID, amount, uid, authToken})       $rout$  {                               
    . validate that webhook from raz. via authToken
    . if not authentic: return
    . updateRazorpayDetails({paymentID, "failure", 
    error:"payment processing error"+ error from razorpay }, req, orderID )
    . notify user about payment: failure, amount, orderID, time.
}

/*
    outputs: cocredOrder object
    inputs: productID, quantity, razorpayOrderID and req

    errors:
    1. cocredProduct not found or productID not valid
    2. product expired! + productID + expired at: {time}
    3. payment initiation i.e.  orderID generation failed: ( razorpay side error: )
        1.bcz inapropriate data is passed inn:(status 400)
            1. resp.error.description  "The <field> field is required." (but wasnt passed)
            2. resp.error.description  "<field> is/are not required and should not be sent",
        2.rare errors: (status 401, 402, ... 410)
    
    5.  quantity/productID not provided
    6. unauthorised

rzp_test_1GfqQqQQQQQQQQQ
rzp_live_1GfqQqQQQQQQQQ
cnpwX2xpdmVfak5DRTkydTZ4NTZtbXI6TmtrTDl6ZnBsb3NHYlJmVlVxQXpHU1JX

function generateOrder(productID, quantity, req){                                  $rout$
    . if (not logged in) error:6. unauthorised
    . if quantity/productID not given: error:5. quantity/productID not provided
    . getCocredProduct(productID), get amount and cocredsOffered from here
    . if error:Product not found: 
        throw error:1 cocredProduct not found or productID not valid
    . if product expired:
        throw error:2. product expired! + productID + {time}
    . else
        . make razorpay order via their API with: body JSON = 
        {"amount": amount*quantity,"currency": "INR","receipt":productID}
            . if (razorpay side error: status:400 to 410) 
                .   return error:3 "payment initiation i.e.  orderID generation failed: ( razorpay side error: )"
                    + error message from razorpay api 
                    + status code : raz. api response status code
            . else 
                .   cocredOrder = initiateCocredOrder(amount , quantity, orderID, status: "pending", productID, req)
                .   return  cocredOrder object (to frontend client side)
}

------------------------------------------------------------------------------------------
input: productID, quantity

error:unauthorised
error:0. payment already initiated !

handeled errors from generateOrders api:
1. cocredProduct not found or productID not valid
2. product expired!
3. payment initiation i.e. orderID generation failed: + error message from razorpay api}, cocredOrderID )
4. quantity/productID not provided
5. payment process already initiated!

function initiatePayment(productID, quantity){         //client side
    . validate login 
        . if not logged in: error:unauthorised
            . redirect to login page
  
    . if pay button already frozen: 
        . error:0. payment already initiated !
    . freeze the pay button (to avoid user clicking it again untill this order is processed)

    . generateOrder(productID, quantity), get orderID and cocredOrderID   
    . error:1 or 2 or 5:
        display error: {resp.error.message} 
        refresh the page 
    . error:3 or 4: 
        display error: {resp.error.message}
        unfreeze pay button
    . if success: 
        . initiate razorpay object with: 
            orderID, amount, and callback url, public_key
            ( and other fields corruncy: INR, name: Deepthought, description: top-up, img: logo, theme: blue  )
        . if user closes dailogue box b4 filling details inn/ scanning QR : 
            . handelled by razorpay sdk: it displays notif. about the same 
            . payment.failure webhook is fired, we handle it on server
        . razorpay SDK will handle the payment dailogue box, and: 
            *   redirect to success/failure url (if filling details inn/ scanning QR done + UPI otp entered -> success, else failure)
            *   fire the payment.captured/payment.failure webhooks that is configured, to notify the server with paymentID and orderID (from their server to our one) when  (? payment.capture or payment.authenticated ?)
}

-----------------------------------------------------------

input: priceListID
    error:0. unauthorised
    error:1. valid priceList not found or priceListID not valid
    error:2. priceList expired already at + time
    error:3. moduleID mismatch, invalid request
    error:4. debit- transaction impossible: balance less than cocreds{difference} 

function initiateModulePurchase(priceListID){
    . disable screen input, put loder
    . validate login, if not: error:2 unauthorised
    . get balance from ajaxify and validate if purchase can hapen
        . if not, display error:4. debit transaction impossible: balance less than cocreds{difference}
    . call purchaseModule(priceListID, moduleID) server api with priceListID
    . error:1. valid priceList not found or priceListID not valid
        display error:1. valid priceList not found or priceListID not valid
        enable screen
    . error:2. priceList expired already at + {time}
        display error:1. priceList expired already at + time
        enable screen
    . error:3. moduleID mismatch, invalid request
        display error:1. moduleID mismatch, invalid request
        enable screen
    . error:4. debit transaction impossible: balance less than cocreds{difference} 
        display error: debit transaction impossible: balance less than cocreds{difference}  
        redirect to cocreds topup page
}
------------------------------------------------------------------------------------

// I will do it as a single db query with transaction pipeline in mongoDB, will this b good?

run checkInvoices() everyday 12.00 AM via schedulerJS { need to research }

^^ figure out notifications
function checkinvoices(){
    . get threshold days as warning days from config
    . in module_purchase_orders collection, find all purchase module objects that:
        1. have invoices array as a subdocument 
        3. have invoiceDate of latest pending invoice less than today's date + warning days 
        ( latest pending invoice means: invoice whose index is least in array of invoices, as they are kept sorted w.r.t. time while creating ) 
    . with each such purchase module objects , we do : 
        if(balance>subscriptionCocreds)
        . $set:{expiry:date.now + one interval, invoice.paidDate = date.now, }
        . cocredsTransaction("debit",invoiceOrderID, subscriptionCocreds)
        else
            . notifyUser(message: cocreds topup needed !+ no. of cocreds, cource ) ( how ! => maybee add a notification, which is not created yet )
}


//? say auto deduct warning period is 2 days, on 30th there is invoice due, so 
on 28th, 29th, 30th the code will detect the invoice, and try to debit, if not possible will throw notiff.
BUT, what after 30th ? 
should we let them manually pay for resuming the course, 
or still each day this pending invoice has to be detected and notified for ?


//? for when due is on 30th, say jan 30th it auto deducted, feb 30th there were no funds, also, for full march there were no funds, so not allowed to enter,
but on march 25 funds got added, 
now, 
on march 30, the auto-deduct should cut the amount for which month ?
March (which he almost didnt attend as didnt pay, but now would have accessories and submission rights,etc... , if pays)
OR, April ?
OR, his entire month's cource will resume from 25th as a beginning date?  from where he left (which is not possible in case of live cources altho)



------------------------------------------------------------------------------------------


//TODO-----------------------------------------------
4. web hooks for when payment done (failed and success)
https: //razorpay.com/docs/webhooks/setup-edit-payments/
