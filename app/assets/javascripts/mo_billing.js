//= require ./constants
//= require_tree ./controllers
//= require_tree ./factories
//= require_tree ./directives
//= require_tree ./templates

angular.module("moBilling", [
    // "mobile-angular-ui.active-links",
    // "mobile-angular-ui.directives.capture",
    // "mobile-angular-ui.directives.carousel",
    // "mobile-angular-ui.directives.forms",
    "mobile-angular-ui.directives.navbars",
    // "mobile-angular-ui.directives.overlay",
    // "mobile-angular-ui.directives.panels",
    "mobile-angular-ui.directives.sidebars",
    "mobile-angular-ui.directives.toggle",
    "mobile-angular-ui.fastclick",
    // "mobile-angular-ui.pointer-events",
    "mobile-angular-ui.scrollable",
    "ngMessages",
    "ngResource",
    "ngRoute",
    "moBilling.constants",
    "moBilling.controllers.claimEdit",
    "moBilling.controllers.claimEditClaim",
    "moBilling.controllers.claimEditConsult",
    "moBilling.controllers.claimEditDetails",
    "moBilling.controllers.claimList",
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
                $location.replace();
                $location.path("/");
            }

            if (!next.guest && !authenticationToken) {
                $location.replace();
                $location.path("/sign-in");
            }

            $rootScope.loading = true;
        });

        $rootScope.$on("$routeChangeError", function (event, next, current, error) {
            if (error.status === 401) {
                window.localStorage.removeItem("authenticationToken");
                $location.replace();
                $location.path("/sign-in");
            }
        });

        $rootScope.$on("$routeChangeSuccess", function () {
            $rootScope.loading = false;
        });
    });
