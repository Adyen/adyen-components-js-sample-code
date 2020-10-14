<?php
/**
 * Adyen Checkout Example (https://www.adyen.com/)
 * Copyright (c) 2019 Adyen BV (https://www.adyen.com/)
 */
function getClientKey() {
	// Retrieves the clientKey from the .env file
    $clientKey = getenv('CLIENT_KEY');

    $data = [
    	"clientKey" => $clientKey
    ];

    $result = json_encode($data);

    return $result;
}
