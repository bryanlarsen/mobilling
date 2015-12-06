import Bloodhound from 'typeahead.js/dist/bloodhound.js';
import _ from 'underscore';
import loadServiceCodes from './loadServiceCodes';

var serviceCodesEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: []
});
serviceCodesEngine.initialize();

loadServiceCodes(function(data) {
  var array = new Array(_.size(data));
  _.each(data, function(sc, i) {
    array[i] = sc.name;
  });
  serviceCodesEngine.add(array);
});

export default serviceCodesEngine;

// actual codes initialized in fee-generator.js
