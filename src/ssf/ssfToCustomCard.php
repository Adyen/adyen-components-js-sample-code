<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Adyen Checkout Demo - CSF Only</title>
    <link rel="stylesheet" href="https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/5.33.0/adyen.css">
    <style>
        .payment-div{
            position: relative;
            font-family: "Open Sans", sans-serif;
            font-size: 14px;
            margin: 30px auto;
            width: 460px;
        }
        .pm-details{
            display: block;
            box-sizing: border-box;
            float: left;
            padding: 0px 20px 20px 20px;
            width: 100%;
        }
        .pm-form{
            float: left;
            position: relative;
            width: 100%;
            max-width: 420px;
        }
        .pm-image{
            background-color: #ffffff;
            border-radius: 4px;
            -moz-border-radius: 4px;
            -webkit-border-radius: 4px;
            float: right;
            line-height: 0;
            position: relative;
            overflow: hidden;
            width: 40px;
            height: 26px;
        }
        .pm-form-label{
            float: left;
            padding-bottom: 1em;
            position: relative;
            width: 100%;
        }
        .pm-form-label--exp-date{
            width: 40%;
        }
        .pm-form-label--cvc{
            float: right;
            width: 40%;
        }
        .pm-form-label__text{
            color: #00112c;
            float: left;
            font-size: 0.93333em;
            padding-bottom: 6px;
            position: relative;
        }
        .pm-input-field{
            background: white;
            border: 1px solid #d8d8d8;
            -moz-border-radius: 4px;
            -webkit-border-radius: 4px;
            border-radius: 4px;
            box-sizing: border-box;
            clear: left;
            font-size: 0.93333333333em;
            float: left;
            padding: 8px;
            position: relative;
            width: 100%;
            height: 35px;
        }
        .pm-input-field--error{
            border: 1px solid #ff7d00;
        }
        .pm-input-field--focus {
            border: 1px solid #969696;
        }
        .pm-input-field--error.pm-input-field--focus{
            border: 1px solid #ff7d00;
        }
        .pm-form-label__error-text{
            color: #ff7d00;
            display: none;
            float: left;
            font-size: 13px;
            padding-top: .4em;
            position: relative;
            width: 100%;
        }
        .pm-button--submit{
            background-color: #30c94a;
            border: 0;
            width:420px;
            margin-left: 20px;
            pointer-events:none;
            opacity:0.3;
            -moz-border-radius: 2px;
            -webkit-border-radius: 2px;
            border-radius: 2px;
            color: white;
            font-size: 1em;
            font-weight: 500;
            padding: 20px 0;
            position: absolute;
            top: 200px;
            left: 0;
        }
        .pm-button--submit:hover{
            background-color: #00914b;
            cursor: auto;
        }
    </style>

</head>
<body>
<script src="https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/5.33.0/adyen.js"></script>
<a href="../">Back</a>
<div id="adyenPaymentDiv" class="payment-div">
    <div id="pmForm" class="js-chckt-pm__pm-holder">
        <input type="hidden" name="txvariant" value="card"/>
        <div class="pm-details">
            <div class="pm-form">
                <span class="pm-image">
                    <img id="pmImage" width="40" src="https://checkoutshopper-test.adyen.com/checkoutshopper/images/logos/nocard.svg" alt="">
                </span>
                <label class="pm-form-label">
                    <span class="pm-form-label__text">Card number:</span>
                    <span class="pm-input-field" data-hosted-id="hostedCardNumberField" data-cse="encryptedCardNumber"></span>
                    <span class="pm-form-label__error-text">Please enter a valid credit card number</span>
                </label>
               <label class="pm-form-label pm-form-label--exp-date">
                    <span class="pm-form-label__text">Expiry date:</span>
                    <span class="pm-input-field" data-hosted-id="hostedExpiryDateField" data-cse="encryptedExpiryDate"></span>
                    <span class="pm-form-label__error-text">Date error text</span>
                </label>
                <!--<label class="pm-form-label exp-month">
                    <span class="pm-form-label__text">Expiry month:</span>
                    <span class="pm-input-field" data-hosted-id="hostedExpiryMonthField" data-cse="encryptedExpiryMonth"></span>
                    <span class="pm-form-label__error-text">Date error text</span>
                </label>
                <label class="pm-form-label exp-year">
                    <span class="pm-form-label__text">Expiry year:</span>
                    <span class="pm-input-field" data-hosted-id="hostedExpiryYearField" data-cse="encryptedExpiryYear"></span>
                    <span class="pm-form-label__error-text">Date error text</span>
                </label>-->
                <label class="pm-form-label pm-form-label--cvc">
                    <span class="pm-form-label__text">CVV/CVC:</span>
                    <span class="pm-input-field" data-hosted-id="hostedSecurityCodeField" data-cse="encryptedSecurityCode"></span>
                    <span class="pm-form-label__error-text">CVC Error text</span>
                </label>
            </div>
        </div>
    </div>
    <button id="payBtn" type="button" class="pm-button--submit" disabled onclick="window.submitPayment(window.securedFields);">Submit</button>
