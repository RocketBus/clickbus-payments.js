"use strict";

function MundiPagg(publicKey) {
    this.name = 'mundipagg';
    this.publicKey = publicKey;
}

MundiPagg.prototype.start = function() { }

MundiPagg.prototype.createToken = function(form, clickPromise) {
    return clickPromise.finish(201, {id: 123, name: this.name});
}

MundiPagg.prototype.clearSession = function() { }
