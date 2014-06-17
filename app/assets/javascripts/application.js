//= require angular
//= require angular-route
//= require mobile-angular-ui
//= require angular-rails-templates
//= require ./mobilling
//= require_tree ./templates

angular.element(document).ready(function () {
    angular.bootstrap(document, ["moBilling"]);
});
