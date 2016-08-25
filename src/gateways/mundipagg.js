"use strict";

function MundiPagg(publicKey, isTest) {
    this.type = 'credit_card';
    this.name = 'mundipagg';
    this.publicKey = publicKey;
}

MundiPagg.prototype.start = function() { }
MundiPagg.prototype.clearSession = function() { }

MundiPagg.prototype.createToken = function(form, clickPromise) {
    var clickbusPayments = clickPromise.clickbusPayments;
    var request = new XMLHttpRequest();
    request.open('POST', 'https://sandbox.mundipaggone.com/Sale/');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('MerchantKey', this.publicKey);
    request.onload = function() {
        var response = JSON.parse(request.response);
        if (request.status == 201) {
            var token = response.CreditCardTransactionResultCollection[0].CreditCard.InstantBuyKey;
            clickPromise.finish(request.status, {id: token, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: response.ErrorReport});
    }.bind(this);

    request.onerror = function() {
        console.log(request);
    };

    request.send(JSON.stringify(this.formatRequest(clickPromise.clickbusPayments)));
}

MundiPagg.prototype.formatRequest = function(clickbusPayments) {
    return {
        CreditCardTransactionCollection: [
            {
                AmountInCents: clickbusPayments.getAmount(),
                CreditCard: {
                    CreditCardBrand: clickbusPayments.getCardBrand(),
                    CreditCardNumber: clickbusPayments.getCreditCard(),
                    ExpMonth: clickbusPayments.getExpirationMonth(),
                    ExpYear: clickbusPayments.getExpirationYear(),
                    HolderName: clickbusPayments.getHolderName(),
                    SecurityCode: clickbusPayments.getSecurityCode()
                },
                CreditCardOperation: "AuthOnly",
                InstallmentCount: clickbusPayments.getInstallment()
            }
        ]
    }
}
