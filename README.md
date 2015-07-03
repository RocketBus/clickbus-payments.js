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
        <input type="text" id="security_code" value="737" />
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
        clickbus = new ClickBusPayments();
    };

    function submitForm(event) {
        event.preventDefault();

        clickbus.generateToken().success(function(token) {
            console.log(token);

        }).fail(function(errors) {
            console.log(errors);

        }).call();

        return false;
    }
</script>
</body>
</html>
```
