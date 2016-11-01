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
 *  - `creditcardFieldClass`       HTML field clas for creditcard number, default credit_card
 *  - `securityCodeFieldClass`     HTML field clas for creditcard security code number, default security_code
 *  - `expirationMonthFieldClass`  HTML field clas for creditcard expiration month, default expiration_month
 *  - `expirationYearFieldClass`   HTML field clas for creditcard expiration year, default expiration_year
 *  - `holderNameFieldClass`       HTML field clas for creditcard holder name, default holder_name
 *  - `docTypeFieldClass`          HTML field clas for creditcard holder document type, default doc_type
 *  - `docNumberFieldClass`        HTML field clas for creditcard holder document number, default doc_number
 *  - `amountFieldClass`           HTML field clas for amount value, default amount
 *  - `installmentFieldClass`           HTML field id for install value, default installment
 *
 * @param {Object} options
 * @api public
 */
function ClickBusPayments() {
    this.options = {
        paymentFormId: "payment_form",
        creditcardFieldClass: "credit_card",
        securityCodeFieldClass: "security_code",
        expirationMonthFieldClass: "expiration_month",
        expirationYearFieldClass: "expiration_year",
        holderNameFieldClass: "holder_name",
        docTypeFieldClass: "doc_type",
        docNumberFieldClass: "doc_number",
        amountFieldClass: "amount"
    };

    this.optionalValues = {
        amountFieldClass: false,
        installmentFieldClass: false
    };

    this.gateways = [];

    this.personalizedOptions = arguments;

    this.clickPromise = [];

    this.successResponse = {};
    this.errorResponse = {};

    this.updateForm();
}

ClickBusPayments.prototype.init = function() {
    this.start();
};

