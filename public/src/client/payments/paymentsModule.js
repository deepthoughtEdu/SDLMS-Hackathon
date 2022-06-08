'use strict';

/* globals define */

define('forum/payments/paymentsModule', ['payments/payments', 'https://checkout.razorpay.com/v1/checkout.js'], function (api) {
    var paymentsModule = {}
    let module = new Payments();

    paymentsModule.init = () => {
        console.log('paymentsModule init')
        
        $('body').on('click', '#razorpay', async function () {
            let productID = $('#productID').val()
            let quantity = $('#quantity').val()

            try {

                let description = ajaxify.data.records.allCocredProducts.find(prd => prd.productID == productID).productName
                description = description ? description : 'desc. not found'

                module.cocredProductPurchse(
                    description,
                    productID, quantity,
                    razorpayPaymentFailureHandler,
                    razorpayPaymentSuccessHandler);
            } catch (err) {
                module.handleError(err)
            }
        }
        )

        $('body').on('click', '#module-purchase', async function () {

            let priceListID = $("#priceListID").val();
            let moduleID = $("#moduleID").val();
            let price_list = ajaxify.data.records.priceList.find(priceList => priceList.priceListID == priceListID);
            let cocreds = price_list.cocreds ? price_list.cocreds : price_list.subscriptionCocreds
            let balance = ajaxify.data.records.cocredDetail.cocredBalance
            let array = ajaxify.data.records.allCocredProducts


            console.log(cocreds)
            console.log(priceListID)
            console.log(moduleID)
            console.log(balance)

            module.initModulePurchse(moduleID, priceListID, cocreds, balance)
                .then((order) => {
                    console.log(order)
                    if (order)
                        window.location.href = `/paymentPage`;
                }).catch((err) => {
                    module.handleError(err);
                })
        })

        $('#orders').html('')
        $('#orders').append(show(ajaxify.data.records.cocredOrders, [`productID`, `quantity`, `status`, `amount`, `error`]))
        $('#purchases').html('')
        $('#purchases').append(show(ajaxify.data.records.moduleOrders, [`moduleID`, `priceListID`, `status`, `cocreds`]))
        if (ajaxify.data.records.cocredDetail) {
            $('#history').html('')
            $('#history').append(show(ajaxify.data.records.cocredDetail.transactions, [`cocreds`, `type`]))
            $('#history').append(`<br><hr><h2>Balance: ${JSON.stringify(ajaxify.data.records.cocredDetail.cocredBalance)}</h2>`)
        } $('#cocredProducts').html('')
        $('#cocredProducts').append(show(ajaxify.data.records.allCocredProducts, [`productName`, `amount`, `cocredsOffered`, `productID`]))
        $('#priceList').html('')
        $('#priceList').append(show(ajaxify.data.records.priceList.filter(l => l.cocreds), [`priceListID`, `moduleID`, `cocreds`, `module_duration`]))
        $('#priceList').append(show(ajaxify.data.records.priceList.filter(l => l.subscriptionCocreds), [`priceListID`, `moduleID`, `subscriptionCocreds`, `subscriptionTimeUnit`, `subscriptionTime`, `duration`]))
    }

    // displays array of objects as a table
    // params: array to be displayed, fields to be displayed for each object
    function show(array, data) {
        if (!array) return ''
        if (!array.length) return ''
        let t = `<table class="table table-striped"><tr>`
        for (let i = 0; i < data.length; i++) {
            let row = array[i]
            t += `<th>${data[i]}</th>`
        }
        t += `</tr>`
        for (let index = array.length - 1; index >= 0; index--) {
            const element = array[index];
            console.log(element)
            t += `<tr>`
            for (let key of data) {
                t += `<td>${element[key]}</td>`
            }
            t += `</tr>`
        }
        t += `</table>`
        console.log(t, array, data)
        return t
    }

    const razorpayPaymentFailureHandler = function (response) {
        alert(`${response.error.code} , 
                            ${response.error.description} , 
                            ${response.error.source} , 
                            ${response.error.step} , 
                            ${response.error.reason} , 
                            ${response.error.metadata.order_id} , 
                            ${response.error.metadata.payment_id}`)
        window.location.href = config.relative_path + '/paymentPage'
    }
    const razorpayPaymentSuccessHandler = function (response) {
        alert(`payment successfull! `)
        window.location.href = config.relative_path + '/paymentPage'
    }


    // This is payments Module, internally calls apis for payments.
    // TODO: make a new nodebb frontend module out of this
    // TODO: modify handleError function to handle multiple types of errors, currently it is only giving a pop up
    // const module = {}

    // module.handleError = function (err) {
    //     try {
    //         console.log(err);
    //         //error from axois- api call
    //         if (err.responseJSON && err.responseJSON.status && err.responseJSON.status.message)
    //             window.alert('responseJSON : ' + err.responseJSON.status.message)
    //         //error thrown from frontend modules/JS itself
    //         else if (err.message) window.alert('errormsg: ' + err.message)
    //         //other misc./unknown errors(?)
    //         else window.alert('error: ' + err)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    // module.cocredProductPurchse = function (productID, quantity,
    //     razorpayPaymentFailureHandler,
    //     razorpayPaymentSuccessHandler) {
    //     try {
    //         console.log('rrrrrrrrrrrrrrrr', productID, quantity)
    //         if (!(productID && quantity)) {
    //             throw new Error(`productID and quantity are required, given: ${productID} ${quantity}`)
    //         }
    //         if (!isNaN(quantity)) quantity = parseFloat(quantity)
    //         if (typeof quantity !== 'number' || quantity <= 0 || quantity % 1 > 0) {
    //             throw new Error(`quantity must be a positive integer, given: ${typeof quantity}: ${quantity}`)
    //         }

    //         doAjax({
    //             url: '/payments/order',
    //             method: 'POST',
    //             data: JSON.stringify({
    //                 "productID": productID,
    //                 "quantity": quantity,
    //             }),
    //             dataType: 'json',
    //             contentType: 'application/json',
    //             success: function (order) {
    //                 console.log(order)
    //                 const orderID = order.response.order.id
    //                 if (!orderID) {
    //                     console.log('orderID not found, maybe structure of response has changed internally')
    //                     return
    //                 }
    //                 window.alert(`order generated: ${orderID}`)

    //                 let description = ajaxify.data.records.allCocredProducts.find(prd => prd.productID == productID).productName
    //                 description = description ? description : 'desc. not found'

    //                 razorPayInit(description, orderID,
    //                     razorpayPaymentFailureHandler,
    //                     razorpayPaymentSuccessHandler)
    //             },
    //             error: function (err) {
    //                 module.handleError(err)
    //             }
    //         })
    //     } catch (err) {
    //         module.handleError(err)
    //     }
    // }

    // const razorPayInit = (description, orderID, razorpayPaymentFailureHandler, razorpayPaymentSuccessHandler) => {
    //     try {
    //         if (!orderID) throw new Error('orderID not provided for razorPayInit')
    //         if (!description) throw new Error('description not provided for razorPayInit')
    //         var options = {
    //             "key": "rzp_live_jNCE92u6x56mmr", // Enter the Key ID generated from the Dashboard
    //             "currency": "INR",
    //             "name": "DeepThought",
    //             "description": "Test Transaction",
    //             "image": "https://sdlms.deepthought.education/assets/uploads/files/system/site-logo.svg",
    //             "order_id": orderID, //This is a sample Order ID. Pass the `id` obtained in the previous step
    //             "handler": function (response) {
    //                 alert((`response.razorpay_payment_id: ${response.razorpay_payment_id}`));
    //                 razorpayPaymentSuccessHandler(response)
    //             },
    //             "prefill": {},
    //             "theme": {
    //                 "color": "#3399cc"
    //             }
    //         };
    //         var rzp1 = new Razorpay(options);
    //         rzp1.on('payment.failed', function (response) {
    //             razorpayPaymentFailureHandler(response)
    //         });
    //         rzp1.open();
    //     } catch (err) { module.handleError(err) }
    // }

    // module.initModulePurchse = async function (moduleID, priceListID, cocreds, balance) {
    //     try {

    //         if (balance < cocreds || !cocreds) throw new Error('Insufficient balance')
    //         const order = await $.ajax({
    //             url: config.relative_path + '/api/v3' + '/payments/purchase',
    //             "method": "POST",
    //             data: {
    //                 "priceListID": priceListID,
    //                 "moduleID": moduleID
    //             },
    //             success: function (order) {
    //                 return order;
    //             }
    //             , error: function (err) {
    //                 module.handleError(err)
    //             }
    //         })
    //         console.log(order);
    //         return order;
    //     } catch (err) {
    //         module.handleError(err)
    //     }
    // }

    return paymentsModule
});