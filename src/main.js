"use strict";

/**
 * Created by tiagobutzke on 6/30/15.
 */

/**
 * Initialize a `ClickbusPayments` with the given `options`.
 *
 * Not Required:
 *
 *  - `paymentFormId`           HTML form id
 *  - `tokenFieldId`            HTML hidden field id where we'll put the generated token
 *  - `creditcardFieldId`       HTML field id for creditcard number, default credit_card
 *  - `securityCodeFieldId`     HTML field id for creditcard security code number, default security_code
 *  - `expirationMonthFieldId`  HTML field id for creditcard expiration month, default expiration_month
 *  - `expirationYearFieldId`   HTML field id for creditcard expiration year, default expiration_year
 *  - `holderNameFieldId`       HTML field id for creditcard holder name, default holder_name
 *  - `docTypeFieldId`          HTML field id for creditcard holder document type, default doc_type
 *  - `docNumberFieldId`        HTML field id for creditcard holder document number, default doc_number
 *
 * @param {Object} options
 * @api public
 */
function ClickBusPayments(options) {
    this.options = {
        paymentFormId: "payment_form",
        tokenFieldId: "token",
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

    this.updateForm();
    loadScript(config.javascript_url, function() { return this.start()}.bind(this));
}

ClickBusPayments.prototype.done = function(status, response) {
    var tokenElement = document.getElementById(this.options['tokenFieldId']);
    console.log(status);
    console.log(response);
};

ClickBusPayments.prototype.generateToken = function(event) {
    event.preventDefault();
    var form = document.getElementById(this.options['paymentFormId']);
    Mercadopago.createToken(form, function(status, response) { return this.done(status, response) }.bind(this));

    return false;
};

ClickBusPayments.prototype.start = function() {
    Mercadopago.setPublishableKey(config.public_key);
    this.loaded = true;

    addEvent(
        document.getElementById(this.options['paymentFormId']),
        'submit',
        function() { return this.generateToken(event) }.bind(this)
    );
};

ClickBusPayments.prototype.updateForm = function() {
    this.options = merge(this.options, arguments[0]);

    for (var fieldId in this.options) {
        var element = document.getElementById(this.options[fieldId]);

        if (!element) {
            var errorMessage = this.options[fieldId] + ' is required';
            throw new Error(errorMessage);
        }

        if (this.attributeNames[fieldId]) {
            element.setAttribute('data-checkout', this.attributeNames[fieldId]);
        }
    }
};
