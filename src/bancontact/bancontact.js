// 0. Get originKey
getClientKey().then(clientKey => {
    // 1. Create an instance of AdyenCheckout providing an originKey
    const checkout = new AdyenCheckout({
        clientKey: clientKey, // Mandatory. originKey from Customer Area
        environment: 'test',
        amount: { currency: 'EUR', value: 1000 }, // amount to be shown next to the qrcode
        onAdditionalDetails: result => {
            console.log(result);
        },
        onError: error => {
            console.log(error);
        }
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
        if (!!response.action) {
            // 2. Create and mount the Component
            const bancontact = checkout.createFromAction(response.action).mount('#bancontact-container');
        }
    });
});
