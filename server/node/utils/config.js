const { CHECKOUT_APIKEY, MERCHANT_ACCOUNT, CLIENT_KEY, API_VERSION } = process.env;

const CHECKOUT_URL = `https://checkout-test.adyen.com/${API_VERSION}`;

module.exports = {
    CHECKOUT_APIKEY,
    CHECKOUT_URL,
    MERCHANT_ACCOUNT,
    CLIENT_KEY
};
