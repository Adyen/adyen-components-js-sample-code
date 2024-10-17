
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
const IS_VERSION_4_OR_LESS = majorVn < 5;
const IS_VERSION_5 = majorVn === 5;
// const IS_VERSION_6 = majorVn >= 5;

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


    /**
     * NOTE: earliest version I can get working is 2.1.0 (but prior to 3.1.0 components had no option to show a pay button - so I don't know if I can pay)
     * 3.1.0 works & I can pay
     */
    const configObj = {
        environment: 'test',
        locale: "en-US",
        countryCode: 'NL', // required for v6. Hardcoded in utils.js > paymentsDefaultConfig
        // translations: translations,
        clientKey: response[0],
        paymentMethodsResponse: response[1],
        // Events
        onSubmit: (state, component) => {
            if (state.isValid) {

                // const config = {};
                // const config = {
                //     additionalData: {allow3DS2: true}, // allows regular, "in app", 3DS2
                //     origin:"http://localhost:3000" // forces v4.3.1 to use the native 3DS Comp (and avoid a "redirect" response)
                // }
                const config = {additionalData: {executeThreeD: true}} // forces 3DS2 into MDFlow redirect

                const cardData = {...card.data}
                // cardData.browserInfo.screenWidth = 437663051;
                // cardData.browserInfo.screenHeight = 1168348283;

                console.log('### card::onSubmit::cardData ', cardData);

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
        },
        // srConfig: {
        //     moveFocus: false,
        //     showPanel: true,
        //     node: '#card-container' // Add SRPanel to another element than the default
        // },
        // paymentMethodsConfiguration:{
        //     card:{
        //         challengeWindowSize: '05'
        //     }
        // }
        // translations: {
        //     'en-GB': {
        //         'creditCard.encryptedCardNumber.aria.iframeTitle': 'pan iframe',
        //         'creditCard.encryptedCardNumber.aria.label': 'number label',
        //         "creditCard.holderName.placeholder": "Bill Bob",
        //         'creditCard.numberField.placeholder': 'enter pan',
        //         'creditCard.expiryDateField.placeholder': 'month & year'
        //     }
        // }
        /**
         * Needed to make adyen.js vn <= 3.10.0 work
         * For anything < 3.9.0 it has to be a genuine originKey (published for TestCompany against localhost:4000)
         */
        // originKey: 'pub.v2.8115658705713940.aHR0cDovL2xvY2FsaG9zdDozMDAw.cpyWd9ZhlTyrKVQRp34kMJZjIFMcPvP3B5UhgAdhDjc',
        // originKey: 'pub.v2.8115658705713940.aHR0cDovL2xvY2FsaG9zdDo0MDAw.SQOrkUNaVKPn2XtL7OPDEqhY8u7qWQGJo76CrK33cAg',// localhost:4000
        /**
         * Needed to make adyen.js vn <= 2.4.0 work
         */
        // loadingContext: 'https://checkoutshopper-test.adyen.com/checkoutshopper/'
        // useOriginalFlow: true
    }

    console.log('### card::paymentMethodsResponse:: ', response[1]);

    const isUMD = Array.from(document.scripts).reduce((acc, script) => {
        if(!acc && script.src.includes('adyen.js')){
            acc = true;
        }
        return acc
    }, false);
    console.log('### card:::: isUMD=', isUMD);

    // 1. Create an instance of AdyenCheckout
    if (IS_VERSION_4_OR_LESS) {
        window.checkout = new AdyenCheckout(configObj);
    } else if (IS_VERSION_5) {
        window.checkout = await AdyenCheckout(configObj);

        // requirejs(["https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/5.28.0/adyen.js"], function(adyenCheckout) {
        //     adyenCheckout(configObj).then((checkout)=> {
        //         window.checkout = checkout;
        //         console.log('### card:::: checkout', checkout);
        //         // window.dropin = checkout.create('dropin', {...
        //     });
        // });
    }else {
        window.checkout = await window.AdyenWeb.AdyenCheckout(configObj);
    }

    // if (checkout.paymentMethodsResponse.storedPaymentMethods && checkout.paymentMethodsResponse.storedPaymentMethods.length > 0) {
    //     const storedCardData = checkout.paymentMethodsResponse.storedPaymentMethods[0];
    //     console.log('### Cards:::: storedCardData', storedCardData);
    //     window.storedCard = checkout.create('card', storedCardData).mount('#card-container');
    // }
    // return;

    // Array.from(document.scripts).forEach((script) => {
    //     if(script.src.includes('adyen.js')){
    //         console.log('### card:::: UMD MF!', );
    //     }
    // })

    const cardConfig = {
        // Optional Configuration
        // hasHolderName: true,
        // holderNameRequired: true,

        // Optional. Customize the look and feel of the payment form
        // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
        styles: {},

        // brands:['mc', 'bcmc'],
        brands:['mc', 'visa', 'cup', 'jcp', 'amex'],
        // brands: ['mc', 'visa', 'amex', 'maestro', 'cup', 'diners', 'discover', 'jcb', 'bijcard'],

        // Optionally show a Pay Button
        showPayButton: true,
        enableStoreDetails: true,

        _disableClickToPay: true,

        placeholders: {
            holderName: 'ph billy bob',
            encryptedCardNumber: 'ph enter PAN'
        },

        styles: {
            base: {
                // Setting font
                fontFamily: 'https://fonts.gstatic.com/s/montserrat/v26/JTUQjIg1_i6t8kCHKm459WxRyS7m0dR9pA.woff2'
            }
        },

        // challengeWindowSize: '01',

        // billingAddressRequired: true,


        // onError: (e)=>{
        //     console.log('### Card config::onError:: e=', e);
        // },
        onBinLookup: (obj)=>{
            console.log('### Card config::onBinLookup:: obj=', obj);
        },
        onFocus: (obj) => {
            console.log('### Cards::onFocus:: obj',obj);
        },
        onBlur: (obj) => {
            console.log('### Cards::onBlur:: obj',obj);
        },
        // configuration: {
        //     socialSecurityNumberMode: 'show'
        // }
        // installmentOptions: {
        //     mc: {
        //         values: [1, 2],
        //         preselectedValue: 2
        //     },
        //     visa: {
        //         values: [1, 2, 3, 4],
        //         plans: ['regular', 'revolving'],
        //         preselectedValue: 4
        //     }
        // },
        setStatusAutomatically: false
    }

    // 2. Create and mount the Component
    if (IS_VERSION_5 || IS_VERSION_4_OR_LESS) {
        window.card = checkout
            .create('card', cardConfig)
            .mount('#card-container');
    }else{
        window.card = new window.AdyenWeb.Card(window.checkout, cardConfig).mount('#card-container');
    }
});