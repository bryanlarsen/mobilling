//= require jquery
//= require angular
//= require angular-route
//= require angular-messages
//= require angular-resource
//= require mobile-angular-ui
//= require ui-utils
//= require angular-rails-templates
//= require uuid
//= require ./mo_billing

angular.element(document).ready(function () {
    angular.bootstrap(document, ["moBilling"]);
});
