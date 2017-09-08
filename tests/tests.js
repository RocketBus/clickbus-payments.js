/**
 * Created by tiagobutzke on 6/30/15.
 */
QUnit.test('Clickbus instance validations', function(assert) {
    assert.throws(
        function() {
            var clickbus = new ClickBusPayments({});
            clickbus.ini();
            return clickbus;
        },
        Error,
        'verify if matchs with the Error'
    );
});

QUnit.test('Clickbus javascript injection', function(assert) {
    var clickbus = new ClickBusPayments();
    clickbus.init();

    assert.ok(clickbus.loaded);
});

QUnit
    .cases([
        {number: '346146306412168', brand: 'amex'},
        {number: '349487300416061', brand: 'amex'},
        {number: '348151112686656', brand: 'amex'},
        {number: '347813217191194', brand: 'amex'},
        {number: '376687503625980', brand: 'amex'},

        {number: '30288990044153', brand: 'diners'},
        {number: '30158162940324', brand: 'diners'},
        {number: '38517497407857', brand: 'diners'},

        { number: '4024007150747', brand: 'visa'},
        { number: '4556606685888', brand: 'visa'},
        { number: '4532846168613', brand: 'visa'},
        { number: '4716343059637', brand: 'visa'},
        { number: '4024007145614', brand: 'visa'},
        { number: '4916447783278', brand: 'visa'},
        { number: '4901723375469763', brand: 'visa'},
        { number: '4551844406411211', brand: 'visa'},
        { number: '4716859376933020', brand: 'visa'},
        { number: '4916657341754226', brand: 'visa'},
        { number: '4532340165621250', brand: 'visa'},
        { number: '4026515910974418', brand: 'visa'},
        { number: '4913445175523310', brand: 'visa'},
        { number: '4913939148893057', brand: 'visa'},
        { number: '4913804650893079', brand: 'visa'},
        { number: '4917903882198384', brand: 'visa'},
        { number: '4508186746649611', brand: 'visa'},
        { number: '4032255013547926', brand: 'visa'},
        { number: '4108630410005182', brand: 'visa'},
        { number: '4096017376482072', brand: 'visa'},
        { number: '482481177015640', brand: 'visa'},

        { number: '508116483483864', brand: 'mastercard'},
        { number: '5021218245053113', brand: 'mastercard'},
        { number: '5899160187114090', brand: 'mastercard'},
        { number: '5401052150626617', brand: 'mastercard'},
        { number: '5162207745651871', brand: 'mastercard'},
        { number: '5162301370773835', brand: 'mastercard'},
        { number: '5232847445855474', brand: 'mastercard'},
        { number: '5899161111606748', brand: 'mastercard'},
        { number: '5162207547413298', brand: 'mastercard'},
        { number: '5293236564511991', brand: 'mastercard'},
        { number: '5149457263007265', brand: 'mastercard'},
        { number: '5162302650674081', brand: 'mastercard'},
        { number: '5264914935699571', brand: 'mastercard'},
        { number: '5521710847483206', brand: 'mastercard'},
        { number: '5311956646211868', brand: 'mastercard'},
        { number: '5420004853273145', brand: 'mastercard'},
        { number: '5118603426653209', brand: 'mastercard'},
        { number: '6988957855960666', brand: 'mastercard'},
        { number: '6762327991665482', brand: 'mastercard'},
        { number: '6881670058593584', brand: 'mastercard'},
        { number: '5038932719203068', brand: 'mastercard'},
        { number: '6304058239126897', brand: 'mastercard'},
        { number: '5899143634566237', brand: 'mastercard'},
        { number: '2221003215406351', brand: 'mastercard'},
        { number: '5153294463086430', brand: 'mastercard'},
        { number: '5321658029340110', brand: 'mastercard'},
        { number: '5547848288642761', brand: 'mastercard'},
        { number: '5413514854661232', brand: 'mastercard'},
        { number: '5436271447363724', brand: 'mastercard'},

        {number: '6062821933605694', brand: 'hipercard'},
        {number: '3841001576508225', brand: 'hipercard'},
        {number: '3841402142538680', brand: 'hipercard'},
        {number: '3841608185234355', brand: 'hipercard'},

        {number: '4389351162478846', brand: 'elo'},
        {number: '5067316735601105', brand: 'elo'},
        {number: '5041751701390781', brand: 'elo'},
        {number: '6362974837849574', brand: 'elo'},
        {number: '4514160253889961', brand: 'elo'},
        {number: '5041759412964091', brand: 'elo'},
        {number: '6363683883752082', brand: 'elo'},
        {number: '6277801718462884', brand: 'elo'}
    ])
    .test('Clickbus detect card brand', function(params, assert) {
        var creditCardElements = document.getElementsByClassName('credit_card');
        creditCardElements[0].value = params.number;

        var clickbus = new ClickBusPayments({
            creditcardFieldClass: 'credit_card',
        });
        clickbus.init();
        assert.equal(clickbus.getCardBrand(), params.brand);
    });