ClickBusPayments.prototype.setPaymentFormId = function(paymentFormId) {
    this.options.paymentFormId = paymentFormId;
    this.personalizedOptions[0].paymentFormId = paymentFormId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setCreditcardFieldClass = function(creditcardFieldClass) {
    this.options.creditcardFieldClass = creditcardFieldClass;
    this.personalizedOptions[0].creditcardFieldClass = creditcardFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setSecurityCodeFieldClass = function(securityCodeFieldClass) {
    this.options.securityCodeFieldClass = securityCodeFieldClass;
    this.personalizedOptions[0].securityCodeFieldClass = securityCodeFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setExpirationMonthFieldClass = function(expirationMonthFieldClass) {
    this.options.expirationMonthFieldClass = expirationMonthFieldClass;
    this.personalizedOptions[0].expirationMonthFieldClass = expirationMonthFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setExpirationYearFieldClass = function(expirationYearFieldClass) {
    this.options.expirationYearFieldClass = expirationYearFieldClass;
    this.personalizedOptions[0].expirationYearFieldClass = expirationYearFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setHolderNameFieldClass = function(holderNameFieldClass) {
    this.options.holderNameFieldClass = holderNameFieldClass;
    this.personalizedOptions[0].holderNameFieldClass = holderNameFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setDocTypeFieldClass = function(docTypeFieldClass) {
    this.options.docTypeFieldClass = docTypeFieldClass;
    this.personalizedOptions[0].docTypeFieldClass = docTypeFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setDocNumberFieldClass = function(docNumberFieldClass) {
    this.options.docNumberFieldClass = docNumberFieldClass;
    this.personalizedOptions[0].docNumberFieldClass = docNumberFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setAmountFieldClass = function(amountFieldClass) {
    this.options.amountFieldClass = amountFieldClass;
    this.personalizedOptions[0].amountFieldClass = amountFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setInstallmentFieldClass = function(installmentFieldClass) {
    this.options.installmentFieldClass = installmentFieldClass;
    this.personalizedOptions[0].installmentFieldClass = installmentFieldClass;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.subscribe = function(gateway) {
    this.gateways.push(gateway);
};

ClickBusPayments.prototype.start = function() {
    this.gateways.forEach(function(gateway) {
        gateway['start']();
    });
};

ClickBusPayments.prototype.updateForm = function() {
    this.options = merge(this.options, this.personalizedOptions[0]);
    for (var fieldClass in this.options) {
        if (this.optionalValues.hasOwnProperty(fieldClass)) {
            continue;
        }

        var elements = document.getElementsByClassName(this.options[fieldClass]);
        if (!elements) {
            var errorMessage = this.options[fieldClass] + ' is required';
            throw new Error(errorMessage);
        }
    }
};

ClickBusPayments.prototype.generateToken = function(gatewayType) {
    var form = document.getElementById(this.options['paymentFormId']);

    this.clickPromise = new ClickPromise(
        function() {
            var gateways = this.clickbusPayments.gateways;
            gateways.forEach(function(gateway) {
                if (gateway.type == gatewayType) {
                    this.totalPromises++;
                    gateway.createToken(form, this);
                }
            }, this);
        },
        this
    );

    return this.clickPromise;
};

ClickBusPayments.prototype.getElement = function(className) {
    var elements = document.getElementsByClassName(className);

    if (elements.length == 0) {
        return false;
    }

    for (var index in elements) {
        var element = elements[index];
        if (element.offsetWidth > 0 && element.offsetHeight) {
            return element;
        }
    }
};

ClickBusPayments.prototype.getCardBrand = function() {
    var brands = [{
            name: 'visa',
            pattern: /^4[0-9]{12}([0-9]{3})?$/
        }, {
            name: 'mastercard',
            pattern: /^(5[1-6][0-9]{14}|(222[1-9][0-9]{2}|2[3-6][0-9]{4}|27[0-1][0-9]{3}|2720[0-9]{2})[0-9]{10})/
        }, {
            name: 'amex',
            pattern: /^3[47][0-9]{13}$/
        }, {
            name: 'diners',
            pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{0,11}$/
        }, {
            name: 'elo',
            pattern: /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|(506699|5067[0-6][0-9]|50677[0-8])|(50900[0-9]|5090[1-9][0-9]|509[1-9][0-9]{2})|65003[1-3]|(65003[5-9]|65004[0-9]|65005[0-1])|(65040[5-9]|6504[1-3][0-9])|(65048[5-9]|65049[0-9]|6505[0-2][0-9]|65053[0-8])|(65054[1-9]|6505[5-8][0-9]|65059[0-8])|(65070[0-9]|65071[0-8])|65072[0-7]|(65090[1-9]|65091[0-9]|650920)|(65165[2-9]|6516[6-7][0-9])|(65500[0-9]|65501[0-9])|(65502[1-9]|6550[3-4][0-9]|65505[0-8]))[0-9]{10,12}/
        },{
            name: 'hipercard',
            pattern: /^((606282[0-9]{10})|(3841[0-9]{0,15}))/
        }
    ];

    var ccNumber = this.getCreditCard();
    for(var key in brands) {
        var brand = brands[key];
        if (ccNumber.match(brand.pattern)) {
            return brand.name;
        }
    }

    return null;
};

ClickBusPayments.prototype.getAmount = function() {
    var amount = this.getElement(this.options.amountFieldClass);

    if (!amount) {
        throw new Error('amountFieldClass is required');
    }

    return amount.value.replace(/[ .]/g, '');
};

ClickBusPayments.prototype.getInstallment = function() {
    var installment = this.getElement(this.options.installmentFieldClass);

    if (!installment) {
        throw new Error('installmentFieldClass is required');
    }

    return installment.value;
};

ClickBusPayments.prototype.getHolderName = function() {
    var holderName = this.getElement(this.options.holderNameFieldClass);

    if (!holderName) {
        throw new Error('holderNameFieldClass is required');
    }

    return holderName.value;
};

ClickBusPayments.prototype.getCreditCard = function() {
    var ccNumber = this.getElement(this.options.creditcardFieldClass);

    if (!ccNumber) {
        throw new Error('creditcardFieldClass is required');
    }

    return ccNumber.value.replace(/[ .-]/g, '');
};

ClickBusPayments.prototype.getExpirationMonth = function() {
    var expirationMonth = this.getElement(this.options.expirationMonthFieldClass);

    if (!expirationMonth) {
        throw new Error('expirationMonthFieldClass is required');
    }

    return expirationMonth.value;
};

ClickBusPayments.prototype.getExpirationYear = function() {
    var expirationYear = this.getElement(this.options.expirationYearFieldClass);

    if (!expirationYear) {
        throw new Error('expirationYearFieldClass is required');
    }

    return expirationYear.value;
};

ClickBusPayments.prototype.getSecurityCode = function() {
    var securityCode = this.getElement(this.options.securityCodeFieldClass);

    if (!securityCode) {
        throw new Error('securityCodeFieldClass is required');
    }

    return securityCode.value;
};
