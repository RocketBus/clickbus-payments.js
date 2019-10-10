"use strict";

var PAYPAL_NAME = 'paypal';

function Paypal(publicKey, isTest) {
    this.type = PAYPAL_NAME;
    this.name = PAYPAL_NAME;
    this.publicKey = publicKey;
}

Paypal.prototype.start = function() { };
Paypal.prototype.clearSession = function() { };
Paypal.prototype.addChildPublicKey = function() { };

Paypal.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.mocky.io/v2/5d9c819f31000037c92fc621');
    request.onload = function() {
        if (request.status == 200) {
            var response = JSON.parse(request.response);
            clickPromise.finish(request.status, {content: response, type: this.type, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: ERROR_TEXT, type: this.type});
    }.bind(this);

    request.onerror = function() {
        clickPromise.finish(request.status, {name: PAYPAL_NAME, cause: ERROR_TEXT, type: PAYPAL_NAME});
    };

    request.send();
};
