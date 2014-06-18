//= require_tree ./controllers
//= require_tree ./factories
//= require_tree ./directives
//= require_tree ./templates

angular.module("moBilling", [
    "ngRoute",
    "ngMessages",
    "mobile-angular-ui",
    "moBilling.templates",
    "moBilling.controllers.signIn",
    "moBilling.controllers.signUp",
    "moBilling.controllers.signOut",
    "moBilling.controllers.claimList",
    "moBilling.factories.session",
    "moBilling.factories.user",
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
            templateUrl: "claim-list.html",
            controller: "ClaimListController"
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
