//= require jquery/jquery
//= require overthrow/overthrow
//= require bloodhound/bloodhound
//= require typeahead/typeahead
//= require fastclick/fastclick
//= require angular/angular
//= require angular/angular-route
//= require angular/angular-messages
//= require angular/angular-resource
//= require angular-typeahead/angular-typeahead
//= require angular-filter-pack/angular-filter-pack
//= require mobile-angular-ui/navbars
//= require mobile-angular-ui/overlay
//= require mobile-angular-ui/sidebars
//= require mobile-angular-ui/toggle
//= require mobile-angular-ui/fastclick
//= require mobile-angular-ui/scrollable
//= require pickadate/picker
//= require pickadate/picker.date
//= require pickadate/picker.time
//= require gestures/gestures
//= require angular-ui/ui-utils
//= require angular-rails-templates
//= require underscore
//= require angular-underscore
//= require ./mo_billing

angular.element(document).ready(function () {
    angular.bootstrap(document, ["moBilling"]);
});
