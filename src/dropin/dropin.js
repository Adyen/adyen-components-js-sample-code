/**
 * IMPORTANT - Set a boolean indicating whether index.html is loading a version of adyen.js (& adyen.css) >= 5.0.0
 */
const head = document.head.innerHTML;
const version = head.substring(head.indexOf('sdk/') + 4, head.indexOf('/adyen'));
const majorVn = Number(version.substring(0, version.indexOf('.')));
const IS_VERSION_5 = majorVn >= 5;

const DEFAULT_COUNTRY = 'US';

// 0. Get clientKey
getClientKey().then(clientKey => {
    const urlParams = getSearchParameters(window.location.search);

    console.log('### dropin:::: urlParams.countryCode', urlParams.countryCode);

    // Can add request params to this object
    const pmReqConfig = {countryCode: urlParams.countryCode || DEFAULT_COUNTRY};
    getPaymentMethods(pmReqConfig).then(async paymentMethodsResponse => {

        paymentMethodsResponse.paymentMethods.reverse();

        // const mountBut = document.getElementById('dropinMount');
        // mountBut.addEventListener('click', async e => {

        let allowedPMS = urlParams.allowedpms;// e.g. &allowedpms=[scheme,ideal]
        if(allowedPMS === '[]' || typeof allowedPMS === 'undefined') allowedPMS = [];

        /**
         * Oldest version of Dropin that will work is 3.0.0 (can pay with card comp). This will require a genuine originKey in the config.
         * (2.5.0 will work, but this is before the official Dropin release, and trying to pay fails 'cos the card data is not put into a paymentMethods object)
         */
        const configObj = {
            environment: 'test',
            clientKey: clientKey, // Mandatory. clientKey from Customer Area
            paymentMethodsResponse,
            // locale: "nl-NL",
            // removePaymentMethods: ['paysafecard', 'c_cash'],
            // allowPaymentMethods: ['scheme', 'ideal'],
            // allowPaymentMethods: allowedPMS,
            onChange: state => {
                updateStateContainer(state); // Demo purposes only
            },
            onSubmit: (state, dropin) => {
                // state.data;
                // state.isValid;
                makePayment(state.data);
            },
            paymentMethodsConfiguration: {
                card: {
                    brands: ['mc', 'visa', 'amex']
                    // billingAddressRequired: true,
                    // data: {
                    //     billingAddress: {
                    //         postalCode: '1234AA',
                    //         country: 'NL'
                    //     }
                    // }
                }
            },
            countryCode: 'NL',
            // setStatusAutomatically: false
        };

        // 1. Create an instance of AdyenCheckout
        if (!IS_VERSION_5) {
            window.checkout = new AdyenCheckout(configObj);
        } else {
            window.checkout = await AdyenCheckout(configObj);
        }

        // 2. Create and mount the Component
        window.dropin = checkout
            .create('dropin', {
                // Events
                onSelect: activeComponent => {
                    if (activeComponent.state && activeComponent.state.data) updateStateContainer(activeComponent.data); // Demo purposes only
                },
                showStoredPaymentMethods: false
            })
            .mount('#dropin-container');

        // const mountBut = document.getElementById('dropinMount');
        // mountBut.addEventListener('click', e => {
            // window.dropin.mount('#dropin-container');

        // });

    });
});
