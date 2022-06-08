error:1. priceList object not provided
error:2. priceList object not valid

input:  priceList object, expiry
output: purchaseOrderID

function createModulePurchase( priceList object, expiry){
    . if no priceList, throw error:1. priceList not provided
    . validate priceList object with db, 
        error:2. priceList object not valid
        
    . if(invoice array is there in priceList) create module_purchase_order with invoices object, 
        each having invoiceDate = Date.now( += subscriptionTime * subscriptionTimeUnit  )
        *   expiry = length of 1st invoice that is paid.
        *   1st invoice paid, others pending
        *   adding subsceiptionTime, subscriotionTimeUnit, subscriptionCocreds, duration to module_purchase_order
        store in module_purchase_orders
    . else: create module_purchase_order in module_purchase_orders with: 
    {expiry = Date.now + priceList.moduleDuration ,created = Date.now,  created, creatorUID, uid, (!? status = "active") }
    . return created purchaseOrder objecxt
}

@@ if after upsert , it will also $set in same query ?!!!

input: invoiceOrderID, status

(unhandled!)
error: no invoiceOrderID given
error: no valid invoiceOrderID given

function updateSubscription(invoiceOrderID, status="paid"){
    if(no invoiceOrderID) error: no invoiceOrderID given
    update invoiceOrder : paidDate = Date.now, status=status
    if(invoiceOrder object not found)  error: no valid invoiceOrderID given
}

isCurrentlyEnrolled handle these 2 cases

function validateModule(moduleID, uid){
    . find object in module_purchase_objects such that:
        1. uid = uid
        2. moduleID = moduleID
        3. expiry >= date.now()
    . if found: return {validated=true, purchaseOrderID }
    . else return false
}

function validateSubscription(moduleID, uid, subscriptionTimeUnit){
    . find object in module_purchase_objects such that:
        1. uid = uid
        2. moduleID = moduleID
        4. subscriptionTimeUnit = subscriptionTimeUnit
        4. subscriptionTime = subscriptionTime
        3. invoices.invoiceDate >= date.now - subscriptionTimeUnit*subscriptionTime (in microseconds)
        4. status = paid
    . if found: return {validated=true, purchaseOrderID }
    . else return false
}