"use strict";

/**
 * Created by tiagobutzke on 7/2/15.
 */
function ClickPromise(callable, clickbusPayments) {
    this.callable = callable;
    this.clickbusPayments = clickbusPayments;

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
        if (status == 201) {
            this.callbackSuccess({
                token: response.id,
                payment_method: this.clickbusPayments.paymentMethodId
            });
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

"use strict";

/**
 * Created by tiagobutzke on 6/30/15.
 */
var config = {
    javascript_url: "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10,
    public_key: {
        test: "TEST-c24e58b1-a4e0-40f6-adb4-a6ca7cf60209",
        live: "APP_USR-41ff8f64-11f2-47d7-91fb-ca4db9086c15"
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

ClickBusPayments.prototype.setPaymentFormId = function(paymentFormId) {
    this.options.paymentFormId = paymentFormId;
    this.personalizedOptions[0].paymentFormId = paymentFormId;
    this.updateForm();
    return this;
};

ClickBusPayments.prototype.setCreditcardFieldId = function(creditcardFieldId) {
    this.options.creditcardFieldId = creditcardFieldId;
    this.personalizedOptions[0].creditcardFieldId = creditcardFieldId;
    this.updateForm();
    return this;
};

ClickBusPayments.prototype.setSecurityCodeFieldId = function(securityCodeFieldId) {
    this.options.securityCodeFieldId = securityCodeFieldId;
    this.personalizedOptions[0].securityCodeFieldId = securityCodeFieldId;
    this.updateForm();
    return this;
};

ClickBusPayments.prototype.setExpirationMonthFieldId = function(expirationMonthFieldId) {
    this.options.expirationMonthFieldId = expirationMonthFieldId;
    this.personalizedOptions[0].expirationMonthFieldId = expirationMonthFieldId;
    this.updateForm();
    return this;
};

ClickBusPayments.prototype.setExpirationYearFieldId = function(expirationYearFieldId) {
    this.options.expirationYearFieldId = expirationYearFieldId;
    this.personalizedOptions[0].expirationYearFieldId = expirationYearFieldId;
    this.updateForm();
    return this;
};

ClickBusPayments.prototype.setHolderNameFieldId = function(holderNameFieldId) {
    this.options.holderNameFieldId = holderNameFieldId;
    this.personalizedOptions[0].holderNameFieldId = holderNameFieldId;
    this.updateForm();
    return this;
};

ClickBusPayments.prototype.setDocTypeFieldId = function(docTypeFieldId) {
    this.options.docTypeFieldId = docTypeFieldId;
    this.personalizedOptions[0].docTypeFieldId = docTypeFieldId;
    this.updateForm();
    return this;
};

ClickBusPayments.prototype.setDocNumberFieldId = function(docNumberFieldId) {
    this.options.docNumberFieldId = docNumberFieldId;
    this.personalizedOptions[0].docNumberFieldId = docNumberFieldId;
    this.updateForm();
    return this;
};

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
    var documentNumber = form.getElementById(this.options.docNumberFieldId);
    form.getElementById(this.options.docNumberFieldId)
        .setAttribute('value', documentNumber.replace(/[^0-9\.]+/g, ''));

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