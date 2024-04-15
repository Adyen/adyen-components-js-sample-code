/**
 * IMPORTANT - Set a boolean indicating whether index.html is loading a version of adyen.js (& adyen.css) >= 5.0.0
 */
const head = document.head.innerHTML;
const version = head.substring(head.indexOf('sdk/') + 4, head.indexOf('/adyen'));
const majorVn = Number(version.substring(0, version.indexOf('.')));
const IS_VERSION_5 = majorVn >= 5;

// 0. Get client key
getClientKey().then(async clientKey => {

    // 1. Create an instance of AdyenCheckout providing the clientKey
    const configObj = {
        clientKey: clientKey,
        environment: 'test',
        amount: {
            currency: 'EUR',
            value: 1000
        },
        showPayButton: true,
        onSubmit: (state, component) => {
            makePayment(state.data);
        }
    }

    if (!IS_VERSION_5) {
        window.checkout = new AdyenCheckout(configObj);
    } else {
        window.checkout = await AdyenCheckout(configObj);
    }

    // 2. Create and mount component.
    checkout.create('bcmc').mount('#bcmc-container');
});