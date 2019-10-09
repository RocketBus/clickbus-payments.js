"use strict";

function Paypal(publicKey, isTest) {
    this.type = 'paypal';
    this.name = 'paypal';
    this.publicKey = publicKey;
}

Paypal.prototype.start = function() { };
Paypal.prototype.clearSession = function() { };
Paypal.prototype.addChildPublicKey = function() { };

Paypal.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('GET', '/payment/token/paypal');
    request.onload = function() {
        if (request.status == 200) {
            var response = JSON.parse(request.response);
            clickPromise.finish(request.status, {content: response, type: this.type, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: 'error'});
    }.bind(this);

    request.onerror = function() {
        console.log(request);
        clickPromise.finish(request.status, {name: this.name, cause: 'error'});
    };

    request.send();
};
