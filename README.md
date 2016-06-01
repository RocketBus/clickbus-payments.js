## clickbus-payments.js
---
It's the library to be implemented for Clickbus' clients who are integrating with Clickbus' API


## How to use (example)
---
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<form action="" method="POST" id="payment_form" onsubmit="submitForm(event)">
    <p>
        <label>Credit Card: </label>
        <input type="text" id="credit_card" value="4111-1111-1111-1111" />
    </p>
    <p>
        <label>Security Code: </label>
        <input type="text" id="security_code_other_id" value="737" />
    </p>
    <p>
        <label>Expiration Month: </label>
        <input type="text" id="expiration_month" value="06" />
    </p>
    <p>
        <label>Expiration Year: </label>
        <input type="text" id="expiration_year" value="2016" />
    </p>
    <p>
        <label>Holder Name: </label>
        <input type="text" id="holder_name" value="TIAGO B BUTZKE" />
    </p>
    <p>
        <label>Document Type: </label>
        <input type="text" id="doc_type" value="CPF" />
    </p>
    <p>
        <label>Document Number: </label>
        <input type="text" id="doc_number" value="652.641.788-44" />
    </p>
    <p>
        <input type="submit" value="Post form">
    </p>
</form>

<script src="clickbus-payments.js"></script>
<script>
    var clickbus = null;

    window.onload = function() {
        /**
         * If you have some form field with a different ID, just pass like an object in the constructor
         *
         *  - `paymentFormId`           HTML form id
         *  - `creditcardFieldId`       HTML field id for creditcard number, default credit_card
         *  - `securityCodeFieldId`     HTML field id for creditcard security code number, default security_code
         *  - `expirationMonthFieldId`  HTML field id for creditcard expiration month, default expiration_month
         *  - `expirationYearFieldId`   HTML field id for creditcard expiration year, default expiration_year
         *  - `holderNameFieldId`       HTML field id for creditcard holder name, default holder_name
         *  - `docTypeFieldId`          HTML field id for creditcard holder document type, default doc_type
         *  - `docNumberFieldId`        HTML field id for creditcard holder document number, default doc_number
         *  - `test`                    Can be true or false to define the environment
         */
        clickbus = new ClickBusPayments({
            paymentFormId: 'your_payment_form_id',
            creditcardFieldId: 'your_creditcard_field_id',
            securityCodeFieldId: 'security_code_other_id',
            expirationMonthFieldId: 'your_month_field_id',
            expirationYearFieldId: 'your_year_field_id',
            holderNameFieldId: 'your_holder_name_field_id',
            docNumberFieldId: 'your_cpf_field_id',
            test: true
        });
    };

    function submitForm(event) {
        event.preventDefault();

        clickbus.generateToken().success(function(response) {
            console.log(response.token);
            console.log(response.payment_method);

        }).fail(function(errors) {
            for (var error in errors) {
                console.log(errors[error].code);
                console.log(errors[error].description);
            }

        }).call();

        return false;
    }
</script>
</body>
</html>
```

## What if I have my own MercadoPago Public Key?

Please provide your public key, like below:

```javascript
window.onload = function() {
    clickbus = new ClickBusPayments({
        paymentFormId: 'payment_form',
        creditcardFieldId: 'credit_card',
        securityCodeFieldId: 'security_code_other_id',
        expirationMonthFieldId: 'expiration_month',
        expirationYearFieldId: 'expiration_year',
        holderNameFieldId: 'holder_name',
        docTypeFieldId: 'doc_type',
        docNumberFieldId: 'doc_number',
        test: true, // or false, you decide :)
        publicKey: {
            test: "TEST-POTATOESAREAWESOMEWITHCHEESEONIONSANDGARLIC",
            live: "APP_USR-YOUCANSMASHBAKEEVENRAWTHEYAREDELICIOUS"
        }
    });
};
```

Remember that this is optional. If you don't provide the `publicKey` object then this library will use the default keys :wink:.
