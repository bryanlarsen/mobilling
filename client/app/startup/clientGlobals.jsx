import ClaimEdit from './ClaimEdit';
import UserEdit from './UserEdit';
import ClaimsBulk from './ClaimsBulk';
import App from './ClientApp';

require('pickadate/lib/picker.date');
require('pickadate/lib/picker.time');
require('typeahead.js/dist/typeahead.jquery.js');

$(function() {
  require('fastclick').attach(document.body);
});

window.ClaimsBulk = ClaimsBulk;
window.ClaimEdit = ClaimEdit;
window.UserEdit = UserEdit;
window.App = App;
