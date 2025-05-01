/**
 * IMPORTANT - Set a boolean indicating whether index.html is loading a version of adyen.js (& adyen.css) >= 5.0.0
 */
const head = document.head.innerHTML;
const version = head.substring(head.indexOf('sdk/') + 4, head.indexOf('/adyen'));
const majorVn = Number(version.substring(0, version.indexOf('.')));
const IS_VERSION_4_OR_LESS = majorVn < 5;
const IS_VERSION_5 = majorVn === 5;

// 0. Get clientKey
getClientKey().then(async clientKey => {

    // Optional, provide a translations object for labels and fields
    // const translations = {
    //     "en-GB": {
    //         "ach.bankAccount": "Bank account",
    //         "ach.accountHolderNameField.title": "Account holder name",
    //         "ach.accountHolderNameField.placeholder": "J. Smith",
    //     }
    // };

    const configObj = {
        locale: "en-US",
        environment: 'test',
        countryCode: 'US', // required for v6. Hardcoded in utils.js > paymentsDefaultConfig
        // Optional, provide translations for labels and fields
        // https://docs.adyen.com/online-payments/web-components/localization-components
        // translations: translations,
        clientKey: clientKey, // Mandatory. clientKey from Customer Area
    };

    // 1. Create an instance of AdyenCheckout
    if (IS_VERSION_4_OR_LESS) {
        window.checkout = new AdyenCheckout(configObj);
    } else if (IS_VERSION_5) {
        window.checkout = await AdyenCheckout(configObj);

    }else {
        window.checkout = await window.AdyenWeb.AdyenCheckout(configObj);
    }

    // 2. Create and mount the Component

    const achConfig = {
        // Optional Configuration
        // hasHolderName: false, // Defaults to true

        // Optional. Customize the look and feel of the payment form
        // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
        styles: {},

        // Optionally show a Pay Button
        showPayButton: true,

        // Events - TODO: why is this here and not in checkout config?
        onSubmit: (state, component) => {
            if (state.isValid) {
                // ACH only works in US or PR, with payment in USD
                const additionalConfig = {
                    countryCode: state.data.billingAddress.country,
                    amount: {
                        value: 1000,
                        currency: 'USD'
                    }
                }
                makePayment(ach.data, additionalConfig);
            }
        },

        //  TODO: why is this here and not in checkout config?
        onChange: (state, component) => {
            // state.data;
            // state.isValid;
            updateStateContainer(state); // Demo purposes only
        },

        // Optional: insert address information, if you already have it
        //            data: {
        //                holderName: 'B. Fish',
        //                billingAddress: {
        //                    street: 'Infinite Loop',
        //                        postalCode: '95014',
        //                        city: 'Cupertino',
        //                        houseNumberOrName: '1',
        //                        country: 'US',
        //                        stateOrProvince: 'CA'
        //                }
        //            }
    }

    if (IS_VERSION_5 || IS_VERSION_4_OR_LESS) {
        window.card = checkout
            .create('ach', achConfig)
            .mount('#ach-container');
    }else{
        window.card = new window.AdyenWeb.Ach(window.checkout, achConfig).mount('#ach-container');
    }

});