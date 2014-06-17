//= require_tree ./controllers
//= require_tree ./factories
//= require_tree ./templates

angular.module("moBilling", ["ngRoute", "mobile-angular-ui", "moBilling.templates", "moBilling.controllers", "moBilling.factories"])

    .config(function ($routeProvider) {
        $routeProvider.when("/sign-in", {
            templateUrl: "sign-in.html",
            controller: "SignInController"
        });

        $routeProvider.otherwise({
            redirectTo: "/sign-in"
        });
    });
