// 0. Get originKey
getOriginKey().then(originKey => {
    // 1. Create an instance of AdyenCheckout providing an originKey
    const checkout = new AdyenCheckout({
        originKey: originKey, // Mandatory. originKey from Costumer Area
        environment: 'test'
    });

    // Override our default demo config for this payment method
    const bancontactData = {
        countryCode: 'BE',
        amount: {
            value: 1000,
            currency: 'EUR'
        },
        paymentMethod: {
            type: 'bcmc_mobile_QR'
        }
    };

    /** Call the /payments endpoint to retrieve the necessary data to start the Bancontact component
     *  We need the following parts of the response
     *  - qrCodeData (redirect.data.qrCodeData): The data the QR Code will contain
     *  - paymentData Necessary to communicate with Adyen to check the current payment status
     */
    makePayment(bancontactData).then(response => {
        if (response.resultCode === 'PresentToShopper') {
            // 2. Create and mount the Component
            const bancontact = checkout
                .create('bcmc_mobile', {
                    paymentData: response.action.paymentData,
                    amount: { currency: 'EUR', value: 1000 }, // amount to be shown next to the qrcode
                    qrCodeData: response.action.qrCodeData,

                    // Events
                    onComplete: result => {
                        console.log(result);
                    },
                    onError: error => {
                        console.log(error);
                    }
                })
                .mount('#bancontact-container');
        }
    });
});
