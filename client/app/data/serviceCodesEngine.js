const Bloodhound = require('typeahead.js/dist/bloodhound.js');
var serviceCodesEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: []
});
serviceCodesEngine.initialize();

require('./loadServiceCodes')(function(data) {
  var array = new Array(_.size(data));
  _.each(data, function(sc, i) {
    array[i] = sc.name;
  });
  serviceCodesEngine.add(array);
});

module.exports = serviceCodesEngine;

// actual codes initialized in fee-generator.js
