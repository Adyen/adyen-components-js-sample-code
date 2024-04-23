import {setFocus, onBrand, onConfigSuccess, onBinLookup, setCCErrors, onChange, onChangeV5} from './customCards.config.js';

/**
 * IMPORTANT - Set a boolean indicating whether index.html is loading a version of adyen.js (& adyen.css) >= 5.0.0
 */
const head = document.head.innerHTML;
const version = head.substring(head.indexOf('sdk/') + 4, head.indexOf('/adyen'));
const majorVn = Number(version.substring(0, version.indexOf('.')));
const IS_VERSION_5 = majorVn >= 5;

const mockPaymentMethodsResponse = {
    paymentMethods: [
        {
            brands: ['mc', 'visa', 'amex', 'maestro', 'cup', 'diners', 'discover', 'jcb', 'bijcard'],
            name: 'Credit Card',
            type: 'scheme'
        }
    ]
}

// 0. Get clientKey
getClientKey().then(async clientKey => {

    const configObj = {
        clientKey   : clientKey,
        environment : 'test',
        locale      : 'en-US',
        paymentMethodsResponse: mockPaymentMethodsResponse,
        translations: {
            'en-US': {
               'creditCard.encryptedCardNumber.aria.label': 'number label',
                'error.va.gen.01': 'fill out the field',
                'error.va.sf-cc-yr.01': 'year is wrong',
                'error.va.sf-cc-yr.02': 'year is wrong too',
                'error.va.sf-cc-dat.01': 'card is very old'
            }
        }
    }

    // 1. Create an instance of AdyenCheckout
    if (!IS_VERSION_5) {
        window.checkout = new AdyenCheckout(configObj);
    } else {
        window.checkout = await AdyenCheckout(configObj);
    }

    console.log('### customCard::checkout:: ',checkout );

    window.securedFields = checkout
        .create('securedfields', {
            type: 'card',
            brands  : ['mc', 'visa', 'maestro'],
            onConfigSuccess,
            onBrand,
            onFocus : setFocus,
            onBinLookup,

            ...(!IS_VERSION_5 && {onError : setCCErrors}), // For version < 5.0.0

            onChange : (state, component) => {
                /**
                 * For version < 5.0.0
                 */
                if (!IS_VERSION_5) {
                    onChange(state, component);

                    updateStateContainer(state);// Demo purposes only
                    return;
                }

                /**
                 * For version >= 5.0.0
                 */
                onChangeV5(state, component);

                // In v5, we enhance the securedFields state.errors object with a rootNode prop
                // but calling updateStateContainer with the ref to this rootNode element will cause a "Converting circular structure to JSON" error
                // so replace any rootNode values in the objects in state.errors with an empty string
                if (!!Object.keys(state.errors).length) {
                    const nuErrors = Object.entries(state.errors).reduce((acc, [fieldType, error]) => {
                        acc[fieldType] = error ? {...error, rootNode : ''} : error;
                        return acc;
                    }, {});
                    state.errors = nuErrors;
                }

                updateStateContainer(state);// Demo purposes only
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

            makePayment(component.formatData());

            payBtn.style.opacity = '0.5';
        });

        document.querySelector(parent).appendChild(payBtn);

        return payBtn;
    }
});

