"use strict";

/**
 * Created by tiagobutzke on 6/30/15.
 */
var config = {
    javascript_url: "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"
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
function ClickBusPayments(options) {
    this.done = false;

    if (!options.creditcardFieldId) throw new Error('creditcardFieldId is required');
    if (!options.securityCodeFieldId) throw new Error('securityCodeFieldId is required');
    if (!options.expirationMonthFieldId) throw new Error('expirationMonthFieldId is required');
    if (!options.expirationYearFieldId) throw new Error('expirationYearFieldId is required');
    if (!options.holderNameFieldId) throw new Error('holderNameFieldId is required');
    if (!options.docTypeFieldId) throw new Error('docTypeFieldId is required');
    if (!options.docNumberFieldId) throw new Error('docNumberFieldId is required');

    loadScript(config.javascript_url, function() { return this.start }.bind(this));
};

ClickBusPayments.prototype.start = function() {
    console.log('Script ready');
    this.done = true;
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
