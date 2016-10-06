"use strict";

/**
 * Created by tiagobutzke on 7/2/15.
 */
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

            if (response.type == 'credit_card' || response.type == 'debit_card') {
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
            pattern: /^4/
        }, {
            name: 'mastercard',
            pattern: /^5[0-5][0-9][0-9]/
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
    this.type = 'credit_card'
    this.name = 'mercadoPago';
    this.publicKey = publicKey;
    this.gatewayUrl = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10;
}

MercadoPago.prototype.start = function() {
    loadScript(this.gatewayUrl, function() {
        Mercadopago.setPublishableKey(this.publicKey);
    }.bind(this));
};

MercadoPago.prototype.createToken = function(form, clickPromise) {
    var successResponse = clickPromise.clickbusPayments.successResponse;
    if (successResponse.hasOwnProperty(this.type)) {
        this.clearSession();
    }

    Mercadopago.createToken(form, function(status, response) {
        response.name = this.name;
        response.type = this.type;
        response.content = response.id;
        clickPromise.finish(status, response);
    }.bind(this));
};

MercadoPago.prototype.clearSession = function() {
    Mercadopago.clearSession();
};

"use strict";

function MundiPagg(publicKey, isTest) {
    this.type = 'credit_card';
    this.name = 'mundipagg';
    this.publicKey = publicKey;
}

MundiPagg.prototype.start = function() { };
MundiPagg.prototype.clearSession = function() { };

MundiPagg.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('POST', '/payment/token/mundipagg');
    request.onload = function() {
        var response = JSON.parse(request.response);
        if (request.status == 201) {
            clickPromise.finish(request.status, {content: response.token, type: this.type, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: response.ErrorReport});
    }.bind(this);

    request.onerror = function() {

    };

    request.send(JSON.stringify(this.formatRequest(clickPromise.clickbusPayments)));
};

MundiPagg.prototype.formatRequest = function(clickbusPayments) {
    return {
        CreditCardBrand: clickbusPayments.getCardBrand(),
        CreditCardNumber: clickbusPayments.getCreditCard(),
        ExpMonth: clickbusPayments.getExpirationMonth(),
        ExpYear: clickbusPayments.getExpirationYear(),
        HolderName: clickbusPayments.getHolderName(),
        SecurityCode: clickbusPayments.getSecurityCode(),
        IsOneDollarAuthEnabled: false
    }
};

"use strict";

function Paypal(publicKey, isTest) {
    this.type = 'paypal';
    this.name = 'paypal';
    this.publicKey = publicKey;
}

Paypal.prototype.start = function() { };
Paypal.prototype.clearSession = function() { };

Paypal.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('GET', '/payment/token/paypal');
    request.onload = function() {
        var response = JSON.parse(request.response);
        if (request.status == 200) {
            clickPromise.finish(request.status, {content: response, type: this.type, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: response.ErrorReport});
    }.bind(this);

    request.onerror = function() {
        console.log(request);
    };

    request.send();
};

"use strict";

function PayZen() {
    this.type = 'debit_card';
    this.name = 'payzen';
}

PayZen.prototype.start = function() { };
PayZen.prototype.clearSession = function() { };

PayZen.prototype.createToken = function(form, clickPromise) {
    var request = new XMLHttpRequest();
    request.open('POST', '/payment/token/debit_card');
    request.onload = function() {
        var response = JSON.parse(request.response);
        if (request.status == 200) {
            clickPromise.finish(request.status, {content: response, type: this.type, name: this.name});
            return;
        }

        clickPromise.finish(request.status, {name: this.name, cause: response.ErrorReport});
    }.bind(this);

    request.onerror = function() {

    };

    request.send(JSON.stringify(this.formatRequest(clickPromise.clickbusPayments)));
};

PayZen.prototype.formatRequest = function(clickbusPayments) {
    return {
        paymentName: this.name,
        cardBrand: clickbusPayments.getCardBrand(),
        cardNumber: clickbusPayments.getCreditCard(),
        cardExpirationMonth: clickbusPayments.getExpirationMonth(),
        cardExpirationYear: parseInt(clickbusPayments.getExpirationYear(), 10) + 2000,
        cardSecurityCode: clickbusPayments.getSecurityCode()
    }
};
