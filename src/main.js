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
