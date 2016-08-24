"use strict";

/**
 * Created by tiagobutzke on 7/2/15.
 */
function ClickPromise(callable, clickbusPayments) {
    this.callable = callable;
    this.clickbusPayments = clickbusPayments;

    this.errorPromises = 0;
    this.successPromises = 0;
    this.totalPromises = clickbusPayments.gateways.length;

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
                token: response.id
            };

            this.successPromises++;
            this.clickbusPayments.successResponse[response.name] = responseSuccessObject;
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
            this.callbackSuccess(this.clickbusPayments.successResponse);
        }
    }
};

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
        publicKey: false
    };

    this.gateways = [];

    this.personalizedOptions = arguments;

    this.clickPromise = [];

    this.cardBrand = null;

    this.successResponse = {};
    this.errorResponse = {};

    this.updateForm();
}

ClickBusPayments.prototype.init = function() {
    this.start();
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

    this.successResponse.brand = this.getCardBrand();
    this.clickPromise = new ClickPromise(
        function() {
            var gateways = this.clickbusPayments.gateways;
            gateways.forEach(function(gateway) {
                if (gateway.type == gatewayType) {
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

"use strict";

/**
 * Created by tiagobutzke on 6/30/15.
 */

function addEvent(element, eventName, handler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, handler);
    } else {
        element.attachEvent('on' + eventName, function(){
            handler.call(element);
        });
    }
}

function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

/**
 * Merge secundary array in the primary
 *
 * @param primary
 * @param secundary
 *
 * @returns array
 */
function merge(primary, secundary) {
    if (!arguments[0] || !(arguments[0] instanceof Object)) {
        return primary;
    }

    for (var item in secundary) {
        primary[item] = secundary[item];
    }

    return primary;
}
"use strict";

function MercadoPago(publicKey) {
    this.type = 'creditcard'
    this.name = 'mercadopago';
    this.publicKey = publicKey;
    this.gatewayUrl = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10;
}

MercadoPago.prototype.start = function() {
    loadScript(this.gatewayUrl, function() {
        Mercadopago.setPublishableKey(this.publicKey);
    }.bind(this));
}

MercadoPago.prototype.createToken = function(form, clickPromise) {
    var clickbusPayments = clickPromise.clickbusPayments;
    if (clickbusPayments.successResponse.hasOwnProperty(this.name)) {
        this.clearSession();
    }

    Mercadopago.createToken(form, function(status, response) {
        response.name = this.name;
        clickPromise.finish(status, response);
    }.bind(this));
}

MercadoPago.prototype.clearSession = function() {
    Mercadopago.clearSession();
}

"use strict";

function MundiPagg(publicKey, isTest) {
    this.type = 'creditcard';
    this.name = 'mundipagg';
    this.publicKey = publicKey;
}

MundiPagg.prototype.start = function() { }
MundiPagg.prototype.clearSession = function() { }

MundiPagg.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('POST', 'https://sandbox.mundipaggone.com/Sale/');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('MerchantKey', this.publicKey);
    request.onload = function() {
        var token = null;
        var response = JSON.parse(request.response);
        if (request.status == 201) {
            token = response.CreditCardTransactionResultCollection[0].CreditCard.InstantBuyKey;
            clickPromise.finish(request.status, {id: token, name: this.name});
        }

        clickPromise.finish(request.status, {
            id: token,
            name: this.name,
            cause: response.ErrorReport
        });
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
                InstallmentCount: 1
            }
        ]
    }
}
