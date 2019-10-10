"use strict";

var PAYZEN_NAME = 'payzen';

function PayZen() {
    this.type = TYPE_DEBIT_CARD;
    this.name = PAYZEN_NAME;
}

PayZen.prototype.start = function() { };
PayZen.prototype.clearSession = function() { };
PayZen.prototype.addChildPublicKey = function() { };

PayZen.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('POST', '/payment/token/debit_card');
    request.onload = function() {
        if (request.status == 200) {
            var response = JSON.parse(request.response);
            clickPromise.finish(request.status, {content: response, type: this.type, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: ERROR_TEXT, type: this.type});
    }.bind(this);

    request.onerror = function() {
        clickPromise.finish(request.status, {name: PAYZEN_NAME, cause: ERROR_TEXT, type: TYPE_DEBIT_CARD});
    };

    request.send(JSON.stringify(this.formatRequest(clickPromise.clickbusPayments)));
};

PayZen.prototype.formatRequest = function(clickbusPayments) {
    return {
        paymentName: this.name,
        cardBrand: clickbusPayments.getCardBrand(),
        cardNumber: clickbusPayments.getCreditCard(),
        cardExpirationMonth: clickbusPayments.getExpirationMonth(),
        cardExpirationYear: parseInt(clickbusPayments.getExpirationYear(), 10) + 2000,
        cardSecurityCode: clickbusPayments.getSecurityCode(),
        customer: {
            name: clickbusPayments.getHolderName(),
            email: clickbusPayments.getEmail(),
            phone: clickbusPayments.getPhone()
        }
    }
};
