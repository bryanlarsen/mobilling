const ClaimEdit = require('./ClaimEdit');
const UserEdit = require('./UserEdit');
const ClaimsBulk = require('./ClaimsBulk');
const App = require('./ClientApp');
const NativePatientPage = require('./NativePatientPage');

require('pickadate/lib/picker.date');
require('pickadate/lib/picker.time');
require('typeahead.js/dist/typeahead.jquery.js');

$(function() {
  require('fastclick').attach(document.body);
});

window.ClaimsBulk = ClaimsBulk;
window.ClaimEdit = ClaimEdit;
window.UserEdit = UserEdit;
window.NativePatientPage = NativePatientPage;
window.App = App;
