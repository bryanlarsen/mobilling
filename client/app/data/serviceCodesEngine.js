const Bloodhound = require('typeahead.js/dist/bloodhound.js');
var serviceCodesEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: []
});
serviceCodesEngine.initialize();

module.exports = serviceCodesEngine;

// actual codes initialized in fee-generator.js
