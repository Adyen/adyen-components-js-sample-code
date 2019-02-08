getPaymentMethods().then(response => {
    // 0. Find iDEAL data in the /paymentMethods response
    const idealData = response.paymentMethods.find(pm => pm.type === 'ideal');

    // 1. Create an instance of AdyenCheckout
    const checkout = new AdyenCheckout();

    // 2. Create and mount the Component
    const ideal = checkout
        .create('ideal', {
            details: idealData.details,
            onChange: (state, component) => {
                // state.data;
                // state.isValid;

                updateStateContainer(state); // Demo purposes only
            }
        })
        .mount('#ideal-container');

    // Submit Payment
    const payButton = document.querySelector('button');
    payButton.addEventListener('click', e => {
        if (!ideal.isValid()) {
            ideal.showValidation();
            return false;
        }

        makePayment(ideal.paymentData);
    });
});
