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
    "moBilling.controllers.signOutController",
    "moBilling.controllers.homeController",
    "moBilling.factories.session",
    "moBilling.factories.user",
    "moBilling.factories.authentication",
    "moBilling.directives.server",
    "moBilling.directives.confirmation"
])

    .config(function ($routeProvider) {
        $routeProvider.when("/sign-in", {
            templateUrl: "sign-in.html",
            controller: "SignInController",
            guest: true
        });

        $routeProvider.when("/sign-up", {
            templateUrl: "sign-up.html",
            controller: "SignUpController",
            guest: true
        });

        $routeProvider.when("/sign-out", {
            template: null,
            controller: "SignOutController"
        });

        $routeProvider.when("/", {
            templateUrl: "home.html",
            controller: "HomeController"
        });

        $routeProvider.otherwise({
            redirectTo: "/"
        });
    })

    .run(function ($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            var authenticationToken = window.localStorage.getItem("authenticationToken");

            if (next.guest && authenticationToken) {
                $location.path("/");
            }

            if (!next.guest && !authenticationToken) {
                $location.path("/sign-in");
            }
        });
    });

