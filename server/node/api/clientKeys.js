const { CLIENT_KEY: clientKey } = require('../utils/config');
const handleCallback = require('../utils/handleCallback');

module.exports = (res, request) => {
    handleCallback({ body: { clientKey } }, res);
};
