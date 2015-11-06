const Bloodhound = require('typeahead.js/dist/bloodhound.js');

const diagnosesEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  prefetch: {
    url: window.ENV.API_ROOT+'v1/diagnoses.json',
  }
});
setTimeout(function() {
  diagnosesEngine.initialize();
}, 500);

module.exports = diagnosesEngine;
