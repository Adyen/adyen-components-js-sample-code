// 0. Get origin key
getClientKey().then(clientKey => {

    async function initiateComponent() {
        // 1. Create an instance of AdyenCheckout providing the clientKey
        const checkout = await AdyenCheckout({
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
        });

        // 2. Create and mount component.
        checkout.create('bcmc').mount('#bcmc-container');
    }
    initiateComponent()
});