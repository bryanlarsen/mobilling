angular.module("moBilling")

    .config(function ($routeProvider) {
        $routeProvider.when("/sign-in", {
            templateUrl: "sign-in.html",
            controller: "SignInController",
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

        $routeProvider.when("/sign-out", {
            templateUrl: "loading.html",
            controller: "SignOutController"
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

        $routeProvider.when("/password-reset", {
            templateUrl: "password-reset.html",
            controller: "PasswordResetController",
            guest: true
        });

        $routeProvider.when("/profile", {
            templateUrl: "profile.html",
            controller: "ProfileController",
            resolve: {
                agents: function (Agent) {
                    return Agent.query().$promise;
                },
                user: function (User) {
                    return User.get().$promise;
                }
            }
        });

        $routeProvider.when("/claims/saved", {
            templateUrl: "claim-list-saved.html",
            controller: "ClaimListSavedController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                },
                user: function (User) {
                    return User.get().$promise;
                }
            }
        });

        $routeProvider.when("/claims/submitted", {
            templateUrl: "claim-list-submitted.html",
            controller: "ClaimListSubmittedController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                },
                user: function (User) {
                    return User.get().$promise;
                }
            }
        });

        $routeProvider.when("/claims/rejected", {
            templateUrl: "claim-list-rejected.html",
            controller: "ClaimListRejectedController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                },
                user: function (User) {
                    return User.get().$promise;
                }
            }
        });

        $routeProvider.when("/claims/paid", {
            templateUrl: "claim-list-paid.html",
            controller: "ClaimListPaidController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                },
                user: function (User) {
                    return User.get().$promise;
                }
            }
        });

        $routeProvider.when("/claims/new_internal_medicine", {
            templateUrl: "claim-edit.html",
            controller: "ClaimEditController",
            resolve: {
                claim: function (Claim) {
                    return new Claim({ specialty: "internal_medicine" });
                },
                claims: function (Claim) {
                    return Claim.query().$promise;
                }
            }
        });

        $routeProvider.when("/claims/:claim_id/edit", {
            templateUrl: "claim-edit.html",
            controller: "ClaimEditController",
            resolve: {
                claim: function ($route, Claim) {
                    return Claim.get({ id: $route.current.params.claim_id });
                },
                claims: function (Claim) {
                    return Claim.query().$promise;
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
