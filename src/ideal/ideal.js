getPaymentMethods().then(response => {

    async function initiateComponent() {
        // 1. Create an instance of AdyenCheckout
        const checkout = await AdyenCheckout({
            paymentMethodsResponse: response,

            // Optionally show a Pay Button
            showPayButton: true,

            // Events
            onSubmit: (state, component) => {
                // Triggered when a shopper clicks on the Pay button
                makePayment(state.data);
            },
            onChange: (state, component) => {
                updateStateContainer(state); // Demo purposes only
            }
        });

        // 2. Create and mount the Component
        const ideal = checkout.create('ideal').mount('#ideal-container');
    }
    initiateComponent()

});