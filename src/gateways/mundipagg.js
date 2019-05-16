"use strict";

function MundiPagg(publicKey, isTest) {
    this.type = 'credit_card';
    this.name = 'mundipagg';

    this.gatewayUrl = "https://api.mundipagg.com/core/v1/tokens?appId="+publicKey;
}

MundiPagg.prototype.start = function() { };
MundiPagg.prototype.clearSession = function() { };
MundiPagg.prototype.addChildPublicKey = function() { };

MundiPagg.prototype.createToken = function(form, clickPromise, options) {
    var defaultOptions = {
        oneClickPayment: false,
    };
    var _options = merge(defaultOptions, options);

    if (_options.oneClickPayment) {
        this.oneClickPayment(form, clickPromise);

        return;
    }

    var request = new XMLHttpRequest();
    request.open('POST', this.gatewayUrl);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function() {
        var response = JSON.parse(request.response);

        if (request.status == 200) {
            clickPromise.finish(request.status, {content: response.id, type: this.type, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, type: this.type, cause: response.ErrorReport});
    }.bind(this);

    request.onerror = function() {
        clickPromise.finish(request.status, {name: this.name, cause: 'error'});
    };

    request.send(JSON.stringify(this.formatRequest(clickPromise.clickbusPayments)));
};

MundiPagg.prototype.formatRequest = function(clickbusPayments) {
    return {
        "card": {
            number: clickbusPayments.getCreditCard(),
            exp_month: clickbusPayments.getExpirationMonth(),
            exp_year: clickbusPayments.getExpirationYear(),
            holder_name: clickbusPayments.getHolderName(),
            cvv: clickbusPayments.getSecurityCode(),
            type: this.type
        }

    }
};

MundiPagg.prototype.oneClickPayment = function (form, clickPromise) {
    clickPromise.finish(
        200,
        {
            content: clickPromise.clickbusPayments.getCurrentOneClickPaymentCardIdByGateway(this.name),
            name: this.name,
            type: this.type,
            oneClickPayment: true
        }
    );
};
