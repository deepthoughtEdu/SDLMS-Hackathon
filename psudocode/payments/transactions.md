// all functions related to cocredDetails collection

/*
inputs:
    type:"debit","credit"
    amount:number
    validator: either req or {uid, authToken}

error:2. debit transaction impossible: balance less than cocreds {difference}
error:3. invalid transaction type
error:4. referanceID not found
}
*/ ^^pass the object as well
    
function cocredsTransaction(type, cocreds, validator, referance object){
    . if(not authentick ) unauthorised
    .if(!referanceID) throw:error:4. referanceID not found
    . find cocredDetail object
        if not found: setUpCocredDetails()
    . if CREDIT : cocredsDebitTransaction(amount, uid, cocredOrder.cocredOrderID)
    . if DEBIT : cocredsCreditTransaction(amount, uid, modulePurchaseOrcer.ID)
    . error: 1. balance less than cocreds {difference}
        throw:error:2 debit transaction impossible: balance less than cocreds {difference}
    . else:error:3. invalid transaction type
    . else return new balance.
}

input: amount and uid
error: 1. balance less than cocreds {difference}

^^for all internal methods, as far as possible, instead of IDs, pass objects itself
function cocredsDebitTransaction(cocreds, uid, referanceID){
    
    . lock cocredDetail object
    . validate balance against given amount
    . if(not found enough balance) 
        . unlock cocredDetail document in database
        . throw error:1. balance less than cocred.{difference}
    . decrease cocredDetails's cocred balance 
    . push this debit transaction in cocredDetails of user in cocredDetails collection with {referanceID: referanceID, type: debit, cocreds: cocreds}
    . unlock cocredDetail object
    . return new balance
}

function cocredsCreditTransaction(cocreds, uid, referanceID){
    
    . lock 
    . increment cocredDetails's cocred balance 
    . push the cocred transaction to cocredDetails of user in cocredDetails collection
    . update details like last updated by and last updated time...
    . unlock
    . return new balance
}