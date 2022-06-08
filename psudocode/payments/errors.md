## Backend:

error: (`razorpay webhook request not verified +\n ${req.url} +\n ${JSON.stringify(req.body)} \n+ ${JSON.stringify(req.rawHeaders)}`);
error: ('cocredOrder object not found' + JSON.stringify(req.body.payment.entity))
error: (`quantity must be a positive integer, given: ${typeof quantity} : ${quantity} `)
error: ('productID/non-zero quantity required, given : ' + JSON.stringify(req.body));
error: ('cocredProduct not found or productID not valid');
error: (`cocredProduct : ${productID} is expired or not active`);
error: ("valid priceList not found or priceListID not valid", { code: `INVALID_PRICELIST` })
error: (`priceList expired already b4 ${listedItem.end_date + new Date.getTime()}`)
error: ('user not logged in');
error: (`amount/quantity/productID/orderID required, given : ${JSON.stringify(order)}`);
error: ('cocredOrderID or orderID required');
error: ("unauthorised access")
error: ('productID required');
error: ("unauthorised access")
error: ("invalid transaction type")
error: ("debit transaction impossible: balance is 0, please recharge cocreds first")
error: (`debit transaction impossible: balance less than cocreds by ${cocreds - balance} cocreds`)
error: ("uid required")
error: ("unauthorised access")
error: (`invalid module purchase order ${JSON.stringify(priceList)}`)

## FRONTEND:

error: (`productID and quantity are required, given: ${productID} ${quantity}`)
error: (`quantity must be a positive integer, given: ${typeof quantity}: ${quantity}`)
error: ('orderID not provided for razorPayInit')
error: ('description not provided for razorPayInit')
error: ('Insufficient balance')