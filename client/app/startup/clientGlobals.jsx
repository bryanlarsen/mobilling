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

window.ClaimsBulk = require('./ClaimsBulk');
window.ClaimEdit = require('./ClaimEdit');
window.UserEdit = require('./UserEdit');;
window.NativePatientPage = require('./NativePatientPage');
window.NativeClaimPage = require('./NativeClaimPage');
window.NativeConsultPage = require('./NativeConsultPage');
window.NativeItemsPage = require('./NativeItemsPage');
window.NativeCommentPage = require('./NativeCommentPage');
window.App = App;
