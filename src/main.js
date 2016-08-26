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
 *  - `amountFieldId`           HTML field id for amount value, default amount
 *  - `installmentFieldId`           HTML field id for install value, default installment
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
        docNumberFieldId: "doc_number",
        amountFieldId: "amount"
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

    this.optionalValues = {
        amountFieldId: false,
        installmentFieldId: false
    };

    this.gateways = [];
    this.gatewayType = null;

    this.personalizedOptions = arguments;

    this.clickPromise = [];

    this.successResponse = {};
    this.errorResponse = {};

    this.updateForm();
}

ClickBusPayments.prototype.init = function() {
    this.start();
    this.successResponse['token'] = {};
}

ClickBusPayments.prototype.setPaymentFormId = function(paymentFormId) {
    this.options.paymentFormId = paymentFormId;
    this.personalizedOptions[0].paymentFormId = paymentFormId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setCreditcardFieldId = function(creditcardFieldId) {
    this.options.creditcardFieldId = creditcardFieldId;
    this.personalizedOptions[0].creditcardFieldId = creditcardFieldId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setSecurityCodeFieldId = function(securityCodeFieldId) {
    this.options.securityCodeFieldId = securityCodeFieldId;
    this.personalizedOptions[0].securityCodeFieldId = securityCodeFieldId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setExpirationMonthFieldId = function(expirationMonthFieldId) {
    this.options.expirationMonthFieldId = expirationMonthFieldId;
    this.personalizedOptions[0].expirationMonthFieldId = expirationMonthFieldId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setExpirationYearFieldId = function(expirationYearFieldId) {
    this.options.expirationYearFieldId = expirationYearFieldId;
    this.personalizedOptions[0].expirationYearFieldId = expirationYearFieldId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setHolderNameFieldId = function(holderNameFieldId) {
    this.options.holderNameFieldId = holderNameFieldId;
    this.personalizedOptions[0].holderNameFieldId = holderNameFieldId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setDocTypeFieldId = function(docTypeFieldId) {
    this.options.docTypeFieldId = docTypeFieldId;
    this.personalizedOptions[0].docTypeFieldId = docTypeFieldId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setDocNumberFieldId = function(docNumberFieldId) {
    this.options.docNumberFieldId = docNumberFieldId;
    this.personalizedOptions[0].docNumberFieldId = docNumberFieldId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setAmountFieldId = function(amountFieldId) {
    this.options.amountFieldId = amountFieldId;
    this.personalizedOptions[0].amountFieldId = amountFieldId;
    this.updateForm();
    this.start();
    return this;
};

ClickBusPayments.prototype.setInstallmentFieldId = function(installmentFieldId) {
    this.options.installmentFieldId = installmentFieldId;
    this.personalizedOptions[0].installmentFieldId = installmentFieldId;
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

ClickBusPayments.prototype.generateToken = function(gatewayType) {
    var form = document.getElementById(this.options['paymentFormId']);

    var elements = form.getElementsByTagName('input');
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].id == this.options.docNumberFieldId) {
            var documentNumber = elements[i].value;
            elements[i].value = documentNumber.replace(/[^0-9]+/g, '');
        }
    }

    if (gatewayType == 'credit_card') {
        this.successResponse.brand = this.getCardBrand();
    }

    this.gatewayType = gatewayType;

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

ClickBusPayments.prototype.getCardBrand = function() {
    var brands = [{
            name: 'visa',
            pattern: /^4/
        }, {
            name: 'mastercard',
            pattern: /^5[1-5][0-9][0-9]/
        }, {
            name: 'amex',
            pattern: /^3[47]/
        }, {
            name: 'diners',
            pattern: /^3(?:0[0-5]|[68][0-9])/
        }, {
            name: 'elo',
            pattern: /^401178|^401179|^431274|^438935|^451416|^457393|^457631|^457632|^504175|^627780|^636297|^636368|^(506699|5067[0-6]\d|50677[0-8])|^(50900\d|5090[1-9]\d|509[1-9]\d{2})|^65003[1-3]|^(65003[5-9]|65004\d|65005[0-1])|^(65040[5-9]|6504[1-3]\d)|^(65048[5-9]|65049\d|6505[0-2]\d|65053     [0-8])|^(65054[1-9]|6505[5-8]\d|65059[0-8])|^(65070\d|65071[0-8])|^65072[0-7]|^(65090[1-9]|65091\d|650920)|^(65165[2-9]|6516[6-7]\d)|^(65500\d|65501\d)|^(65502[1-9]|6550[3-4]\d|65505[0-8])/
        },{
            name: 'hipercard',
            pattern: /^3841[046]0|^60/
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
}

ClickBusPayments.prototype.getAmount = function() {
    var amount = document.getElementById(this.options.amountFieldId);

    if (!amount) {
        throw new Error('amountFieldId is required');
    }

    return amount.value.replace(/[ .]/g, '');
};

ClickBusPayments.prototype.getInstallment = function() {
    var installment = document.getElementById(this.options.installmentFieldId);

    if (!installment) {
        throw new Error('installmentFieldId is required');
    }

    return installment.value;
};

ClickBusPayments.prototype.getHolderName = function() {
    var holderName = document.getElementById(this.options.holderNameFieldId);

    if (!holderName) {
        throw new Error('holderNameFieldId is required');
    }

    return holderName.value;
};

ClickBusPayments.prototype.getCreditCard = function() {
    var ccNumber = document.getElementById(this.options.creditcardFieldId);

    if (!ccNumber) {
        throw new Error('creditcardFieldId is required');
    }

    return ccNumber.value.replace(/[ .-]/g, '');
};

ClickBusPayments.prototype.getExpirationMonth = function() {
    var expirationMonth = document.getElementById(this.options.expirationMonthFieldId);

    if (!expirationMonth) {
        throw new Error('expirationMonthFieldId is required');
    }

    return expirationMonth.value;
};

ClickBusPayments.prototype.getExpirationYear = function() {
    var expirationYear = document.getElementById(this.options.expirationYearFieldId);

    if (!expirationYear) {
        throw new Error('expirationYearFieldId is required');
    }

    return expirationYear.value;
};

ClickBusPayments.prototype.getSecurityCode = function() {
    var securityCode = document.getElementById(this.options.securityCodeFieldId);

    if (!securityCode) {
        throw new Error('securityCodeFieldId is required');
    }

    return securityCode.value;
};
