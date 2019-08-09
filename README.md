# Adyen Components sample code

![Adyen Checkout Components Sample Code](screenshot.png)

> ⚠️ **This repository is for demo purposes only**

## Requirements

To run this project, **create** a `.env` file on your project's root folder following the example on `.env.default`.

```
MERCHANT_ACCOUNT=MyMerchantAccount
CHECKOUT_APIKEY=MY_CHECKOUT_API_KEY
```

These variables can be found in Adyen Customer Area. For more information, visit our [Get started with Adyen guide](https://docs.adyen.com/payments-essentials/get-started-with-adyen).

## Installation

### Running the PHP Server

Run from the root of the project:

```
$ cd adyen-components-js-sample-code
$ ./start.sh
```

A PHP server will start on `http://localhost:3000`.

### Deploying this example to Heroku

Alternatively, you can install this example by using this shortcut to deploy to Heroku:<br/>
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Adyen/adyen-components-js-sample-code)

## Documentation

For the complete integration guide, refer to the [Web Components documentation](https://docs.adyen.com/checkout/components-web/).

## License

This repository is open source and available under the MIT license. For more information, see the LICENSE file.
