# Checkout Components sample code

> ⚠️ **This repository is for demo purposes only**

![Adyen Checkout Components Sample Code](screenshot.png)

## Requirements

To run this project, **create** a `.env` file on your project's root folder following the example on `.env.default`.

```
MERCHANT_ACCOUNT=MyMerchantAccount
CHECKOUT_APIKEY=MY_CHECKOUT_API_KEY
```

These variables can be found in Adyen Customer Area. For more information, visit our [Getting Started guide](https://docs.adyen.com/developers/get-started-with-adyen/create-a-test-account).

## Installation

### Install CURL

**Ubuntu**
```
sudo apt-get install php-curl
```

[Source](https://stackoverflow.com/a/6382581/4110257)

### Running the PHP Server

Run from the root of the project:

```
$ cd adyen-components-js-sample-code
$ ./start.sh
```

A PHP server will start on `http://localhost:3000`.

## Documentation

For the complete integration guide, refer to the [Checkout Components documentation](https://docs.adyen.com/checkout/components-web/).

## License

This repository is open source and available under the MIT license. For more information, see the LICENSE file.
