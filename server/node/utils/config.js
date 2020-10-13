const { CHECKOUT_APIKEY, MERCHANT_ACCOUNT, CLIENT_KEY } = process.env;

const API_VERSION = 'v64';
const CHECKOUT_URL = `https://checkout-test.adyen.com/${API_VERSION}`;

module.exports = {
    CHECKOUT_APIKEY,
    CHECKOUT_URL,
    MERCHANT_ACCOUNT,
    CLIENT_KEY
};
