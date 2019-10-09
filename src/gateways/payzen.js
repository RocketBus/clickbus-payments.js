"use strict";

function PayZen() {
    this.type = 'debit_card';
    this.name = 'payzen';
}

PayZen.prototype.start = function() { };
PayZen.prototype.clearSession = function() { };
PayZen.prototype.addChildPublicKey = function() { };

PayZen.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('POST', 'https://www.mocky.io/v2/5d9c819f31000037c92fc621');
    request.onload = function() {
        if (request.status == 200) {
            var response = JSON.parse(request.response);
            clickPromise.finish(request.status, {content: response, type: this.type, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: 'error', type: this.type});
    }.bind(this);

    request.onerror = function() {
        clickPromise.finish(request.status, {name: this.name, cause: 'error'});
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
