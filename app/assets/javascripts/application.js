//= require jquery
//= require overthrow
//= require fastclick
//= require angular
//= require angular-route
//= require angular-messages
//= require angular-resource
//= require mobile-angular-ui/navbars
//= require mobile-angular-ui/overlay
//= require mobile-angular-ui/sidebars
//= require mobile-angular-ui/toggle
//= require mobile-angular-ui/fastclick
//= require mobile-angular-ui/scrollable
//= require ui-utils
//= require angular-rails-templates
//= require uuid
//= require vendor/lodash-2.4.1
//= require vendor/select2
//= require vendor/angular.ui.select2
//= require ./mo_billing

angular.element(document).ready(function () {
    angular.bootstrap(document, ["moBilling"]);
});
