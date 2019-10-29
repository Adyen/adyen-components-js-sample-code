<?php
/**
 * Adyen Checkout Example (https://www.adyen.com/)
 * Copyright (c) 2019 Adyen BV (https://www.adyen.com/)
 * /originKeys Documentation: https://docs.adyen.com/api-explorer/#/CheckoutUtility/v1/originKeys
 */
function getOriginKey() {
    // Trim control chars that might sneak in
    $apikey = trim(getenv('CHECKOUT_APIKEY'));
    $merchantAccount = trim(getenv('MERCHANT_ACCOUNT'));
    $url = "https://checkout-test.adyen.com/v1/originKeys";

    // Get the current domain
    $domain = $_SERVER['HTTP_HOST'];
    $protocol =  ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

    // Prepare the request
    $data = [
        'originDomains' => [$protocol.$domain]
    ];

    // Convert data to JSON
    $json_data = json_encode($data);

    // Initiate curl
    $curlAPICall = curl_init();

    // Set to POST
    curl_setopt($curlAPICall, CURLOPT_CUSTOMREQUEST, "POST");

    // Will return the response, if false it print the response
    curl_setopt($curlAPICall, CURLOPT_RETURNTRANSFER, true);

    // Add JSON message
    curl_setopt($curlAPICall, CURLOPT_POSTFIELDS, $json_data);

    // Set the url
    curl_setopt($curlAPICall, CURLOPT_URL, $url);

    // Api key
    curl_setopt($curlAPICall, CURLOPT_HTTPHEADER,
        array(
            "X-Api-Key: " . $apikey,
            "Content-Type: application/json",
            "Content-Length: " . strlen($json_data)
        )
    );

    // Execute
    $result = curl_exec($curlAPICall);

    // Error Check
    if ($result === false){
      throw new Exception(curl_error($curlAPICall), curl_errno($curlAPICall));
    }

    // Closing
    curl_close($curlAPICall);

    // This file returns a JSON object
    return $result;
}
