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

    // Can add request params to this object
    const pmReqConfig = {countryCode: urlParams.countryCode || DEFAULT_COUNTRY};
    getPaymentMethods(pmReqConfig).then(async paymentMethodsResponse => {

        paymentMethodsResponse.paymentMethods.reverse();

        let allowedPMS = urlParams.allowedpms;// e.g. &allowedpms=[scheme,ideal]
        if(allowedPMS === '[]' || typeof allowedPMS === 'undefined') allowedPMS = [];// if empty, all PMs will show

        const configObj = {
            environment: 'test',
            clientKey: clientKey, // Mandatory. clientKey from Customer Area
            paymentMethodsResponse,
            // removePaymentMethods: ['paysafecard', 'c_cash'],
            allowPaymentMethods: allowedPMS,
            onChange: state => {
                updateStateContainer(state); // Demo purposes only
            },
            onSubmit: (state, dropin) => {
                // state.data;
                // state.isValid;
                makePayment(state.data);
            }
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

    });
});
