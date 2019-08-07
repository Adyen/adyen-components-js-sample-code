// 1. Create an instance of AdyenCheckout
const checkout = new AdyenCheckout({});

// 2. Create and mount the Component
const googlepay = checkout
    .create('paywithgoogle', {
        showPayButton: true,
        environment: 'TEST', // Google Pay environment
        configuration: {
            gatewayMerchantId: 'TestMerchantCheckout', // name of your Adyen Merchant account
            merchantName: 'Adyen Test' // Name to be shown
            // merchantIdentifier: '' // Required in Production environment. Google's merchantId: https://developers.google.com/pay/api/web/guides/test-and-deploy/deploy-production-environment#obtain-your-merchantID
        },

        // Events
        onSubmit: (state, component) => {
            // Submit Payment
            makePayment(state.data);

            updateStateContainer(state); // Demo purposes only
        },
        onError: error => {
            console.error(error);
        }
    })
    // Normally, you should check if Google Pay is available before mounting it.
    // Here we are mounting it directly for demo purposes.
    // Please refer to the documentation for more information on Google Pay's availability.
    .mount('#googlepay-container');
