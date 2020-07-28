// 0. Get origin key
getOriginKey().then(originKey => {
    // 1. Create an instance of AdyenCheckout providing an originKey
    const checkout = new AdyenCheckout({
        originKey: originKey,
        environment: 'test',
        amount: { currency: 'EUR', value: 1000 },
        onAdditionalDetails: result => {
            console.log(result);
        },
        onError: error => {
            console.log(error);
        }
    });

    // 2. Create and mount component.
    checkout.create(
        'bcmc',
        {
            hasHolderName: true,
            holderNameRequired: true
        }
    ).mount('#bcmc-container');
});