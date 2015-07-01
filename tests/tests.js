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

    var fields = '<form action="" id="payment_form" method="POST"/>' +
        '<input type="hidden" id="token" />' +
        '<input type="text" id="credit_card" />' +
        '<input type="text" id="security_code" />' +
        '<input type="text" id="expiration_month" />' +
        '<input type="text" id="expiration_year" />' +
        '<input type="text" id="holder_name" />' +
        '<input type="text" id="doc_type" />' +
        '<input type="text" id="doc_number" />' +
        '</form>';

    document.getElementById('qunit-fixture').innerHTML = fields;

    var clickbus = new ClickBusPayments();

    setTimeout(function() {
        assert.ok(clickbus.loaded);
        done();
    }, 1500);
});
