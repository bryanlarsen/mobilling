//= require jquery
//= require angular
//= require angular-route
//= require angular-messages
//= require angular-resource
//= require mobile-angular-ui
//= require angular-rails-templates
//= require ./mo_billing

angular.element(document).ready(function () {
    angular.bootstrap(document, ["moBilling"]);
});
