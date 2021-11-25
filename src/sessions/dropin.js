getClientKey().then(clientKey => {

    // Check URL for redirectResult and sessionId
    const queryResultString = window.location.search;
    const urlParams = new URLSearchParams(queryResultString)
    const redirectResult = urlParams.get('redirectResult')
    const sessionId = urlParams.get('sessionId')

    function initiateSession() {
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
                            holderNameRequired: true
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
    }

    async function handleRedirect() {
        const configuration = {
            environment: 'test', // Change to 'live' for the live environment.
            clientKey: clientKey, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
            session: {
                id: sessionId, // Retreived identifier for the payment completion on redirect.
            },
            onPaymentCompleted: (result, component) => {
                console.info(result)
                const paymentResult = result.resultCode
                if (paymentResult === 'Authorised' || paymentResult === 'Received') {
                    document.getElementById('result-container').innerHTML = '<img alt="Success" src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/components/success.svg">';
                    
                } else {
                    document.getElementById('result-container').innerHTML = '<img alt="Error" src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/components/error.svg">' 
                }
            },
            onError: (error, component) => {
                console.error(error.name, error.message, error.stack, component);
            },
        };
        // Create an instance of AdyenCheckout to handle the shopper returning to your website.
        // Configure the instance with the sessionId you extracted from the returnUrl.
        const checkout = await AdyenCheckout(configuration);
        // Submit the redirectResult value you extracted from the returnUrl.
        checkout.submitDetails({ details: { redirectResult } });
    }

    // If no paramters are present in the URL, mount the Drop-in
    if (!redirectResult && !sessionId) {
        console.log('Starting new session')
        initiateSession()
    // Otherwise, handle the redirect
    } else {
        console.log('Handling redirect')
        handleRedirect()
    }
})