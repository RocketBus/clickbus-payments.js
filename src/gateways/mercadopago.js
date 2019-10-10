"use strict";

function MercadoPago(publicKey, customName) {
    this.type = TYPE_CREDIT_CARD;
    this.name = 'mercadoPago';
    this.customName = customName;

    this.publicKey = publicKey;
    this.childPublicKeys = [];
    this.storagePublicKeys = [];
    this.isMultiple = false;

    this.tokens = {};

    this.gatewayUrl = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js";
}

MercadoPago.prototype.start = function() {
    loadScript(this.gatewayUrl, function() {
        Mercadopago.setPublishableKey(this.publicKey);
        this.addChildPublicKey(this.name, this.publicKey, true);
    }.bind(this));
};

MercadoPago.prototype.addChildPublicKey = function(customName, publicKey, onlyStorage) {
    var publicKeyItem = {};
    publicKeyItem[customName] = publicKey;

    if (!onlyStorage) {
        this.isMultiple = true;
        this.childPublicKeys.push(publicKeyItem);
    }

    this.storagePublicKeys.push(publicKeyItem);
};

MercadoPago.prototype.createToken = function(form, clickPromise, options, publicKey) {

    var defaultOptions = {
        oneClickPayment: false
    };
    var _options = merge(defaultOptions, options);

    var paymentFields = form;
    if (clickPromise.clickbusPayments.options.currentPaymentSelector) {
        paymentFields = form.querySelector(clickPromise.clickbusPayments.options.currentPaymentSelector);
    }

    var successResponse = clickPromise.clickbusPayments.successResponse;
    if (successResponse.hasOwnProperty(this.type)) {
        this.clearSession();
    }

    if (typeof publicKey != 'undefined') {
        this.clearSession();
        Mercadopago.setPublishableKey(publicKey[Object.keys(publicKey)[0]]);
    }

    Mercadopago.createToken(paymentFields, function(status, response) {
        response.name = this.name;
        response.type = this.type;
        response.isMultiple = this.isMultiple;
        response.oneClickPayment = _options.oneClickPayment;

        logger(response);

        if (status != 201 && status != 200) {
            this.reset();
            clickPromise.finish(status, response);
            return;
        }

        var tokenKey = typeof publicKey != 'undefined' ? Object.keys(publicKey)[0] : this.name;
        this.tokens[tokenKey] = response.id;

        logger(this.tokens);

        if (this.childPublicKeys.length == 0 || this.storagePublicKeys.length == 1) {
            this.reset();
            response.content = typeof publicKey != 'undefined' ? this.tokens : response.id;
            clickPromise.finish(status, response);
            return;
        }

        this.createToken(form, clickPromise, options, this.childPublicKeys.shift());
    }.bind(this));
};

MercadoPago.prototype.clearSession = function() {
    Mercadopago.clearSession();
};

MercadoPago.prototype.reset = function() {
    this.childPublicKeys = this.storagePublicKeys.slice(0);
};
