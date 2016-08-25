"use strict";

function MercadoPago(publicKey) {
    this.type = 'creditcard'
    this.name = 'mercadopago';
    this.publicKey = publicKey;
    this.gatewayUrl = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10;
}

MercadoPago.prototype.start = function() {
    loadScript(this.gatewayUrl, function() {
        Mercadopago.setPublishableKey(this.publicKey);
    }.bind(this));
}

MercadoPago.prototype.createToken = function(form, clickPromise) {
    var clickbusPayments = clickPromise.clickbusPayments;
    if (clickbusPayments.successResponse.hasOwnProperty(this.name)) {
        this.clearSession();
    }

    Mercadopago.createToken(form, function(status, response) {
        response.name = this.name;
        response.brand = clickbusPayments.getCardBrand();
        clickPromise.finish(status, response);
    }.bind(this));
}

MercadoPago.prototype.clearSession = function() {
    Mercadopago.clearSession();
}
