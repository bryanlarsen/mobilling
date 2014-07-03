//= require ./constants
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
    "ui.unique",
    "ngMessages",
    "ngResource",
    "ngRoute",
    "moBilling.constants",
    "moBilling.controllers.claimEdit",
    "moBilling.controllers.claimEditClaim",
    "moBilling.controllers.claimEditConsult",
    "moBilling.controllers.claimEditDetails",
    "moBilling.controllers.claimListSaved",
    "moBilling.controllers.claimListUnprocessed",
    "moBilling.controllers.claimNew",
    "moBilling.controllers.signIn",
    "moBilling.controllers.signOut",
    "moBilling.controllers.signUp",
    "moBilling.directives.confirmation",
    "moBilling.directives.date",
    "moBilling.directives.time",
    "moBilling.directives.server",
    "moBilling.directives.upload",
    "moBilling.directives.switch",
    "moBilling.factories.claim",
    "moBilling.factories.dayType",
    "moBilling.factories.detailsGenerator",
    "moBilling.factories.photo",
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
            templateUrl: "loading.html",
            controller: "SignOutController"
        });

        $routeProvider.when("/claims/saved", {
            templateUrl: "claim-list-saved.html",
            controller: "ClaimListSavedController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                }
            }
        });

        $routeProvider.when("/claims/unprocessed", {
            templateUrl: "claim-list-unprocessed.html",
            controller: "ClaimListUnprocessedController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                }
            }
        });

        $routeProvider.when("/claims/new", {
            templateUrl: "loading.html",
            controller: "ClaimNewController"
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

        $routeProvider.when("/claims/:claim_id", {
            templateUrl: "claim-show.html",
            controller: "ClaimEditController",
            resolve: {
                claim: function ($route, Claim) {
                    return Claim.get({ id: $route.current.params.claim_id }).$promise;
                }
            }
        });

        $routeProvider.otherwise({
            redirectTo: "/claims/saved"
        });
    })

    .run(function ($rootScope, $location) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            var authenticationToken = window.localStorage.getItem("authenticationToken");

            if (next.guest && authenticationToken) {
                $location.path("/claims/saved").replace();
            }

            if (!next.guest && !authenticationToken) {
                $location.path("/sign-in").replace();
            }

            $rootScope.loading = true;
        });

        $rootScope.$on("$routeChangeError", function (event, next, current, error) {
            if (error.status === 401) {
                window.localStorage.removeItem("authenticationToken");
                $location.path("/sign-in").replace();
            }
        });

        $rootScope.$on("$routeChangeSuccess", function () {
            $rootScope.loading = false;
        });
    });
