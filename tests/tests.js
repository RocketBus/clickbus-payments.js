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
        creditcardFieldId: "4111-1111-1111-1111",
        securityCodeFieldId: "737",
        expirationMonthFieldId: "06",
        expirationYearFieldId: "2016",
        holderNameFieldId: "Johnny Cash",
        docTypeFieldId: "CPF",
        docNumberFieldId: "689.466.989-93"
    });

    setTimeout(function() {
        assert.ok(clickbus.done);
        done();
    }, 500);
});
