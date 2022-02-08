import {setFocus, onBrand, onConfigSuccess, onBinLookup, setCCErrors, onChange, onChangeV4} from './customCards.config.js';

// 0. Get clientKey
getClientKey().then(async clientKey => {

    // 1. Create an instance of AdyenCheckout
    //    window.checkout = await AdyenCheckout({ // for version >= 5.0.0
    window.checkout = new AdyenCheckout({ // for version < 5.0.0
        clientKey   : clientKey,
        environment : 'test',
        locale      : "en-GB",
    });


    window.securedFields = checkout
        .create('securedfields', {
            type    : 'card',
            brands  : ['mc', 'visa', 'amex', 'bcmc', 'maestro', 'cartebancaire'],
            onConfigSuccess,
            onBrand,
            onFocus : setFocus,
            onBinLookup,

            /**
             * For version < 5.0.0
             */
            onError : setCCErrors,

            onChange : (state, component) => {
                // state.data;
                // state.isValid;

                updateStateContainer(state); // Demo purposes only

                /**
                 * For version >= 5.0.0
                 */
                // onChange(state, component)

                /**
                 * For version < 5.0.0
                 */
                onChangeV4(state, component)
            }
        })
        .mount('#card-container');

    createPayButton('#card-container', window.securedFields, 'securedfields');

    function createPayButton(parent, component, attribute) {
        const payBtn = document.createElement('button');

        payBtn.textContent = 'Pay';
        payBtn.name = 'pay';
        payBtn.classList.add('adyen-checkout__button', 'js-components-button--one-click', `js-${attribute}`);

        payBtn.addEventListener('click', e => {
            e.preventDefault();

            if (!component.isValid) {
                return component.showValidation();
            }

            // formatData
            const paymentMethod = {
                type : 'scheme',
                ...component.state.data
            };
            component.state.data = {paymentMethod};

            makePayment(component.state.data);

            payBtn.style.opacity = '0.5';
        });

        document.querySelector(parent).appendChild(payBtn);

        return payBtn;
    }
});

