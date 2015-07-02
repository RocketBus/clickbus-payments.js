"use strict";

/**
 * Created by tiagobutzke on 6/30/15.
 */
var config = {
    javascript_url: "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10,
    public_key: "TEST-113119e6-0844-9263-e053-0f4910ac9c07"
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
function ClickBusPayments(options) {
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

    this.loaded = false;

    this.callbackSuccess = function() {};
    this.callbackFail = function() {};
    this.callbackDone = function() {};

    this.updateForm();
    loadScript(config.javascript_url, function() { return this.start() }.bind(this));
}

ClickBusPayments.prototype.finish = function(status, response) {
    console.log(response);

    try {
        if (status == 201) {
            this.callbackSuccess(response.id);
        } else {
            //var errors = [];
            //for (var cause in response.cause) {
            //    errors.push(response.cause[cause]['description']);
            //}
            this.callbackFail('abcd');
        }
    } catch (e) {
        console.log(e);
        this.callbackFail(e);
    }

    this.callbackDone();
};

ClickBusPayments.prototype.generateToken = function(event) {
    var form = document.getElementById(this.options['paymentFormId']);
    Mercadopago.createToken(form, function(status, response) { return this.finish(status, response) }.bind(this));

    return this;
};

ClickBusPayments.prototype.start = function() {
    Mercadopago.setPublishableKey(config.public_key);
    this.loaded = true;
};

ClickBusPayments.prototype.success = function(callback) {
    this.callbackSuccess = callback;
    return this;
};

ClickBusPayments.prototype.fail = function(callback) {
    this.callbackFail = callback;
    return this;
};


ClickBusPayments.prototype.done = function(callback) {
    this.callbackDone = callback;
    return this;
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