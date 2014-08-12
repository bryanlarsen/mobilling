//= require_self
//= require ./constants
//= require ./router
//= require_tree ./controllers
//= require_tree ./factories
//= require_tree ./directives
//= require_tree ./templates

angular.module("moBilling", [
    "mobile-angular-ui.directives.navbars",
    "mobile-angular-ui.directives.overlay",
    "mobile-angular-ui.directives.sidebars",
    "mobile-angular-ui.directives.toggle",
    "mobile-angular-ui.fastclick",
    "mobile-angular-ui.scrollable",
    "siyfion.sfTypeahead",
    "ui.unique",
    "ngMessages",
    "ngResource",
    "ngRoute",
    "moBilling.constants",
    "moBilling.controllers",
    "moBilling.directives",
    "moBilling.factories",
    "moBilling.templates"
]);
angular.module("moBilling.constants", []);
angular.module("moBilling.controllers", []);
angular.module("moBilling.directives", []);
angular.module("moBilling.factories", []);
