"use strict";function ClickPromise(t,e){this.callable=t,this.clickbusPayments=e,this.errorPromises=0,this.successPromises=0,this.totalPromises=e.gateways.length,this.callbackSuccess=function(){},this.callbackFail=function(){}}function ClickBusPayments(){this.options={paymentFormId:"payment_form",creditcardFieldId:"credit_card",securityCodeFieldId:"security_code",expirationMonthFieldId:"expiration_month",expirationYearFieldId:"expiration_year",holderNameFieldId:"holder_name",docTypeFieldId:"doc_type",docNumberFieldId:"doc_number",amountFieldId:"amount"},this.attributeNames={creditcardFieldId:"cardNumber",securityCodeFieldId:"securityCode",expirationMonthFieldId:"cardExpirationMonth",expirationYearFieldId:"cardExpirationYear",holderNameFieldId:"cardholderName",docTypeFieldId:"docType",docNumberFieldId:"docNumber"},this.optionalValues={amountFieldId:!1,installmentFieldId:!1},this.gateways=[],this.personalizedOptions=arguments,this.clickPromise=[],this.successResponse={},this.errorResponse={},this.updateForm()}function addEvent(t,e,i){t.addEventListener?t.addEventListener(e,i):t.attachEvent("on"+e,function(){i.call(t)})}function loadScript(t,e){var i=document.getElementsByTagName("head")[0],s=document.createElement("script");s.type="text/javascript",s.src=t,s.onreadystatechange=e,s.onload=e,i.appendChild(s)}function merge(t,e){if(!(arguments[0]&&arguments[0]instanceof Object))return t;for(var i in e)t[i]=e[i];return t}function MercadoPago(t){this.type="creditcard",this.name="mercadopago",this.publicKey=t,this.gatewayUrl="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache="+10*Math.random()}function MundiPagg(t,e){this.type="creditcard",this.name="mundipagg",this.publicKey=t}ClickPromise.prototype.success=function(t){return this.callbackSuccess=t,this},ClickPromise.prototype.fail=function(t){return this.callbackFail=t,this},ClickPromise.prototype.call=function(){this.callable()},ClickPromise.prototype.finish=function(t,e){try{if(201==t||200==t){var i={name:e.name,token:e.id,brand:e.brand};this.successPromises++,this.clickbusPayments.successResponse[e.name]=i}else this.errorPromises++,this.clickbusPayments.errorResponse[e.name]=e.cause}catch(t){this.errorPromises++,this.clickbusPayments.errorResponse[e.name]=[t]}finally{if(this.errorPromises==this.totalPromises)return void this.callbackFail(this.clickbusPayments.errorResponse);this.successPromises+this.errorPromises==this.totalPromises&&this.callbackSuccess(this.clickbusPayments.successResponse)}},ClickBusPayments.prototype.init=function(){this.start()},ClickBusPayments.prototype.setPaymentFormId=function(t){return this.options.paymentFormId=t,this.personalizedOptions[0].paymentFormId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setCreditcardFieldId=function(t){return this.options.creditcardFieldId=t,this.personalizedOptions[0].creditcardFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setSecurityCodeFieldId=function(t){return this.options.securityCodeFieldId=t,this.personalizedOptions[0].securityCodeFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setExpirationMonthFieldId=function(t){return this.options.expirationMonthFieldId=t,this.personalizedOptions[0].expirationMonthFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setExpirationYearFieldId=function(t){return this.options.expirationYearFieldId=t,this.personalizedOptions[0].expirationYearFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setHolderNameFieldId=function(t){return this.options.holderNameFieldId=t,this.personalizedOptions[0].holderNameFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setDocTypeFieldId=function(t){return this.options.docTypeFieldId=t,this.personalizedOptions[0].docTypeFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setDocNumberFieldId=function(t){return this.options.docNumberFieldId=t,this.personalizedOptions[0].docNumberFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setAmountFieldId=function(t){return this.options.amountFieldId=t,this.personalizedOptions[0].amountFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setInstallmentFieldId=function(t){return this.options.installmentFieldId=t,this.personalizedOptions[0].installmentFieldId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.subscribe=function(t){this.gateways.push(t)},ClickBusPayments.prototype.start=function(){this.gateways.forEach(function(t){t.start()})},ClickBusPayments.prototype.updateForm=function(){this.options=merge(this.options,this.personalizedOptions[0]);for(var t in this.options)if(!this.optionalValues.hasOwnProperty(t)){var e=document.getElementById(this.options[t]);if(!e){var i=this.options[t]+" is required";throw new Error(i)}this.attributeNames[t]&&e.setAttribute("data-checkout",this.attributeNames[t])}},ClickBusPayments.prototype.generateToken=function(t){for(var e=document.getElementById(this.options.paymentFormId),i=e.getElementsByTagName("input"),s=0;s<i.length;s++)if(i[s].id==this.options.docNumberFieldId){var r=i[s].value;i[s].value=r.replace(/[^0-9]+/g,"")}return this.clickPromise=new ClickPromise(function(){var i=this.clickbusPayments.gateways;i.forEach(function(i){i.type==t&&i.createToken(e,this)},this)},this),this.clickPromise},ClickBusPayments.prototype.getCardBrand=function(){var t=[{name:"visa",pattern:/^4/},{name:"mastercard",pattern:/^5[1-5][0-9][0-9]/},{name:"amex",pattern:/^3[47]/},{name:"diners",pattern:/^3(?:0[0-5]|[68][0-9])/},{name:"elo",pattern:/^401178|^401179|^431274|^438935|^451416|^457393|^457631|^457632|^504175|^627780|^636297|^636368|^(506699|5067[0-6]\d|50677[0-8])|^(50900\d|5090[1-9]\d|509[1-9]\d{2})|^65003[1-3]|^(65003[5-9]|65004\d|65005[0-1])|^(65040[5-9]|6504[1-3]\d)|^(65048[5-9]|65049\d|6505[0-2]\d|65053     [0-8])|^(65054[1-9]|6505[5-8]\d|65059[0-8])|^(65070\d|65071[0-8])|^65072[0-7]|^(65090[1-9]|65091\d|650920)|^(65165[2-9]|6516[6-7]\d)|^(65500\d|65501\d)|^(65502[1-9]|6550[3-4]\d|65505[0-8])/},{name:"hipercard",pattern:/^3841[046]0|^60/}],e=this.getCreditCard();for(var i in t){var s=t[i];if(e.match(s.pattern))return s.name}return null},ClickBusPayments.prototype.getAmount=function(){var t=document.getElementById(this.options.amountFieldId);if(!t)throw new Error("amountFieldId is required");return t.value.replace(/[ .]/g,"")},ClickBusPayments.prototype.getInstallment=function(){var t=document.getElementById(this.options.installmentFieldId);if(!t)throw new Error("installmentFieldId is required");return t.value},ClickBusPayments.prototype.getHolderName=function(){var t=document.getElementById(this.options.holderNameFieldId);if(!t)throw new Error("holderNameFieldId is required");return t.value},ClickBusPayments.prototype.getCreditCard=function(){var t=document.getElementById(this.options.creditcardFieldId);if(!t)throw new Error("creditcardFieldId is required");return t.value.replace(/[ .-]/g,"")},ClickBusPayments.prototype.getExpirationMonth=function(){var t=document.getElementById(this.options.expirationMonthFieldId);if(!t)throw new Error("expirationMonthFieldId is required");return t.value},ClickBusPayments.prototype.getExpirationYear=function(){var t=document.getElementById(this.options.expirationYearFieldId);if(!t)throw new Error("expirationYearFieldId is required");return t.value},ClickBusPayments.prototype.getSecurityCode=function(){var t=document.getElementById(this.options.securityCodeFieldId);if(!t)throw new Error("securityCodeFieldId is required");return t.value},MercadoPago.prototype.start=function(){loadScript(this.gatewayUrl,function(){Mercadopago.setPublishableKey(this.publicKey)}.bind(this))},MercadoPago.prototype.createToken=function(t,e){var i=e.clickbusPayments;i.successResponse.hasOwnProperty(this.name)&&this.clearSession(),Mercadopago.createToken(t,function(t,s){s.name=this.name,s.brand=i.getCardBrand(),e.finish(t,s)}.bind(this))},MercadoPago.prototype.clearSession=function(){Mercadopago.clearSession()},MundiPagg.prototype.start=function(){},MundiPagg.prototype.clearSession=function(){},MundiPagg.prototype.createToken=function(t,e){var i=e.clickbusPayments,s=new XMLHttpRequest;s.open("POST","https://sandbox.mundipaggone.com/Sale/"),s.setRequestHeader("Content-Type","application/json"),s.setRequestHeader("Accept","application/json"),s.setRequestHeader("MerchantKey",this.publicKey),s.onload=function(){var t=JSON.parse(s.response);if(201==s.status){var r=i.getCardBrand(),o=t.CreditCardTransactionResultCollection[0].CreditCard.InstantBuyKey;e.finish(s.status,{id:o,name:this.name,brand:r})}e.finish(s.status,{name:this.name,cause:t.ErrorReport})}.bind(this),s.onerror=function(){console.log(s)},s.send(JSON.stringify(this.formatRequest(e.clickbusPayments)))},MundiPagg.prototype.formatRequest=function(t){return{CreditCardTransactionCollection:[{AmountInCents:t.getAmount(),CreditCard:{CreditCardBrand:t.getCardBrand(),CreditCardNumber:t.getCreditCard(),ExpMonth:t.getExpirationMonth(),ExpYear:t.getExpirationYear(),HolderName:t.getHolderName(),SecurityCode:t.getSecurityCode()},CreditCardOperation:"AuthOnly",InstallmentCount:t.getInstallment()}]}};