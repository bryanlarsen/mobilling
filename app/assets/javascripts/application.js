//= require jquery
//= require jquery.scrollIntoView
//= require overthrow
//= require bloodhound
//= require typeahead
// require fastclick
//= require angular
//= require angular-route
//= require angular-messages
//= require angular-resource
//= require angular-typeahead
//= require angular-filter-pack
//= require mobile-angular-ui/navbars
//= require mobile-angular-ui/overlay
//= require mobile-angular-ui/sidebars
//= require mobile-angular-ui/toggle
// require mobile-angular-ui/fastclick
//= require mobile-angular-ui/scrollable
//= require pickadate/picker
//= require pickadate/picker.date
//= require pickadate/picker.time
// require gestures
//= require ui-utils
//= require angular-rails-templates
//= require ./mo_billing

angular.element(document).ready(function () {
    angular.bootstrap(document, ["moBilling"]);
});
