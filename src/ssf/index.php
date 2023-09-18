<!-- NOTE FOR REVIEWERS: THIS IS ONLY USED FOR TESTING, IT IS NEVER PUBLICLY EXPOSED SO IT DOESN'T NEED REVIEWING -->

<!-- EXAMPLE OF A PAGE THAT USES checkoutSecuredFields.js (BUT NOT THE SDK) TO MAKE A CREDIT CARD PAYMENT -->
<!--
Accepts visa, mc & amex.
Uses chainable callback functions to handle feedback from CSF.
Uses on 'onBrand' callback (to set image).
Uses checkoutInitiatePayment.js to handle payment initiation
USES NEW CONFIG OBJECT THAT ALLOWS CONFIGURATION ON A PAYMENT METHOD BY PAYMENT METHOD BASIS (FOR STYLES & PLACEHOLDERS)
 -->

<?php

$testingAgainstLocalHost = false;

// 1.0.2 is the earliest version I can get working, 1.5.5 is the latest
$csfVersion = '1.5.5';

$merchantAccount= 'TestMerchant';

if(!$testingAgainstLocalHost){
    $merchantAccount = 'TestMerchantCheckout';
}

$jsSetupResponse = '';

// Timezone
date_default_timezone_set("Europe/Amsterdam");

// Adyen configuration
if (!$testingAgainstLocalHost) {
    // FOR TESTING AGAINST TEST SERVER
    define('ADYEN_CHECKOUT_APIKEY', 'AQEthmfxKo7MbhFLw0m/n3Q5qf3VfI5eGbBFVXVXyGHNhisxSHQZLQhnJZKhUXeVEMFdWw2+5HzctViMSCJMYAc=-oIzzffq7wjRWqcRFe1bsItPks2i1MSog34dGaknhoUE=-VzDtyMSa2eBX72_k');
    define('ADYEN_CHECKOUT_SERVICE_URL', 'https://checkout-test.adyen.com/services/PaymentSetupAndVerification/v32');
} else {

    // FOR TESTING AGAINST LOCALHOST
    define('ADYEN_CHECKOUT_APIKEY', 'AQEmhmfuXNWTK0Qc+iSEl3cshOuWWIpDFNWZ7BldpzFgqjaFCkrORCwQwV1bDb7kfNy1WIxIIkxgBw==-3YcmHFltObXoxB00Qd/TNqph2ohOoIucx00nLRbI21E=-0000000000000000');
    define('ADYEN_CHECKOUT_SERVICE_URL', 'http://localhost:8080/checkout/services/PaymentSetupAndVerification/v32');
}

define('ADYEN_CHECKOUT_SETUP_URL', ADYEN_CHECKOUT_SERVICE_URL . '/setup');

setupPayment($merchantAccount);


/**
 * Make a setup payment request, which give a list of payment methods and their details
 */
