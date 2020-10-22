// 0. Get clientKey
getClientKey().then(clientKey => {
    // 1. Create an instance of AdyenCheckout
    const checkout = new AdyenCheckout({
        environment: 'test',
        clientKey: clientKey // Mandatory. clientKey from Customer Area
    });

    // 2. Create and mount the Component
    const amazonPayComponent = checkout
        .create('amazonpay', {
            currency: 'GBP',
            environment: 'test',
            merchantId: 'A3SKIS53IXYBBU',
            publicKeyId: 'AG77NIXPURMDUC3DOC5WQPPH',
            storeId: 'amzn1.application-oa2-client.4cedd73b56134e5ea57aaf487bf5c77e',
            returnUrl: `${window.location.href}/?step=review`
        })
        .mount('#amazonpay-container');
});
