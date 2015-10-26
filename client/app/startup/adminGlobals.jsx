import ClaimEdit from './ClaimEdit';

require('pickadate/lib/picker.date');
require('pickadate/lib/picker.time');
require('typeahead.js/dist/typeahead.jquery.js');

$(function() {
  require('fastclick').attach(document.body);
});

window.ClaimEdit = ClaimEdit;
