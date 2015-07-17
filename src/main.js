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
function ClickBusPayments() {
    this.options = {
        paymentFormId: "payment_form",
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

    this.optionalValues = { test: false };

    this.personalizedOptions = arguments;

    this.loaded = false;

    this.clickPromise = null;

    this.paymentMethodId = null;
    this.test = (typeof this.personalizedOptions[0].test !== 'undefined') ? this.personalizedOptions[0].test : false;

    this.updateForm();
    loadScript(config.javascript_url, function() { return this.start() }.bind(this));
}

ClickBusPayments.prototype.start = function() {
    var public_key = (this.test == true) ? config.public_key.test : config.public_key.live;
    Mercadopago.setPublishableKey(public_key);
    this.loaded = true;

    addEvent(
        document.querySelector('input[data-checkout="cardNumber"]'),
        'keyup',
        function(event) { this.guessingPaymentMethod(event, this) }.bind(this)
    );
    addEvent(
        document.querySelector('input[data-checkout="cardNumber"]'),
        'change',
        function(event) { this.guessingPaymentMethod(event, this) }.bind(this)
    );
};

ClickBusPayments.prototype.updateForm = function() {
    this.options = merge(this.options, this.personalizedOptions[0]);
    for (var fieldId in this.options) {
        if (this.optionalValues.hasOwnProperty(fieldId)) {
            continue;
        }
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

ClickBusPayments.prototype.generateToken = function() {
    var form = document.getElementById(this.options['paymentFormId']);

    this.clickPromise = new ClickPromise(
        function() {
            Mercadopago.createToken(form, function(status, response) { return this.finish(status, response) }.bind(this));
        },
        this
    );

    return this.clickPromise;
};

ClickBusPayments.prototype.getBin = function() {
    var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');

    if (!ccNumber) {
        throw new Error('creditcardFieldId is required');
    }

    return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
};

ClickBusPayments.prototype.setPaymentMethodInfo = function(status, response, object) {
    if (status == 200) {
        object.paymentMethodId = response[0].id;
    }
};

ClickBusPayments.prototype.guessingPaymentMethod = function(event, object) {
    var bin = this.getBin();

    if (event.type == "keyup") {
        if (bin.length >= 6) {
            Mercadopago.getPaymentMethod({
                "bin": bin
            }, function(status, response) { object.setPaymentMethodInfo(status, response, object) }.bind(object));
        }
    } else {
        setTimeout(function() {
            if (bin.length >= 6) {
                Mercadopago.getPaymentMethod({
                    "bin": bin
                }, function(status, response) { object.setPaymentMethodInfo(status, response, object) }.bind(object));
            }
        }, 100);
    }
};
