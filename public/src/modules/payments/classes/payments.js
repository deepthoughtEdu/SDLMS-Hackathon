class Payments {
    constructor(params) {
        this.data = params;
    }

    handleError(err) {
        let $that = this;
        try {
            console.log(err);
            //error from axois- api call
            if (err.responseJSON && err.responseJSON.status && err.responseJSON.status.message)
                window.alert('responseJSON : ' + err.responseJSON.status.message)
            //error thrown from frontend modules/JS itself
            else if (err.message) window.alert('errormsg: ' + err.message)
            //other misc./unknown errors(?)
            else window.alert('error: ' + err)
        } catch (err) {
            console.log(err)
        }
    }

    cocredProductPurchse(description, productID, quantity,
        razorpayPaymentFailureHandler,
        razorpayPaymentSuccessHandler) {
        let $that = this;
        try {
            console.log('rrrrrrrrrrrrrrrr', productID, quantity)
            if (!(productID && quantity)) {
                throw new Error(`productID and quantity are required, given: ${productID} ${quantity}`)
            }
            if (!isNaN(quantity)) quantity = parseFloat(quantity)
            if (typeof quantity !== 'number' || quantity <= 0 || quantity % 1 > 0) {
                throw new Error(`quantity must be a positive integer, given: ${typeof quantity}: ${quantity}`)
            }

            doAjax({
                url: '/payments/order',
                method: 'POST',
                data: JSON.stringify({
                    "productID": productID,
                    "quantity": quantity,
                }),
                dataType: 'json',
                contentType: 'application/json',
                success: function (order) {
                    console.log(order)
                    const orderID = order.response.order.id
                    if (!orderID) {
                        console.log('orderID not found, maybe structure of response has changed internally')
                        return
                    }
                    window.alert(`order generated: ${orderID}`)


                    $that.razorPayInit(description, orderID,
                        razorpayPaymentFailureHandler,
                        razorpayPaymentSuccessHandler)
                },
                error: function (err) {
                    $that.handleError(err)
                }
            })
        } catch (err) {
            $that.handleError(err)
        }
    }

    razorPayInit(description, orderID, razorpayPaymentFailureHandler, razorpayPaymentSuccessHandler) {
        try {
            if (!orderID) throw new Error('orderID not provided for razorPayInit')
            if (!description) throw new Error('description not provided for razorPayInit')
            var options = {
                "key": "rzp_live_jNCE92u6x56mmr", // Enter the Key ID generated from the Dashboard
                "currency": "INR",
                "name": "DeepThought",
                "description": description,
                "image": "https://sdlms.deepthought.education/assets/uploads/files/system/site-logo.svg",
                "order_id": orderID, //This is a sample Order ID. Pass the `id` obtained in the previous step
                "handler": function (response) {
                    alert((`response.razorpay_payment_id: ${response.razorpay_payment_id}`));
                    razorpayPaymentSuccessHandler(response)
                },
                "prefill": {},
                "theme": {
                    "color": "#3399cc"
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                razorpayPaymentFailureHandler(response)
            });
            rzp1.open();
        } catch (err) { module.handleError(err) }
    }

    initModulePurchse(moduleID, priceListID, cocreds, balance) {
        let $that = this;
        return new Promise((resolve, reject) => {
            if (balance < cocreds || !cocreds) reject('Insufficient balance');

            doAjax({
                type: 'POST',
                url: '/payments/purchase',
                data: JSON.stringify({
                    "priceListID": priceListID,
                    "moduleID": moduleID
                }),
                dataType: 'json',
                contentType: 'application/json',
            }).then(function (res) {
                resolve(res)
            }).catch((err) => {
                if (err.responseJSON && err.responseJSON.status && err.responseJSON.status.message) {
                    reject(err.responseJSON.status.message, 'error');
                } else {
                    reject(err.message)
                }
            })
        })


        try {


            // const order = $.ajax({
            //     url: 
            //     "method": "POST",
            //     ,
            //     success: function (order) {
            //         return order;
            //     }
            //     , error: function (err) {
            //         $that.handleError(err)
            //     }
            // })
            // console.log(order);
            // return order;
        } catch (err) {
            $that.handleError(err)
        }
    }
}