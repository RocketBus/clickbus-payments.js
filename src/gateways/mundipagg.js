"use strict";

function MundiPagg(publicKey, isTest) {
    this.type = 'credit_card';
    this.name = 'mundipagg';
    this.publicKey = publicKey;
}

MundiPagg.prototype.start = function() { };
MundiPagg.prototype.clearSession = function() { };

MundiPagg.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('POST', '/payment/token/mundipagg');
    request.onload = function() {
        var response = JSON.parse(request.response);
        if (request.status == 201) {
            clickPromise.finish(request.status, {content: response.token, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: response.ErrorReport});
    }.bind(this);

    request.onerror = function() {

    };

    request.send(JSON.stringify(this.formatRequest(clickPromise.clickbusPayments)));
};

MundiPagg.prototype.formatRequest = function(clickbusPayments) {
    return {
        CreditCardBrand: clickbusPayments.getCardBrand(),
        CreditCardNumber: clickbusPayments.getCreditCard(),
        ExpMonth: clickbusPayments.getExpirationMonth(),
        ExpYear: clickbusPayments.getExpirationYear(),
        HolderName: clickbusPayments.getHolderName(),
        SecurityCode: clickbusPayments.getSecurityCode(),
        IsOneDollarAuthEnabled: false
    }
};
