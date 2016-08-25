"use strict";

function Paypal(publicKey, isTest) {
    this.type = 'paypal';
    this.name = 'paypal';
    this.publicKey = publicKey;
}

Paypal.prototype.start = function() { }
Paypal.prototype.clearSession = function() { }

Paypal.prototype.createToken = function(form, clickPromise) {
    var response = {"token" : "EC-12312312312312","urlRedirect" : "https://www.sandbox.paypal.com/checkoutnow/?token=EC-123123123123123"};
    clickPromise.finish(200, {content: response, name: this.name});
    // var request = new XMLHttpRequest();
    // request.open('GET', '/payment/token/paypal');
    // request.onload = function() {
    //     var response = JSON.parse(request.response);
    //     if (request.status == 200) {
    //         clickPromise.finish(request.status, {content: response, name: this.name});
    //         return;
    //     }
    //
    //     clickPromise.finish(request.status, {name: this.name, cause: response.ErrorReport});
    // }.bind(this);

    // request.onerror = function() {
    //     console.log(request);
    // };
    //
    // request.send(JSON.stringify(this.formatRequest(clickPromise.clickbusPayments)));
}
