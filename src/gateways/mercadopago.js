"use strict";

function MercadoPago(publicKey, customName) {
    this.type = 'credit_card';
    this.name = 'mercadopago';
    this.customName = customName;

    this.publicKey = publicKey;
    this.childPublicKeys = [];
    this.storagechildPublicKeys = [];

    this.tokens = {};

    this.gatewayUrl = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10;
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
        this.childPublicKeys.push(publicKeyItem);
    }

    this.storagechildPublicKeys.push(publicKeyItem);
};

MercadoPago.prototype.createToken = function(form, clickPromise, publicKey) {
    var successResponse = clickPromise.clickbusPayments.successResponse;
    if (successResponse.hasOwnProperty(this.type)) {
        this.clearSession();
    }

    if (typeof publicKey != 'undefined') {
        this.clearSession();
        Mercadopago.setPublishableKey(publicKey[Object.keys(publicKey)[0]]);
    }

    Mercadopago.createToken(form, function(status, response) {
        response.name = this.name;
        response.type = this.type;

        if (status != 201 && status != 200) {
            this.reset();
            clickPromise.finish(status, response);
            return;
        }

        var tokenKey = typeof publicKey != 'undefined' ? Object.keys(publicKey)[0] : this.name;
        this.tokens[tokenKey] = response.id;

        if (this.childPublicKeys.length == 0) {
            this.reset();
            response.content = typeof publicKey != 'undefined' ? this.tokens : response.id;
            clickPromise.finish(status, response);
            return;
        }

        this.createToken(form, clickPromise, this.childPublicKeys.shift());
    }.bind(this));
};

MercadoPago.prototype.clearSession = function() {
    Mercadopago.clearSession();
};

MercadoPago.prototype.reset = function() {
    this.childPublicKeys = this.storagechildPublicKeys.slice(0);
};
