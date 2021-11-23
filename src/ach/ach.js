// 0. Get clientKey
getClientKey().then(clientKey => {

    async function initiateComponent() {
        // 1. Create an instance of AdyenCheckout
        const checkout = await AdyenCheckout({
            environment: 'test',
            clientKey: clientKey // Mandatory. clientKey from Customer Area
        });

        // 2. Create and mount the Component
        const ach = checkout
            .create('ach', {
                // Optional Configuration
                // hasHolderName: false, // Defaults to true

                // Optional. Customize the look and feel of the payment form
                // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
                styles: {
                    validated: {
                        color: 'red'
                      } 
                },

                // Optional. Define custom placeholders for the Ach fields
                // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
                placeholders: {
                    // encryptedBankAccountNumber: '9999 9999 9999 9999',
                    // encryptedBankLocationId: '987654321',
                },

                // Optionally show a Pay Button
                showPayButton: true,

                // Events
                onSubmit: (state, component) => {
                    if (state.isValid) {
                        // ACH only works in US or PR, with payment in USD
                        const additionalConfig = {
                            countryCode: state.data.billingAddress.country,
                            amount: {
                                value: 1000,
                                currency: 'USD'
                            }
                        }
                        makePayment(ach.data, additionalConfig);
                    }
                },

                onChange: (state, component) => {
                    // state.data;
                    // state.isValid;
                    updateStateContainer(state); // Demo purposes only
                },

                // Optional: insert address information, if you already have it
                //            data: {
                //                holderName: 'B. Fish',
                //                billingAddress: {
                //                    street: 'Infinite Loop',
                //                        postalCode: '95014',
                //                        city: 'Cupertino',
                //                        houseNumberOrName: '1',
                //                        country: 'US',
                //                        stateOrProvince: 'CA'
                //                }
                //            }
            })
            .mount('#ach-container');
    }
    initiateComponent()
});