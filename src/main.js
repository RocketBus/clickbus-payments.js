"use strict";

/**
 * Created by tiagobutzke on 6/30/15.
 */

/**
 * Initialize a `ClickbusPayments` with the given `options`.
 *
 * Required:
 *
 *  - `creditcardFieldId`       HTML field name for creditcard number
 *  - `securityCodeFieldId`     HTML field name for creditcard security code number
 *  - `expirationMonthFieldId`  HTML field name for creditcard expiration month
 *  - `expirationYearFieldId`   HTML field name for creditcard expiration year
 *  - `holderNameFieldId`       HTML field name for creditcard holder name
 *  - `docTypeFieldId`          HTML field name for creditcard holder document type
 *  - `docNumberFieldId`        HTML field name for creditcard holder document number
 *
 * @param {Object} options
 * @api public
 */
function ClickBusPayments(options) {
    this.options = {
        creditcardFieldId: "credit_card",
        securityCodeFieldId: "security_code",
        expirationMonthFieldId: "expiration_month",
        expirationYearFieldId: "expiration_year",
        holderNameFieldId: "holder_name",
        docTypeFieldId: "doc_type",
        docNumberFieldId: "doc_number"
    };

    this.attributeNames = {
        creditcardFieldId: "cardNumber",
        securityCodeFieldId: "securityCode",
        expirationMonthFieldId: "cardExpirationMonth",
        expirationYearFieldId: "cardExpirationYear",
        holderNameFieldId: "cardholderName",
        docTypeFieldId: "docType",
        docNumberFieldId: "docNumber"
    };

    this.loaded = false;

    if (arguments[0] && arguments[0] instanceof Object) {
        for (var argument in arguments[0]) {
            this.options[argument] = arguments[0][argument];
        }
    }

    this.updateForm();
    loadScript(config.javascript_url, function() { return this.start()}.bind(this));
};

ClickBusPayments.prototype.start = function() {
    Mercadopago.setPublishableKey(config.public_key);
    this.loaded = true;
};

ClickBusPayments.prototype.updateForm = function() {
    for (var fieldId in this.options) {
        var element = document.getElementById(this.options[fieldId]);
        if (!element) throw new Error(this.options[fieldId] + ' is required');
        element.setAttribute('data-checkout', this.attributeNames[fieldId]);
    }
}