function setupPayment($merchantAccount)
{

    // raw payment data
    $setupRequest = array(
        'amount' => array(
            'value' => '10',
            'currency' => 'EUR'
        ),
        'countryCode' => 'NL',
        'shopperLocale' => 'NL',
        'merchantAccount' => $merchantAccount,
        'returnUrl' => 'http://localhost:3000/paymentSuccess.php',
        'reference' => 'Checkout php ' . $_ENV['LOGNAME'] . ' ' . date('YmdHi'),
        'sessionValidity' => date('Y-m-d\TH:i:s\Z', strtotime('+2 days')),
        'channel' => 'Web',
        'shopperReference' => 'littlemiss',
        'shopperIP' => $_SERVER['REMOTE_ADDR']
    );


    // Origin is required when 'html' is set to true
//    if (substr($_SERVER['SERVER_PROTOCOL'], 0, 5) == 'HTTP/') {
//        $setupRequest['returnUrl'] = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'];
//        $setupRequest['origin'] = 'http://' . $_SERVER['HTTP_HOST'];
//    } else {
//        $setupRequest['returnUrl'] = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'];
//        $setupRequest['origin'] = 'https://' . $_SERVER['HTTP_HOST'];
//    }

    $setupRequest['origin'] = 'http://localhost:3000';


    $setupString = json_encode($setupRequest);

    //  Initiate curl
    $ch = curl_init();
    // Set to POST
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    // Add JSON message
    curl_setopt($ch, CURLOPT_POSTFIELDS, $setupString);
    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt($ch, CURLOPT_URL, ADYEN_CHECKOUT_SETUP_URL);
    // Api key
    curl_setopt($ch, CURLOPT_HTTPHEADER,
        array(
            "X-Api-Key: " . ADYEN_CHECKOUT_APIKEY,
            "Content-Type: application/json",
            "Content-Length: " . strlen($setupString)
        )
    );

    // Execute
    $result = curl_exec($ch);

    // Closing
    curl_close($ch);


    global $jsSetupResponse;
//    $jsSetupResponse = json_encode($result);
    $jsSetupResponse = $result;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Adyen Checkout Demo - CSF Only</title>
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
            -moz-boder-radius: 4px;
            -webkit-border-radius: 4px;
            float: right;
            line-height: 0;
            position: relative;
            overflow: hidden;
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

    <script
            src="https://code.jquery.com/jquery-1.12.4.min.js"
            integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="
            crossorigin="anonymous"></script>

    <?php
    if(!$testingAgainstLocalHost) {
        echo '<script type="text/javascript" src="https://checkoutshopper-test.adyen.com/checkoutshopper/assets/js/sdk/checkoutSecuredFields.'.$csfVersion.'.js" ></script>';
        echo '<script type="text/javascript" src="https://checkoutshopper-test.adyen.com/checkoutshopper/js/checkoutInitiatePayment.min.js"></script>';
    }else{
        echo '<script type="text/javascript" src="http://localhost:8080/checkoutshopper/assets/js/sdk/checkoutSecuredFields.'.$csfVersion.'.js" ></script >';
        echo '<script type="text/javascript" src="http://localhost:8080/checkoutshopper/js/checkoutInitiatePayment.min.js"></script>';
    }
    ?>

</head>
<body>
<a href="../">Back</a>
<div id="adyenPaymentDiv" class="payment-div">
    <div id="pmForm" class="js-chckt-pm__pm-holder">
        <input type="hidden" name="txvariant" value="card"/>
        <div class="pm-details">
            <div class="pm-form">
                <span class="pm-image">
                    <img id="pmImage" width="40" src=<?php if(!$testingAgainstLocalHost) { echo "'https://checkoutshopper-test.adyen.com/checkoutshopper/img/pm/sdk/card@2x.png'"; } else {  echo "'http://localhost:8080/checkoutshopper/img/pm/sdk/card@2x.png'";} ?> alt="">
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
    <!--<div id="pmForm" class="js-chckt-pm__pm-holder">
        <input type="hidden" name="txvariant" value="amex_r1"/>
        <div class="pm-details">
            <div class="pm-form">
                <span class="pm-image">
                    <img id="pmImage" width="40" src=<?php /*if(!$testingAgainstLocalHost) { echo "'https://checkoutshopper-test.adyen.com/checkoutshopper/img/pm/sdk/card@2x.png'"; } else {  echo "'http://localhost:8080/checkoutshopper/img/pm/sdk/card@2x.png'";} */?> alt="">
                </span>
                <label class="pm-form-label pm-form-label--cvc">
                    <span class="pm-form-label__text">CVV/CVC:</span>
                    <span class="pm-input-field" data-hosted-id="hostedSecurityCodeField" data-cse="encryptedSecurityCode"></span>
                    <span class="pm-form-label__error-text">CVC Error text</span>
                </label>
            </div>
        </div>
    </div>-->
    <button id="payBtn" type="button" class="pm-button--submit" disabled onclick="window.submitPayment();">Submit</button>
</div>
<!--<input id='editableDiv'>Paste</input>-->
<script type="text/javascript">

    /*function handlePaste (e) {
        var clipboardData, pastedData;

        // Stop data actually being pasted into div
        e.stopPropagation();
        e.preventDefault();

        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');

        // Do whatever with pasteddata
        alert(pastedData);
    }

    document.getElementById('editableDiv').addEventListener('paste', handlePaste);*/

    var dataObject = <?php echo $jsSetupResponse ?>;

    var vn = '<?php echo $csfVersion ?>';

    var csfVnNum = Number( vn.replace(/\./g,'') );


    var initialiseCSF = function(){

        var setupResponseJSON = dataObject;

        if(window.console && window.console.log){
            window.console.log('$$$ checkout_csfOnly:::: setupResponseJSON=', setupResponseJSON);
        }

        var payBtn = $('#payBtn')[0];

        var cardBrand = '';


        ///////////// SET UP checkoutSecuredFields ////////////////////////////
        var csfSetupObj = {};
        csfSetupObj.rootNode = '.payment-div';
        csfSetupObj.configObject = setupResponseJSON;
        csfSetupObj.configObject.cardGroupTypes = ['mc', 'visa', 'amex', 'cartebancaire', 'forbrugsforeningen'];// Override the cardGroupTypes generated from the setupResponseJSON


        csfSetupObj._b$dl = true;

        csfSetupObj.allowAVDetection = 'body';


        var style = {
            base: {
                color: '#000',
                fontSize: '14px',
                lineHeight: '14px'
            },
            error: {
                color: 'red'
            },
            placeholder: {
                color: '#d8d8d8'
            },
            validated:{
                color: 'blue'
            }
        };

        csfSetupObj.paymentMethods = {
            card : {
                sfStyles : style,
                placeholders : {
                    encryptedCardNumber : '9999 9999 9999 9999',
                    encryptedSecurityCode : '1234'
                }
            }
        };


        window._b$dl = true;

        var secureFields = csf(csfSetupObj)

        var count = 0

        // var cnt = setInterval(function(){
        //     count++;
        //     console.log('### checkout_csfOnly7::REINITALISING:: count=', count);
        //
        //     secureFields = csf(csfSetupObj)
        //
        //     if(count === 1) clearInterval(cnt)
        // }, 50);

        // All callbacks can also be chained e.g. csf(csfSetupObj).onLoad(function(pObj){//Do something}).onAllValid(function(pObj){//Do something}) etc etc
        secureFields.onLoad( function(pCallbackObj){

            if ( window.console && window.console.log ) {
                window.console.log('\n####################################################');
                window.console.log( '### checkout_csfOnly7::onLoad:: iframes loaded - but not necessarily initiated pCallbackObj=',pCallbackObj );
                window.console.log('####################################################');
            }
        });

        if(csfVnNum >= 113) {

            secureFields.onConfigSuccess( function ( pCallbackObj ) {

                if ( window.console && window.console.log ) {
                    window.console.log('\n####################################################');
                    window.console.log( '### checkout_csfOnly7::onConfigSuccess:: iframes loaded and ready! pCallbackObj=', pCallbackObj );
                    window.console.log('####################################################');
                }

//                secureFields.setFocusOnFrame( 'card', 'encryptedCardNumber' );

                if(csfVnNum >= 153) {
                    // secureFields.sendValueToFrame( 'card', 'encryptedCardNumber', '1234567890123456' );
                }

//                secureFields._b$dl( 'card', 'encryptedCardNumber', true );

//                secureFields._b$dl('card', 'encryptedExpiryDate', true);
//                      secureFields._b$dl('card', 'encryptedExpiryYear', true);
                //            secureFields._b$dl('card', 'encryptedSecurityCode', true);
            } );
        }

        secureFields.onAllValid( function(pCallbackObj){

            if(window.console && window.console.log){
                window.console.log('\n####################################################');
                window.console.log('$$$ checkout_csfOnly7::onAllValid:: pCallbackObj=',pCallbackObj);
                window.console.log('####################################################');
            }

            if(pCallbackObj.allValid){

                payBtn.style['pointer-events'] = 'auto';
                payBtn.style.opacity = '1';
                payBtn.removeAttribute('disabled');

            }else{

                payBtn.style['pointer-events'] = 'none';
                payBtn.style.opacity = '0.3';
                payBtn.setAttribute('disabled', 'true');
            }
        });

        secureFields.onFieldValid(function(pCallbackObj){

            if(window.console && window.console.log){
                window.console.log('\n####################################################');
                window.console.log('$$$ checkout_csfOnly7::onFieldValid:: pCallbackObj=',pCallbackObj);
                window.console.log('$$$ checkout_csfOnly7::onFieldValid:: fieldType==',pCallbackObj.fieldType);
                window.console.log('$$$ checkout_csfOnly7::onFieldValid:: valid==', (csfVnNum >= 120)? pCallbackObj.valid : pCallbackObj.status );
                window.console.log('####################################################');
            }
        });

        secureFields.onBrand( function(pCallbackObj){

            if ( window.console && window.console.log ) {
                window.console.log('\n####################################################');
                window.console.log( '### checkout_csfOnly7::onBrand:: pCallbackObj=',pCallbackObj );
                window.console.log('####################################################');
            }

            cardBrand = pCallbackObj.brand;

            $('#pmImage').attr('src', <?php if(!$testingAgainstLocalHost) { echo "'https://checkoutshopper-test.adyen.com/checkoutshopper/img/pm/sdk/'"; } else {  echo "'http://localhost:8080/checkoutshopper/img/pm/sdk/'";} ?> + cardBrand + '@2x.png');
        });

        secureFields.onError( function(pCallbackObj){

            if ( window.console && window.console.log ) {
                window.console.log('\n####################################################');
                window.console.log( '### checkout_csfOnly7::onError:: pCallbackObj=',pCallbackObj );
                window.console.log('####################################################');
            }

            setCCErrors(pCallbackObj);
        });

        secureFields.onFocus( function(pCallbackObj){

            if(window.console && window.console.log){
                window.console.log('\n####################################################');
                window.console.log('### checkout_csfOnly7:: onFocus:: pCallbackObj=',pCallbackObj);
                window.console.log('####################################################');
            }
            setFocus(pCallbackObj);
        });

        if(csfVnNum >= 131){

            secureFields.onBinValue( function(pCallbackObj){

                if(window.console && window.console.log){
                    window.console.log('\n####################################################');
                    window.console.log('### checkout_csfOnly7:: onBinValue:: pCallbackObj=',pCallbackObj);
                    window.console.log('####################################################');
                }
            });
        }


        //-------- end SET UP checkoutSecuredFields -------------------

        var setCCErrors = function(pCallbackObj){

            var holderDiv;

            if(csfVnNum < 120){

                holderDiv = $(pCallbackObj.markerNode).parent().find('[data-hosted-id="' + pCallbackObj.fieldType + '"]');

            }else{

                holderDiv = $(pCallbackObj.markerNode).parent().find('[data-cse="' + pCallbackObj.fieldType + '"]');
            }

            if(pCallbackObj.error !== ''){

                holderDiv.parent().find('.pm-form-label__error-text').css('display', 'block');
                holderDiv.parent().find('.pm-form-label__error-text').text(pCallbackObj.error);

                // Add error classes
                setErrorClasses(holderDiv[0], true);

            }else if(pCallbackObj.error === ''){

                holderDiv.parent().find('.pm-form-label__error-text').css('display', 'none');
                holderDiv.parent().find('.pm-form-label__error-text').text('');

                // Remove error classes
                setErrorClasses(holderDiv[0], false);
            }
        };

        var setFocus = function(pCallbackObj){

            var holderDiv;

            if(csfVnNum < 120){

                holderDiv = $(pCallbackObj.markerNode).parent().find('[data-hosted-id="' + pCallbackObj.fieldType + '"]');

            }else{

                holderDiv = $(pCallbackObj.markerNode).parent().find('[data-cse="' + pCallbackObj.fieldType + '"]');
            }

            setFocusClasses(holderDiv[0], pCallbackObj.focus);
        };


        var setErrorClasses = function(pNode, pSetErrors){

            if(pSetErrors){

                if ( pNode.className.indexOf( 'pm-input-field--error' ) === -1 ) {
                    pNode.className += " pm-input-field--error";
                }
                return;
            }

            var newClassName;

            // Remove errors
            if ( pNode.className.indexOf( 'pm-input-field--error' ) > -1 ) {

                newClassName = pNode.className.replace('pm-input-field--error','');
                pNode.className = newClassName.trim();
            }
        };

        var setFocusClasses = function(pNode, pSetFocus){

            if(window.console && window.console.log){
                window.console.log('### checkout_csfOnly7::setFocusClasses:: pNode=',pNode);
            }

            if(pSetFocus){

                if ( pNode.className.indexOf( 'pm-input-field--focus' ) === -1 ) {
                    pNode.className += " pm-input-field--focus";
                }
                return;
            }

            var newClassName;

            // Remove focus
            if ( pNode.className.indexOf( 'pm-input-field--focus' ) > -1 ) {

                newClassName = pNode.className.replace('pm-input-field--focus','');
                pNode.className = newClassName.trim();
            }
        };


        ///////////// SUBMIT PAYMENT INITIATION REQUEST //////////////
        window.submitPayment = function(){

            var holder = $('#adyenPaymentDiv')[0];

            var form = $('#pmForm')[0];

            holder.style.opacity = '0.5';
            holder.style['pointer-events'] = 'none';

            payBtn.style['pointer-events'] = 'none';


            //////////////// SUBMIT PAYMENT INITIATION REQUEST ///////////////
            var successFn = function(data){

                if(window.console && window.console.log){
                    window.console.log('$$$ checkout_csfOnly::SUBMIT SUCCESS:: result=',data);
                }

                holder.innerHTML = '<p>Your payment has been processed: type="' + data.type + '" , resultCode="' + data.resultCode + '"</p>' + '<p> payload=' + data.payload + '</p>';
                holder.style.opacity = '1';
            }

            var errorFn = function(xhr, status, text){

                if(window.console && window.console.log){
                    window.console.log('$$$ checkout_csfOnly:: :: SUBMIT ERROR',text,status,xhr);
                }

                holder.innerHTML = 'SUBMIT ERROR: check console';
                holder.style.opacity = '1';
            }

            var initPayConfig = {
                responseData : setupResponseJSON,
                pmType : cardBrand,
                formEl : form,
                onSuccess : successFn,
                onError : errorFn,
                preventPost : false
            }

            var res = chcktPay(initPayConfig);
            if(window.console && window.console.log){
                window.console.log('$$$ checkout_csfOnly7::initiate payment:: result=',res);
            }

            //--------- end SUBMIT PAYMENT INITIATION REQUEST -----------------
        }
    };

    if(document.addEventListener){

        document.addEventListener("DOMContentLoaded", function(){
            initialiseCSF()
        });

    }else{
        // IE8
        document.attachEvent("onreadystatechange", function(){
            if(document.readyState === "complete"){
                document.detachEvent("onreadystatechange", arguments.callee);
                initialiseCSF();
            }
        });
    }


</script>
</body>
</html>

