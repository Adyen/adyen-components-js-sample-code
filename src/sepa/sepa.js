// 1. Create an instance of AdyenCheckout
const checkout = new AdyenCheckout({
    // locale: 'es_ES'
});

// 2. Create and mount the Component
const sepa = checkout
    .create('sepadirectdebit', {
        countryCode: 'NL', // Optional. Sets the default country of the IBAN Placeholder
        placeholders: {
            // Optional. Overwriting the default placeholders
            // ownerName: '',
            // ibanNumber: ''
        },

        // Events
        onChange: (state, component) => {
            // state.data;
            // state.isValid;

            updateStateContainer(state); // Demo purposes only
        }
    })
    .mount('#sepa-container');

// 3. Submit Payment
const payButton = document.querySelector('button');
payButton.addEventListener('click', e => {
    if (!sepa.isValid()) {
        sepa.showValidation(); // Show validation on all non-valid fields
        return false;
    }

    makePayment(sepa.paymentData);
});
