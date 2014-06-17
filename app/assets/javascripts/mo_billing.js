//= require_tree ./controllers
//= require_tree ./factories
//= require_tree ./directives
//= require_tree ./templates

angular.module("moBilling", [
    "ngRoute",
    "ngMessages",
    "mobile-angular-ui",
    "moBilling.templates",
    "moBilling.controllers.signInController",
    "moBilling.controllers.signUpController",
    "moBilling.factories.session",
    "moBilling.factories.user",
    "moBilling.directives.server",
    "moBilling.directives.confirmation"
])

    .config(function ($routeProvider) {
        $routeProvider.when("/sign-in", {
            templateUrl: "sign-in.html",
            controller: "SignInController"
        });

        $routeProvider.when("/sign-up", {
            templateUrl: "sign-up.html",
            controller: "SignUpController"
        });

        $routeProvider.otherwise({
            redirectTo: "/sign-in"
        });
    });
