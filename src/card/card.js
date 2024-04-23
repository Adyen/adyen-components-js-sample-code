
/**
 * Handling redirect results
 */
function handleRedirectResult() {
    const { redirectResult } = getSearchParameters(window.location.search);

    console.log('### card::handleRedirectResult:: redirectResult', redirectResult);

    if (redirectResult) {
        // Makes call to /payments/details
        return handleAdditionalDetails({
            data: {
                details: {
                    redirectResult
                }
            }
        })
    }

    return false;
}

handleRedirectResult();

/**
 * IMPORTANT - Set a boolean indicating whether index.html is loading a version of adyen.js (& adyen.css) >= 5.0.0
 */
const head = document.head.innerHTML;
const version = head.substring(head.indexOf('sdk/') + 4, head.indexOf('/adyen'));
const majorVn = Number(version.substring(0, version.indexOf('.')));
const IS_VERSION_5 = majorVn >= 5;

// 0. Get clientKey
Promise.all([ getClientKey(), getPaymentMethods()]).then(async response => {

    // Optional, define custom placeholders for the Card fields
    // https://docs.adyen.com/online-payments/web-components/localization-components
    // const translations = {
    //     "en-GB": {
    //         "creditCard.numberField.placeholder": "1234 5678 9012 3456",
    //         "creditCard.expiryDateField.placeholder": "MM/YY",
    //     }
    // };

    const configObj = {
        environment: 'test',
        locale: "en-GB",
        // translations: translations,
        clientKey: response[0],
        paymentMethodsResponse: response[1],
        // Events
        onSubmit: (state, component) => {
            if (state.isValid) {

                const config = {
                    additionalData: {allow3DS2: true}, // allows regular, "in app", 3DS2
                }

                const cardData = {...card.data}

                makePayment(cardData, config).then(response => {
                    if (response.action) {
                        component.handleAction(response.action);
                        // checkout.createFromAction(response.action, { challengeWindowSize: '01' }).mount('#card-container')
                        console.log('### handlers::handleResponse::response.action=', response.action);
                    }
                });
            }
        },

        onChange: (state, component) => {
            // state.data;
            // state.isValid;

            updateStateContainer(state); // Demo purposes only
        },
        onAdditionalDetails: (details) => {
            console.log('### card::onAdditionalDetails:: calling' );
            handleAdditionalDetails(details).then(response => {
                console.log('### card::onAdditionalDetails:: response', response);
            });
        },

        onError: (e)=>{
            console.log('### Checkout config onError:: e=', e);
        }
    }

    // 1. Create an instance of AdyenCheckout
    if (!IS_VERSION_5) {
        window.checkout = new AdyenCheckout(configObj);
    } else {
        window.checkout = await AdyenCheckout(configObj);
    }

    // 2. Create and mount the Component
    window.card = checkout
        .create('card', {
            // Optional Configuration
            // hasHolderName: true,
            // holderNameRequired: true,

            // Optional. Customize the look and feel of the payment form
            // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
            styles: {},

            // Optionally show a Pay Button
            showPayButton: true,
            enableStoreDetails: true,

            _disableClickToPay: true,

            onBinLookup: (obj)=>{
                console.log('### Card config::onBinLookup:: obj=', obj);
            },
            onFocus: (obj) => {
                console.log('### Cards::onFocus:: obj',obj);
            },
            onBlur: (obj) => {
                console.log('### Cards::onBlur:: obj',obj);
            }
        })
        .mount('#card-container');
});