</div>
<script type="text/javascript">

    const initCheckout = async function(){

        const paymentMethodsConfig = {
            // Mandatory params:
            // - merchantAccount
            // Optional params:
            shopperReference: 'SSF to CustomCard sample code test', // Needed in order to retrieve stored PMs
        };

        const paymentsDefaultConfig = {
            // Mandatory params:
            // - amount
            // - reference
            // - merchantAccount
            // - paymentMethod
            // Optional params:
            channel: 'Web'
        };

        // Generic POST Helper
        const httpPost = (endpoint, data) =>
//             fetch(`./${endpoint}.php`, {
            fetch(`/${endpoint}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json());

        // Get all available payment methods from the local server
        const getPaymentMethods = () =>
            httpPost('paymentMethods', paymentMethodsConfig)
                .then(response => {
                    if (response.error) throw 'No paymentMethods available';

                    return response;
                })
                .catch(console.error);

        const paymentMethodsResponse = getPaymentMethods();

        //-------- INIT CHECKOUT -------------------
        const configObj = {
            clientKey: 'test_L6HTEOAXQBCZJHKNU4NLN6EI7IE6VRRW',
            environment: 'test',
            paymentMethodsResponse // OPTIONAL (for card or customCard (aka securedfields) this will retrieve the list of supported card brands)
        }

        window.checkout = await AdyenCheckout(configObj);

        //-------- SET UP CUSTOM CARD -------------------
        window.securedFields = checkout
            .create('securedfields',
                {
                    type: 'card',
//                     brands  : ['mc', 'visa', 'amex', 'cartebancaire'], // OPTIONAL (if paymentMethodsResponse hasn't been received, or, you wish to overwrite the supported card brands)
                    onAllValid: pCallbackObj => {
                        if(pCallbackObj.allValid){
                            payBtn.style['pointer-events'] = 'auto';
                            payBtn.style.opacity = '1';
                            payBtn.removeAttribute('disabled');

                        }else{
                            payBtn.style['pointer-events'] = 'none';
                            payBtn.style.opacity = '0.3';
                            payBtn.setAttribute('disabled', 'true');
                        }
                    },
                    onFocus: pCallbackObj => {
                        const sfNode = pCallbackObj.rootNode.querySelector(`[data-cse="${pCallbackObj.fieldType}"]`);
                        setFocusClasses(sfNode, pCallbackObj.focus);
                    },
                    onBrand: pCallbackObj => {
                        const brandEl = document.getElementById('pmImage');
                        brandEl.setAttribute('src', pCallbackObj.brandImageUrl)
                    },
                    onChange: (state, component) => {
//                         console.log('onChange:: state=', state)

                        // onError handler
                        // From components v5 the onError handler is no longer only for card comp related errors
                        // - so, to recreate this functionality:
                        // watch state.errors and use it to call the custom card specific 'setErrors' function
                        if (!!Object.keys(state.errors).length) {
                            const errors = Object.entries(state.errors).map(([fieldType, error]) => {
                                return {
                                    fieldType,
                                    ...(error ? error : { error: '', rootNode: component._node })
                                };
                            });
                            errors.forEach(setCCErrors);
                        }
                    }
                }
            )
            .mount('.pm-form');
            //-------- end SET UP CUSTOM CARD -------------------

            //-------- CUSTOM CARD HELPER FUNCTIONS -------------------
            const setCCErrors = (pCallbackObj) => {
                if (!pCallbackObj.rootNode) return;

                const sfNode = pCallbackObj.rootNode.querySelector(`[data-cse="${pCallbackObj.fieldType}"]`);
                const errorNode = sfNode.parentNode.querySelector('.pm-form-label__error-text');

                if (errorNode.innerText === '' && pCallbackObj.error === '') return;

                if (pCallbackObj.error !== '') {
                    errorNode.style.display = 'block';
                    errorNode.innerText = pCallbackObj.errorI18n;

                    // Add error classes
                    setErrorClasses(sfNode, true);
                    return;
                }

                // Else: error === ''
                errorNode.style.display = 'none';
                errorNode.innerText = '';

                // Remove error classes
                setErrorClasses(sfNode, false);
            }

            const setErrorClasses = function(pNode, pSetErrors) {
                if (pSetErrors) {
                    if (pNode.className.indexOf('pm-input-field--error') === -1) {
                        pNode.className += ' pm-input-field--error';
                    }
                    return;
                }

                // Remove errors
                if (pNode.className.indexOf('pm-input-field--error') > -1) {
                    const newClassName = pNode.className.replace('pm-input-field--error', '');
                    pNode.className = newClassName.trim();
                }
            };

            const setFocusClasses = (pNode, pSetFocus) => {
                if (pSetFocus) {
                    if (pNode.className.indexOf('pm-input-field--focus') === -1) {
                        pNode.className += ' pm-input-field--focus';
                    }
                    return;
                }

                // Remove focus
                if (pNode.className.indexOf('pm-input-field--focus') > -1) {
                    const newClassName = pNode.className.replace('pm-input-field--focus', '');
                    pNode.className = newClassName.trim();
                }
            };

            ///////////// SUBMIT PAYMENT REQUEST //////////////

            const makePayment = (paymentMethod, config = {}) => {
                const paymentsConfig = { ...paymentsDefaultConfig, ...config };
                const paymentRequest = { ...paymentsConfig, ...paymentMethod };

                console.log('makePayment::paymentRequest=', paymentRequest)

                return httpPost('payments', paymentRequest)
                    .then(response => {
                        if (response.error) throw 'Payment initiation failed';

                        alert(response.resultCode);

                        return response;
                    })
                    .catch(console.error);
            };

            window.submitPayment = function(component){
                // UI changes
                const holder = document.getElementById('adyenPaymentDiv');
                const form = document.getElementById('pmForm');
                const payBtn = document.getElementById('payBtn');

                holder.style.opacity = '0.5';
                holder.style['pointer-events'] = 'none';

                payBtn.style['pointer-events'] = 'none';

                const data = component.formatData();

                // Make the actual payments
                makePayment(data);
            }
    }

    if(document.addEventListener){
        document.addEventListener("DOMContentLoaded", function(){
            initCheckout()
        });
    }

</script>
</body>
</html>

