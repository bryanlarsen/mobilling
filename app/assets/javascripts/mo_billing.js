//= require_tree ./controllers
//= require_tree ./factories
//= require_tree ./directives
//= require_tree ./templates

angular.module("moBilling", [
    "mobile-angular-ui",
    "ngMessages",
    "ngRoute",
    "moBilling.controllers.claimList",
    "moBilling.controllers.signIn",
    "moBilling.controllers.signOut",
    "moBilling.controllers.signUp",
    "moBilling.directives.confirmation",
    "moBilling.directives.server",
    "moBilling.factories.claim",
    "moBilling.factories.session",
    "moBilling.factories.user",
    "moBilling.templates"
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
            controller: "ClaimListController",
            resolve: {
                claims: function (Claim) {
                    return Claim.fetch();
                }
            }
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

        $rootScope.$on("$routeChangeError", function (event, next, current, error) {
            if (error.status === 401) {
                window.localStorage.removeItem("authenticationToken");
                $location.path("/sign-in");
            }
        });
    });
