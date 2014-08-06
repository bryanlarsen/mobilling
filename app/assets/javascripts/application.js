//= require jquery
//= require overthrow
//= require fastclick
//= require bloodhound
//= require typeahead.jquery
//= require angular
//= require angular-route
//= require angular-messages
//= require angular-resource
//= require angular-typeahead
//= require mobile-angular-ui/navbars
//= require mobile-angular-ui/overlay
//= require mobile-angular-ui/sidebars
//= require mobile-angular-ui/toggle
//= require mobile-angular-ui/fastclick
//= require mobile-angular-ui/scrollable
//= require ui-utils
//= require angular-rails-templates
//= require uuid
//= require lodash
//= require bootstrap-datepicker
//= require date.format
//= require modernizr
//= require ./mo_billing

angular.element(document).ready(function () {
    angular.bootstrap(document, ["moBilling"]);
});
