"use strict";

function MercadoPago(publicKey) {
    this.name = 'mercadopago';
    this.publicKey = publicKey;
    this.javascript_url = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10;
}

MercadoPago.prototype.start = function() {
    loadScript(this.javascript_url, function() {
        Mercadopago.setPublishableKey(this.publicKey);
    }.bind(this));
}

MercadoPago.prototype.createToken = function(form, clickPromise) {
    Mercadopago.createToken(form, function(status, response) {
        response.name = this.name;
        clickPromise.finish(status, response);
    }.bind(this));
}

MercadoPago.prototype.clearSession = function() {
    Mercadopago.clearSession();
}
