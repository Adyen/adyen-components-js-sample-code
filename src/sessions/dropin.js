getClientKey().then(clientKey => {
    sessions()
        .then(response => {
            console.log(response)
            const configuration = {
                environment: 'test', // Change to 'live' for the live environment.
                clientKey: clientKey, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
                session: {
                    id: response.id, // Unique identifier for the payment session.
                    sessionData: response.sessionData // The payment session data.
                },
                onPaymentCompleted: (result, component) => {
                    console.info(result, component);
                },
                onError: (error, component) => {
                    console.error(error.name, error.message, error.stack, component);
                },
                // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
                // For example, this is 3D Secure configuration for cards:
                paymentMethodsConfiguration: {
                    card: {
                        // Optional configuration
                        hasHolderName: true,
                        holderNameRequired: true,
                        billingAddressRequired: true
                    }
                }
            };
            async function initiateCheckout() {
                // Create an instance of AdyenCheckout using the configuration object.
                const checkout = await AdyenCheckout(configuration);

                // Create an instance of Drop-in and mount it to the container you created.
                const dropinComponent = checkout.create('dropin').mount('#dropin-container');
            }
            initiateCheckout()
        })
})