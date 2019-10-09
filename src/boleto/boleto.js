// 1. Create an instance of AdyenCheckout
const checkout = new AdyenCheckout({
    environment: 'test',
    showPayButton: true,
    onSubmit: (state, component) => {
        makePayment(state.data);
    },
    onChange: (state, component) => {
        // state.data;
        // state.isValid;

        updateStateContainer(state); // Demo purposes only
    }
});

// 2. Create and mount the Component
const boleto = checkout.create('boletobancario').mount('#boletobancario-container');

// This is a mock of the /payments response action property
const actionMock = {
    downloadUrl: 'https://...',
    expiresAt: '2019-09-11T00:00:00',
    initialAmount: {
        currency: 'BRL',
        value: 1000
    },
    paymentMethodType: 'boletobancario',
    reference: '12345.12345 12345.123456 12345.123456 1 12345678901',
    totalAmount: {
        currency: 'BRL',
        value: 1000
    },
    type: 'voucher'
};

// 3. Get the action property from the /payments response and use it to render the voucher
const boletoVoucher = checkout.createFromAction(actionMock).mount('#boletobancario-result-container');
