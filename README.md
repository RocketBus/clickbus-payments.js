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
         */
        clickbus = new ClickBusPayments({
            securityCodeFieldId: 'security_code_other_id'
        });
    };

    function submitForm(event) {
        event.preventDefault();

        clickbus.generateToken().success(function(response) {
            console.log(response.token);
            console.log(response.payment_method);

        }).fail(function(errors) {
            console.log(errors);

        }).call();

        return false;
    }
</script>
</body>
</html>
```
