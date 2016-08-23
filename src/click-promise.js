"use strict";

/**
 * Created by tiagobutzke on 7/2/15.
 */
function ClickPromise(callable, clickbusPayments) {
    this.callable = callable;
    this.clickbusPayments = clickbusPayments;
    this.count = 0;

    this.callbackSuccess = function() {};
    this.callbackFail = function() {};
}

ClickPromise.prototype.success = function(callback) {
    this.callbackSuccess = callback;
    return this;
};

ClickPromise.prototype.fail = function(callback) {
    this.callbackFail = callback;
    return this;
};

ClickPromise.prototype.call = function() {
    this.callable();
};

ClickPromise.prototype.finish = function(status, response) {
    try {
        if (status == 201 || status == 200) {

            if (this.clickbusPayments.paymentMethodId === 'master') {
                this.clickbusPayments.paymentMethodId = 'mastercard';
            }

            var responseSuccessObject = {
                name: response.name,
                token: response.id,
                payment_method: this.clickbusPayments.paymentMethodId
            };

            this.count++;
            this.clickbusPayments.token[response.name] = responseSuccessObject;
            if (this.count == this.clickbusPayments.handlers.length) {
                this.callbackSuccess(this.clickbusPayments.token);
            }
        } else {
            var errors = [];
            for (var cause in response.cause) {
                var error = {
                    code: response.cause[cause]['code'],
                    description: response.cause[cause]['description']
                };
                errors.push(error);
            }
            this.callbackFail(errors);
        }
    } catch (e) {
        this.callbackFail([e]);
    }
};
