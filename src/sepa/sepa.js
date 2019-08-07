// 1. Create an instance of AdyenCheckout
const checkout = new AdyenCheckout({
    environment: 'test',
    onChange: (state, component) => {
        // state.data;
        // state.isValid;

        updateStateContainer(state); // Demo purposes only
    }
});

// 2. Create and mount the Component
const sepa = checkout
    .create('sepadirectdebit', {
        showPayButton: true,
        countryCode: 'NL', // Optional. Sets the default country of the IBAN Placeholder
        placeholders: {
            // Optional. Overwriting the default placeholders
            // ownerName: '',
            // ibanNumber: ''
        },

        // Events
        onSubmit: (state, component) => {
            makePayment(state.data);
        }
    })
    .mount('#sepa-container');
