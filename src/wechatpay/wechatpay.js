// 0. Get originKey
getOriginKey().then(originKey => {
    // 1. Create an instance of AdyenCheckout providing an originKey
    const checkout = new AdyenCheckout({
        environment: 'test',
        originKey: originKey // Mandatory. originKey from Costumer Area
    });

    // Override our default demo config for this payment method
    const wechatData = {
        countryCode: 'CN',
        amount: {
            value: 1000,
            currency: 'CNY'
        },
        paymentMethod: {
            type: 'wechatpayQR'
        }
    };

    /** Call the /payments endpoint to retrieve the necessary data to start the Wechat Pay component
     *  We need the following parts of the response
     *  - qrCodeData (redirect.data.qrCodeData): The data the QR Code will contain
     *  - paymentData Necessary to communicate with Adyen to check the current payment status
     */
    makePayment(wechatData).then(response => {
        if (response.resultCode === 'PresentToShopper') {
            // 2. Create and mount the Component
            const wechatpay = checkout
                .create('wechatpay', {
                    paymentData: response.action.paymentData,
                    amount: { currency: 'CNY', value: 1000 }, // amount to be shown next to the qrcode
                    qrCodeData: response.action.qrCodeData,

                    // Events
                    onComplete: result => {
                        console.log(result);
                    },
                    onError: error => {
                        console.log(error);
                    }
                })
                .mount('#wechatpay-container');
        }
    });
});
