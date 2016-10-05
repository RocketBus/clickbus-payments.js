"use strict";function ClickPromise(t,e){this.callable=t,this.clickbusPayments=e,this.errorPromises=0,this.successPromises=0,this.totalPromises=0,this.callbackSuccess=function(){},this.callbackFail=function(){}}function ClickBusPayments(){this.options={paymentFormId:"payment_form",creditcardFieldClass:"credit_card",securityCodeFieldClass:"security_code",expirationMonthFieldClass:"expiration_month",expirationYearFieldClass:"expiration_year",holderNameFieldClass:"holder_name",docTypeFieldClass:"doc_type",docNumberFieldClass:"doc_number",amountFieldClass:"amount"},this.optionalValues={amountFieldClass:!1,installmentFieldClass:!1},this.gateways=[],this.gatewayType=null,this.personalizedOptions=arguments,this.clickPromise=[],this.successResponse={},this.errorResponse={},this.updateForm()}function addEvent(t,e,s){t.addEventListener?t.addEventListener(e,s):t.attachEvent("on"+e,function(){s.call(t)})}function loadScript(t,e){var s=document.getElementsByTagName("head")[0],i=document.createElement("script");i.type="text/javascript",i.src=t,i.onreadystatechange=e,i.onload=e,s.appendChild(i)}function merge(t,e){if(!(arguments[0]&&arguments[0]instanceof Object))return t;for(var s in e)t[s]=e[s];return t}function MercadoPago(t){this.type="credit_card",this.name="mercadoPago",this.publicKey=t,this.gatewayUrl="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js?nocache="+10*Math.random()}function MundiPagg(t,e){this.type="credit_card",this.name="mundipagg",this.publicKey=t}function Paypal(t,e){this.type="paypal",this.name="paypal",this.publicKey=t}function PayZen(){this.type="debit_card",this.name="payzen"}ClickPromise.prototype.success=function(t){return this.callbackSuccess=t,this},ClickPromise.prototype.fail=function(t){return this.callbackFail=t,this},ClickPromise.prototype.call=function(){this.callable()},ClickPromise.prototype.finish=function(t,e){try{201==t||200==t?(this.successPromises++,this.clickbusPayments.successResponse.token[e.name]=e.content):(this.errorPromises++,this.clickbusPayments.errorResponse[e.name]=e.cause)}catch(t){this.errorPromises++,this.clickbusPayments.errorResponse[e.name]=[t]}finally{if(this.errorPromises==this.totalPromises)return void this.callbackFail(this.clickbusPayments.errorResponse);this.successPromises+this.errorPromises==this.totalPromises&&this.callbackSuccess(this.clickbusPayments.successResponse)}},ClickBusPayments.prototype.init=function(){this.start(),this.successResponse.token={}},ClickBusPayments.prototype.setPaymentFormId=function(t){return this.options.paymentFormId=t,this.personalizedOptions[0].paymentFormId=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setCreditcardFieldClass=function(t){return this.options.creditcardFieldClass=t,this.personalizedOptions[0].creditcardFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setSecurityCodeFieldClass=function(t){return this.options.securityCodeFieldClass=t,this.personalizedOptions[0].securityCodeFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setExpirationMonthFieldClass=function(t){return this.options.expirationMonthFieldClass=t,this.personalizedOptions[0].expirationMonthFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setExpirationYearFieldClass=function(t){return this.options.expirationYearFieldClass=t,this.personalizedOptions[0].expirationYearFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setHolderNameFieldClass=function(t){return this.options.holderNameFieldClass=t,this.personalizedOptions[0].holderNameFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setDocTypeFieldClass=function(t){return this.options.docTypeFieldClass=t,this.personalizedOptions[0].docTypeFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setDocNumberFieldClass=function(t){return this.options.docNumberFieldClass=t,this.personalizedOptions[0].docNumberFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setAmountFieldClass=function(t){return this.options.amountFieldClass=t,this.personalizedOptions[0].amountFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.setInstallmentFieldClass=function(t){return this.options.installmentFieldClass=t,this.personalizedOptions[0].installmentFieldClass=t,this.updateForm(),this.start(),this},ClickBusPayments.prototype.subscribe=function(t){this.gateways.push(t)},ClickBusPayments.prototype.start=function(){this.gateways.forEach(function(t){t.start()})},ClickBusPayments.prototype.updateForm=function(){this.options=merge(this.options,this.personalizedOptions[0]);for(var t in this.options)if(!this.optionalValues.hasOwnProperty(t)){var e=document.getElementsByClassName(this.options[t]);if(!e){var s=this.options[t]+" is required";throw new Error(s)}}},ClickBusPayments.prototype.generateToken=function(t){var e=document.getElementById(this.options.paymentFormId);return"credit_card"!=t&&"debit_card"!=t||(this.successResponse.brand=this.getCardBrand()),this.gatewayType=t,this.clickPromise=new ClickPromise(function(){var s=this.clickbusPayments.gateways;s.forEach(function(s){s.type==t&&(this.totalPromises++,s.createToken(e,this))},this)},this),this.clickPromise},ClickBusPayments.prototype.getElement=function(t){var e=document.getElementsByClassName(t);if(0==e.length)return!1;for(var s in e){var i=e[s];if(i.offsetWidth>0&&i.offsetHeight)return i}},ClickBusPayments.prototype.getCardBrand=function(){var t=[{name:"visa",pattern:/^4/},{name:"mastercard",pattern:/^5[0-5][0-9][0-9]/},{name:"amex",pattern:/^3[47]/},{name:"diners",pattern:/^3(?:0[0-5]|[68][0-9])/},{name:"elo",pattern:/^401178|^401179|^431274|^438935|^451416|^457393|^457631|^457632|^504175|^627780|^636297|^636368|^(506699|5067[0-6]\d|50677[0-8])|^(50900\d|5090[1-9]\d|509[1-9]\d{2})|^65003[1-3]|^(65003[5-9]|65004\d|65005[0-1])|^(65040[5-9]|6504[1-3]\d)|^(65048[5-9]|65049\d|6505[0-2]\d|65053     [0-8])|^(65054[1-9]|6505[5-8]\d|65059[0-8])|^(65070\d|65071[0-8])|^65072[0-7]|^(65090[1-9]|65091\d|650920)|^(65165[2-9]|6516[6-7]\d)|^(65500\d|65501\d)|^(65502[1-9]|6550[3-4]\d|65505[0-8])/},{name:"hipercard",pattern:/^3841[046]0|^60/}],e=this.getCreditCard();for(var s in t){var i=t[s];if(e.match(i.pattern))return i.name}return null},ClickBusPayments.prototype.getAmount=function(){var t=this.getElement(this.options.amountFieldClass);if(!t)throw new Error("amountFieldClass is required");return t.value.replace(/[ .]/g,"")},ClickBusPayments.prototype.getInstallment=function(){var t=this.getElement(this.options.installmentFieldClass);if(!t)throw new Error("installmentFieldClass is required");return t.value},ClickBusPayments.prototype.getHolderName=function(){var t=this.getElement(this.options.holderNameFieldClass);if(!t)throw new Error("holderNameFieldClass is required");return t.value},ClickBusPayments.prototype.getCreditCard=function(){var t=this.getElement(this.options.creditcardFieldClass);if(!t)throw new Error("creditcardFieldClass is required");return t.value.replace(/[ .-]/g,"")},ClickBusPayments.prototype.getExpirationMonth=function(){var t=this.getElement(this.options.expirationMonthFieldClass);if(!t)throw new Error("expirationMonthFieldClass is required");return t.value},ClickBusPayments.prototype.getExpirationYear=function(){var t=this.getElement(this.options.expirationYearFieldClass);if(!t)throw new Error("expirationYearFieldClass is required");return t.value},ClickBusPayments.prototype.getSecurityCode=function(){var t=this.getElement(this.options.securityCodeFieldClass);if(!t)throw new Error("securityCodeFieldClass is required");return t.value},MercadoPago.prototype.start=function(){loadScript(this.gatewayUrl,function(){Mercadopago.setPublishableKey(this.publicKey)}.bind(this))},MercadoPago.prototype.createToken=function(t,e){var s=e.clickbusPayments.successResponse.token;s.hasOwnProperty(this.name)&&this.clearSession(),Mercadopago.createToken(t,function(t,s){s.name=this.name,s.content=s.id,e.finish(t,s)}.bind(this))},MercadoPago.prototype.clearSession=function(){Mercadopago.clearSession()},MundiPagg.prototype.start=function(){},MundiPagg.prototype.clearSession=function(){},MundiPagg.prototype.createToken=function(t,e){var s=new XMLHttpRequest;s.open("POST","/payment/token/mundipagg"),s.onload=function(){var t=JSON.parse(s.response);return 201==s.status?void e.finish(s.status,{content:t.token,name:this.name}):void e.finish(s.status,{name:this.name,cause:t.ErrorReport})}.bind(this),s.onerror=function(){},s.send(JSON.stringify(this.formatRequest(e.clickbusPayments)))},MundiPagg.prototype.formatRequest=function(t){return{CreditCardBrand:t.getCardBrand(),CreditCardNumber:t.getCreditCard(),ExpMonth:t.getExpirationMonth(),ExpYear:t.getExpirationYear(),HolderName:t.getHolderName(),SecurityCode:t.getSecurityCode(),IsOneDollarAuthEnabled:!1}},Paypal.prototype.start=function(){},Paypal.prototype.clearSession=function(){},Paypal.prototype.createToken=function(t,e){var s=new XMLHttpRequest;s.open("GET","/payment/token/paypal"),s.onload=function(){var t=JSON.parse(s.response);return 200==s.status?void e.finish(s.status,{content:t,name:this.name}):void e.finish(s.status,{name:this.name,cause:t.ErrorReport})}.bind(this),s.onerror=function(){console.log(s)},s.send()},PayZen.prototype.start=function(){},PayZen.prototype.clearSession=function(){},PayZen.prototype.createToken=function(t,e){var s=new XMLHttpRequest;s.open("POST","/payment/token/debit_card"),s.onload=function(){var t=JSON.parse(s.response);return 200==s.status?void e.finish(s.status,{content:t,name:this.name}):void e.finish(s.status,{name:this.name,cause:t.ErrorReport})}.bind(this),s.onerror=function(){},s.send(JSON.stringify(this.formatRequest(e.clickbusPayments)))},PayZen.prototype.formatRequest=function(t){return{paymentName:this.name,cardBrand:t.getCardBrand(),cardNumber:t.getCreditCard(),cardExpirationMonth:t.getExpirationMonth(),cardExpirationYear:parseInt(t.getExpirationYear(),10)+2e3,cardSecurityCode:t.getSecurityCode()}};