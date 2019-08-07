// 0. Get originKey
getOriginKey().then(originKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
        // 1. Create an instance of AdyenCheckout
        const checkout = new AdyenCheckout({
            environment: 'test',
            originKey: originKey, // Mandatory. originKey from Costumer Area
            paymentMethodsResponse,
            removePaymentMethods: ['paysafecard', 'c_cash']
        });

        // 2. Create and mount the Component
        const dropin = checkout
            .create('dropin', {
                // Events
                onSelect: activeComponent => {
                    updateStateContainer(activeComponent.data); // Demo purposes only
                },
                onChange: state => {
                    updateStateContainer(state); // Demo purposes only
                },
                onSubmit: (state, component) => {
                    // state.data;
                    // state.isValid;
                    makePayment(state.data);
                }
            })
            .mount('#dropin-container');
    });
});
