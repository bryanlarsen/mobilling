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
    "siyfion.sfTypeahead",
    "ui.unique",
    "ngMessages",
    "ngResource",
    "ngRoute",
    "moBilling.constants",
    "moBilling.controllers.accountEdit",
    "moBilling.controllers.claimEdit",
    "moBilling.controllers.claimEditClaim",
    "moBilling.controllers.claimEditConsult",
    "moBilling.controllers.claimEditDetails",
    "moBilling.controllers.claimListPaid",
    "moBilling.controllers.claimListRejected",
    "moBilling.controllers.claimListSaved",
    "moBilling.controllers.claimListSubmitted",
    "moBilling.controllers.claimNew",
    "moBilling.controllers.passwordReset",
    "moBilling.controllers.signIn",
    "moBilling.controllers.signOut",
    "moBilling.controllers.signUp",
    "moBilling.controllers.unlock",
    "moBilling.directives.confirmation",
    "moBilling.directives.date",
    "moBilling.directives.typeahead",
    "moBilling.directives.server",
    "moBilling.directives.switch",
    "moBilling.directives.time",
    "moBilling.directives.upload",
    "moBilling.directives.validateTotalTime",
    "moBilling.factories.agent",
    "moBilling.factories.claim",
    "moBilling.factories.dayType",
    "moBilling.factories.detailsGenerator",
    "moBilling.factories.diagnoses",
    "moBilling.factories.hospitals",
    "moBilling.factories.passwordReset",
    "moBilling.factories.photo",
    "moBilling.factories.serviceCode",
    "moBilling.factories.serviceCodes",
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

        $routeProvider.when("/password-reset", {
            templateUrl: "password-reset.html",
            controller: "PasswordResetController",
            guest: true
        });

        $routeProvider.when("/sign-up", {
            templateUrl: "sign-up.html",
            controller: "SignUpController",
            guest: true,
            resolve: {
                agents: function (Agent) {
                    return Agent.query().$promise;
                }
            }
        });

        $routeProvider.when("/unlock", {
            templateUrl: "unlock.html",
            controller: "UnlockController",
            resolve: {
                user: function (User) {
                    return User.get().$promise;
                }
            }
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

        $routeProvider.when("/claims/submitted", {
            templateUrl: "claim-list-submitted.html",
            controller: "ClaimListSubmittedController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                }
            }
        });

        $routeProvider.when("/claims/rejected", {
            templateUrl: "claim-list-rejected.html",
            controller: "ClaimListRejectedController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                }
            }
        });

        $routeProvider.when("/claims/paid", {
            templateUrl: "claim-list-paid.html",
            controller: "ClaimListPaidController",
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

        $routeProvider.when("/account/edit", {
            templateUrl: "account-edit.html",
            controller: "AccountEditController",
            resolve: {
                agents: function (Agent) {
                    return Agent.query().$promise;
                },
                user: function (User) {
                    return User.get().$promise;
                }
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
