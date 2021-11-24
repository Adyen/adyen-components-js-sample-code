// 0. Get clientKey
getClientKey().then(clientKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
        async function initiateComponent() {
            // 1. Create an instance of AdyenCheckout
            const checkout = await AdyenCheckout({
                clientKey: clientKey, // Mandatory. clientKey from Customer Area
                environment: 'test',
                amount: {
                    currency: 'EUR',
                    value: 1000
                },
                onAdditionalDetails: result => {
                    console.log(result);
                },
                onError: error => {
                    console.log(error);
                },
                onSubmit: initialSubmit,
                paymentMethodsResponse
            });

            function initialSubmit(state, component) {
                makePayment(state.data).then(response => {
                    component.unmount();
                    // 3. present the voucher using the action object returned from /payments
                    checkout.createFromAction(response.action).mount('#multibanco-container');
                });
            }

            // 2. create Multibanco component
            checkout.create('multibanco').mount('#multibanco-container');
        }
        initiateComponent()

    });
});