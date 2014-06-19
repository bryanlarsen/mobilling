//= require ./constants
//= require_tree ./controllers
//= require_tree ./factories
//= require_tree ./directives
//= require_tree ./templates

angular.module("moBilling", [
    "mobile-angular-ui",
    "ngMessages",
    "ngResource",
    "ngRoute",
    "moBilling.constants",
    "moBilling.controllers.claimEdit",
    "moBilling.controllers.claimList",
    "moBilling.controllers.signIn",
    "moBilling.controllers.signOut",
    "moBilling.controllers.signUp",
    "moBilling.directives.confirmation",
    "moBilling.directives.dateFormat",
    "moBilling.directives.server",
    "moBilling.directives.upload",
    "moBilling.factories.claim",
    "moBilling.factories.photo",
    "moBilling.factories.session",
    "moBilling.factories.user",
    "moBilling.templates"
])

    .config(function ($routeProvider) {
        $routeProvider.when("/sign-in", {
            templateUrl: "sign-in.html",
            controller: "SignInController",
            guest: true,
            resolve: {
                session: function (Session) {
                    return new Session();
                }
            }
        });

        $routeProvider.when("/sign-up", {
            templateUrl: "sign-up.html",
            controller: "SignUpController",
            guest: true,
            resolve: {
                user: function (User) {
                    return new User();
                }
            }
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
                    return Claim.query().$promise;
                }
            }
        });

        $routeProvider.when("/claims/new", {
            redirectTo: function (params) {
                return "/claims/" + window.uuid.v4() + "/edit";
            }
        });

        $routeProvider.when("/claims/:claim_id/edit", {
            templateUrl: "claim-edit.html",
            controller: "ClaimEditController",
            resolve: {
                claim: function ($route, Claim) {
                    return Claim.getOrInit({ id: $route.current.params.claim_id });
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
