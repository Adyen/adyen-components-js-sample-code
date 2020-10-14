const { post } = require('request');
const handleCallback = require('../utils/handleCallback');

module.exports = (res, request) => {
    post('/clientKeys', (err, response, body) => handleCallback({ err, response, body }, res));
};
