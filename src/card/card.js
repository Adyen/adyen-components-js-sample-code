// 0. Get clientKey
getClientKey().then(async clientKey => {

    // Optional, define custom placeholders for the Card fields
    // https://docs.adyen.com/online-payments/web-components/localization-components
    // const translations = {
    //     "en-GB": {
    //         "creditCard.numberField.placeholder": "1234 5678 9012 3456",
    //         "creditCard.expiryDateField.placeholder": "MM/YY",
    //     }
    // };

    // 1. Create an instance of AdyenCheckout
    const checkout = await AdyenCheckout({
        environment: 'test',
        locale: "en-GB",
        // Optional, define custom placeholders for the Card fields
        // https://docs.adyen.com/online-payments/web-components/localization-components
        // translations: translations,
        clientKey: clientKey // Mandatory. clientKey from Customer Area
    });

    // 2. Create and mount the Component
    const card = checkout
        .create('card', {
            // Optional Configuration
            // hasHolderName: true,

            // Optional. Customize the look and feel of the payment form
            // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
            styles: {},

            // Optionally show a Pay Button
            showPayButton: true,

            // Events
            onSubmit: (state, component) => {
                if (state.isValid) {
                    makePayment(card.data);
                }
            },

            onChange: (state, component) => {
                // state.data;
                // state.isValid;

                updateStateContainer(state); // Demo purposes only
            }
        })
        .mount('#card-container');
});