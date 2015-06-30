"use strict";

/**
 * Created by tiagobutzke on 6/30/15.
 */
var config = {
    javascript_url: "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache=" + Math.random() * 10,
    public_key: "TEST-2cc1679a-2c26-4f05-9f77-427ddc5aeaa2"
};

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
function ClickBusPayments() {
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

    loadScript(config.javascript_url, this.start);
};

ClickBusPayments.prototype.start = function() {
    console.log('Script ready');
    this.loaded = true;
    Mercadopago.setPublishableKey(config.public_key);
};

ClickBusPayments.prototype.updateForm = function() {
    for (var fieldId in this.options) {
        var element = document.getElementById(this.options[fieldId]);
        if (!element) throw new Error(this.options[fieldId] + ' is required');
        element.setAttribute('data-checkout', this.attributeNames[fieldId]);
    }
}

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
