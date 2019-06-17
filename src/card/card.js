// 0. Get originKey
getOriginKey().then(originKey => {
    // 1. Create an instance of AdyenCheckout
    const checkout = new AdyenCheckout({
        environment: 'test',
        originKey: originKey // Mandatory. originKey from Costumer Area
    });

    // 2. Create and mount the Component
    const card = checkout
        .create('card', {
            // Optional Configuration
            // hasHolderName: true,

            // Optional. Customize the look and feel of the payment form
            // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
            styles: {},

            // Optional. Define custom placeholders for the Card fields
            // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
            placeholders: {
                // encryptedCardNumber: '9999 9999 9999 9999',
                // encryptedExpiryDate: '01/22',
                // encryptedSecurityCode : '123'
            },

            // Events
            onChange: (state, component) => {
                // state.data;
                // state.isValid;

                updateStateContainer(state); // Demo purposes only
            }
        })
        .mount('#card-container');

    // 3. Submit Payment
    const payButton = document.querySelector('.pay-button');
    payButton.addEventListener('click', e => {
        if (!card.isValid) {
            card.showValidation();
            return false;
        }

        makePayment(card.data);
    });
});
