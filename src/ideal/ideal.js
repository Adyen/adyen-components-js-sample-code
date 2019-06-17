getPaymentMethods().then(response => {
    // 1. Create an instance of AdyenCheckout
    const checkout = new AdyenCheckout({
        paymentMethodsResponse: response,
        onChange: (state, component) => {
            updateStateContainer(state); // Demo purposes only
        }
    });

    // 2. Create and mount the Component
    const ideal = checkout.create('ideal').mount('#ideal-container');

    // 3. Submit Payment
    const payButton = document.querySelector('button');
    payButton.addEventListener('click', e => {
        if (!ideal.isValid) {
            ideal.showValidation();
            return false;
        }

        makePayment(ideal.data);
    });
});
