/**
 * Created by tiagobutzke on 6/30/15.
 */


QUnit.test('Clickbus instance validations', function(assert) {
    assert.throws(
        function() {
            return new ClickBusPayments({})
        },
        Error,
        'verify if matchs with the Error'
    );
});

QUnit.test('Clickbus javascript injection', function(assert) {
    var done = assert.async();
    var clickbus = new ClickBusPayments({
        creditcardFieldId: "credit_card",
        securityCodeFieldId: "security_code",
        expirationMonthFieldId: "expiration_month",
        expirationYearFieldId: "expiration_year",
        holderNameFieldId: "holder_name",
        docTypeFieldId: "doc_type",
        docNumberFieldId: "doc_number"
    });

    setTimeout(function() {
        assert.ok(clickbus.done);
        done();
    }, 500);
});
