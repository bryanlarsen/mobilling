const _ = require('underscore');

var callbacks = [];
var data = null;

module.exports = function(callback) {
  if (data) return callback(data);
  return callbacks.push(callback);
};

setTimeout(function() {
  if (!data) {
    fetch(window.ENV.API_ROOT+'v1/service_codes.json')
      .then((response) => response.json()).then((json) => {
        data = json;
        _.each(callbacks, function(callback) {
          return callback(json);
        });
      });
  }
}, 1500);

