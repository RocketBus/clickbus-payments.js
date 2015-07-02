/**
 * Created by tiagobutzke on 7/2/15.
 */
function ClickPromise(callable) {
    this.callable = callable;

    this.callbackSuccess = function() {};
    this.callbackFail = function() {};
}

ClickPromise.prototype.success = function(callback) {
    this.callbackSuccess = callback;
    return this;
};

ClickPromise.prototype.fail = function(callback) {
    this.callbackFail = callback;
    return this;
};

ClickPromise.prototype.call = function() {
    this.callable();
};

ClickPromise.prototype.finish = function(status, response) {
    try {
        if (status == 201) {
            this.callbackSuccess(response.id);
        } else {
            var errors = [];
            for (var cause in response.cause) {
                errors.push(response.cause[cause]['description']);
            }
            this.callbackFail(errors);
        }
    } catch (e) {
        this.callbackFail(e);
    }
};
