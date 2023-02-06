require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const getPaymentMethods = require('./api/paymentMethods');
const getOriginKeys = require('./api/originKeys');
const getClientKeys = require('./api/clientKeys');
const makePayment = require('./api/payments');
const postDetails = require('./api/details');
const sessions = require('./api/sessions');

module.exports = (() => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.use(express.static(path.resolve(__dirname, '../../src')));

    app.all('/originKeys', (req, res) => getOriginKeys(res, req));
    app.all('/paymentMethods', (req, res) => getPaymentMethods(res, req.body));
    app.all('/payments', (req, res) => makePayment(res, req.body));
    app.all('/details', (req, res) => postDetails(res, req.body));
    app.all('/sessions', (req, res) => sessions(res, req.body));
    app.all('/clientKeys', (req, res) => getClientKeys(res, req));

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on localhost:${port}`));
})();
