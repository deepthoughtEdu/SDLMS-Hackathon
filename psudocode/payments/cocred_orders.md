// all functions related to cocred_Orders collections

errors
 1. amount/quantity/productID required

returns: created object

function initiateCocredOrder({amount, quantity, productID, status=pending, orderID}, req){
    . if(not logged in) error
    . if amount/quantity/productID/orderID is not given, return error:1. amount/quantity/productID/orderID required
    . find cocredOrder object with:
    { uid : req.uid , status : pending, error:null, amount : amount, 
    quantity : quantity, productID : productID , paymentID : null , 
    orderID : orderID, updatedUID:null, lastUpdated:null ,
     created: date.now, cocredOrderID : {unique value} }
    . return cocredOrder object
}

/*
inputs:
    data to update:{paymentID, orderID, error, status}
    validator: req or {uid and authToken}
    identifier:  cocredOrderID or orderID for identifying the cocredDetail object

    error:1 no identifier provided for updateRazorpayDetails
    error:2. cocredOrderID/orderID invalid
    error:3. unauthorised
*/
function updateRazorpayDetails({paymentID, orderID, error, status}, validator, cocredOrderID or orderID){
    . if(not logged in) throw error:3. unauthorised
    . if neither cocredOrderID nor orderID is provided: error:1 no identifier provided for updateRazorpayDetails
    . update cocredOrder object of that cocredOrderID with razorpay orderID, paymentID, status : status, also lastUpdated : Date.now, updated : uid 
        . if cocredOrder not found: error:2. cocredOrderID/orderID invalid
}

function getOrders(req){
    . validate req
    . return cocred_Orders of user in paginated, timely sorted, manner with filters(if applied)
}
