"use strict";

/**
 * Created by tiagobutzke on 7/2/15.
 */


var ERROR_TEXT = 'error';
var TYPE_CREDIT_CARD = 'credit_card';
var TYPE_DEBIT_CARD = 'debit_card';

function ClickPromise(callable, clickbusPayments) {
    this.callable = callable;
    this.clickbusPayments = clickbusPayments;

    this.errorPromises = 0;
    this.successPromises = 0;
    this.totalPromises = 0;

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
            this.successPromises++;

            if (!this.clickbusPayments.successResponse.hasOwnProperty(response.type)) {
                this.clickbusPayments.successResponse[response.type] = {};
                this.clickbusPayments.successResponse[response.type]['token'] = {};
            }

            if ((response.type == TYPE_CREDIT_CARD && !response.oneClickPayment) || response.type == TYPE_DEBIT_CARD) {
                this.clickbusPayments.successResponse[response.type]['brand'] = this.clickbusPayments.getCardBrand();
            }

            this.clickbusPayments.successResponse[response.type]['token'][response.name] = response.content;
        } else {
            this.errorPromises++;
            this.clickbusPayments.errorResponse[response.name] = response.cause;
        }
    } catch (e) {
        this.errorPromises++;
        this.clickbusPayments.errorResponse[response.name] = [e];
    } finally {
        if (this.errorPromises == this.totalPromises) {
            this.callbackFail(this.clickbusPayments.errorResponse);
            return;
        }

        if ((this.successPromises + this.errorPromises) == this.totalPromises) {
            this.callbackSuccess(this.clickbusPayments.successResponse[response.type]);
        }
    }
};
