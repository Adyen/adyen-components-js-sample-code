
/**
 * IMPORTANT - Set a boolean indicating whether index.html is loading a version of adyen.js (& adyen.css) >= 5.0.0
 */
const IS_VERSION_5 = true;

Promise.all([ getClientKey(), getPaymentMethods()]).then(async response => {

    const configObj = {
        environment: 'test',
        locale: "en-US",
        clientKey: response[0],
        paymentMethodsResponse: response[1],
    }

    // console.log('### card::paymentMethodsResponse:: ', response[1]);

    // 1. Create an instance of AdyenCheckout
    if (!IS_VERSION_5) {
        window.checkout = new AdyenCheckout(configObj);
    } else {
        window.checkout = await AdyenCheckout(configObj);
    }

    // 2. Create and mount the Component
    const card = checkout
        .create('card', {
            // Optionally show a Pay Button
            showPayButton: true,

            // Events
            onSubmit: (state, component) => {
                if (state.isValid) {
                    makePayment(card.data);
                }
            },

            onChange: (state, component) => {
                updateStateContainer(state); // Demo purposes only
            }
        })
        .mount('#card-container');
});