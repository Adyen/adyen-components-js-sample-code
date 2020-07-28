// 0. Get origin key
getOriginKey().then(originKey => {
    // 1. Create an instance of AdyenCheckout providing an originKey
    const checkout = new AdyenCheckout({
        originKey: originKey,
        environment: 'test',
        amount: { currency: 'EUR', value: 1000 },
        showPayButton: true,
        onSubmit: (state, component) => {
            makePayment(state.data);
        }
    });

    // 2. Create and mount component.
    checkout.create('bcmc').mount('#bcmc-container');
});
