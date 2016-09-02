"use strict";

function MercadoPago(publicKey) {
    this.type = 'credit_card'
    this.name = 'mercadoPago';
    this.publicKey = publicKey;
    this.gatewayUrl = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10;
}

MercadoPago.prototype.start = function() {
    loadScript(this.gatewayUrl, function() {
        Mercadopago.setPublishableKey(this.publicKey);
    }.bind(this));
};

MercadoPago.prototype.createToken = function(form, clickPromise) {
    var token = clickPromise.clickbusPayments.successResponse.token;
    if (token.hasOwnProperty(this.name)) {
        this.clearSession();
    }

    Mercadopago.createToken(form, function(status, response) {
        response.name = this.name;
        response.content = response.id;
        clickPromise.finish(status, response);
    }.bind(this));
};

MercadoPago.prototype.clearSession = function() {
    Mercadopago.clearSession();
};
