//getPaymentMethods().then(paymentMethodsResponse => {
//    console.log('### card::paymentMethodsResponse:: ', paymentMethodsResponse);
//});

// Optional, define custom aria attributes & placeholders for the Card fields
// https://docs.adyen.com/online-payments/web-components/localization-components
const translations = {
    "en-US": {
        'creditCard.encryptedCardNumber.aria.iframeTitle': 'number iframe title',
        'creditCard.encryptedCardNumber.aria.label': 'number label',
        'creditCard.encryptedExpiryDate.aria.iframeTitle': 'date iframe title',
        'creditCard.encryptedExpiryDate.aria.label': 'date label',
        'creditCard.encryptedSecurityCode.aria.iframeTitle': 'cvc iframe title',
        'creditCard.encryptedSecurityCode.aria.label': 'cvc label',
        'creditCard.numberField.placeholder': 'card number',
        'creditCard.expiryDateField.placeholder': 'mm/yy',
    }
};

/**
 * IMPORTANT - Set a boolean indicating whether index.html is loading a version of adyen.js (& adyen.css) >= 5.0.0
 */
const IS_VERSION_5 = true;

// 0. Get clientKey
//getClientKey().then(async clientKey => {
Promise.all([ getClientKey(), getPaymentMethods()]).then(async response => {

    const configObj = {
        environment: 'test',
        locale: "en-GB",
        // translations: translations,
//        clientKey: clientKey // Mandatory. clientKey from Customer Area
        clientKey: response[0],
        paymentMethodsResponse: response[1],
//        amount: {
//            currency: 'US',
//            value: 3
//        }
    }

    console.log('### card::paymentMethodsResponse:: ', response[1]);

    // 1. Create an instance of AdyenCheckout
    if (!IS_VERSION_5) {
        window.checkout = new AdyenCheckout(configObj);
    } else {
        window.checkout = await AdyenCheckout(configObj);
    }

    // 2. Create and mount the Component
    const card = checkout
        .create('card', {
            // Optional Configuration
            // hasHolderName: true,
            // holderNameRequired: true,

            // Optional. Customize the look and feel of the payment form
            // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
            styles: {},


//            brands:['mc', 'visa', 'amex', 'cartebancaire'],
//            brands: ['mc', 'visa', 'amex', 'maestro', 'cup', 'diners', 'discover', 'jcb', 'bijcard'],

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