angular.module("moBilling")

    .config(function ($routeProvider) {
        $routeProvider.when("/sign-in", {
            templateUrl: "sign_in.html",
            controller: "SignInController",
            guest: true
        });

        $routeProvider.when("/sign-up", {
            templateUrl: "sign_up.html",
            controller: "SignUpController",
            guest: true,
            resolve: {
                agents: function (Agent) {
                    return Agent.query().$promise;
                }
            }
        });

        $routeProvider.when("/sign-out", {
            templateUrl: "common/loading.html",
            controller: "SignOutController"
        });

        $routeProvider.when("/password-reset", {
            templateUrl: "password_reset.html",
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

        $routeProvider.when("/claims", {
            templateUrl: "claim_list.html",
            controller: "ClaimListController",
            resolve: {
                claims: function (Claim) {
                    return Claim.query().$promise;
                },
                user: function (User) {
                    return User.get().$promise;
                }
            }
        });

        $routeProvider.when("/:specialty/claims/new", {
            templateUrl: "claim_edit.html",
            controller: "ClaimEditController",
            resolve: {
                claim: function ($route, Claim) {
                    return new Claim({ specialty: $route.current.params.specialty });
                },
                claims: function (Claim) {
                    return Claim.query().$promise;
                },
                diagnoses: function (diagnosesEngine) {
                    return diagnosesEngine.promise;
                },
                hospitals: function (hospitalsEngine) {
                    return hospitalsEngine.promise;
                },
                serviceCodes: function (serviceCodesEngine) {
                    return serviceCodesEngine.promise;
                }
            }
        });

        $routeProvider.when("/claims/:claim_id/edit", {
            templateUrl: "claim_edit.html",
            controller: "ClaimEditController",
            resolve: {
                claim: function ($route, Claim) {
                    return Claim.get({ id: $route.current.params.claim_id }).$promise;
                },
                claims: function (Claim) {
                    return Claim.query().$promise;
                },
                diagnoses: function (diagnosesEngine) {
                    return diagnosesEngine.promise;
                },
                hospitals: function (hospitalsEngine) {
                    return hospitalsEngine.promise;
                },
                serviceCodes: function (serviceCodesEngine) {
                    return serviceCodesEngine.promise;
                }
            }
        });

        $routeProvider.when("/claims/:claim_id", {
            templateUrl: "claim_show.html",
            controller: "ClaimEditController",
            resolve: {
                claim: function ($route, Claim) {
                    return Claim.get({ id: $route.current.params.claim_id }).$promise;
                },
                claims: function (Claim) {
                    return Claim.query().$promise;
                },
                diagnoses: function (diagnosesEngine) {
                    return diagnosesEngine.promise;
                },
                hospitals: function (hospitalsEngine) {
                    return hospitalsEngine.promise;
                },
                serviceCodes: function (serviceCodesEngine) {
                    return serviceCodesEngine.promise;
                }
            }
        });

        $routeProvider.otherwise({
            redirectTo: "/claims"
        });
    })

    .run(function ($rootScope, $location) {
        $rootScope.loading = false;
        $rootScope.locked = false;

        $rootScope.$on("lock", function () {
            $rootScope.locked = true;
        });

        $rootScope.$on("unlock", function () {
            $rootScope.locked = false;
        });

        $rootScope.$on("loading", function () {
            $rootScope.loading = true;
        });

        $rootScope.$on("loaded", function () {
            $rootScope.loading = false;
        });

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            var authenticationToken = window.localStorage.getItem("authenticationToken");

            if (next.guest && authenticationToken) {
                $location.path("/claims").hash("").replace();
            }

            if (!next.guest && !authenticationToken) {
                $location.path("/sign-in").hash("").replace();
            }

            $rootScope.$broadcast("loading");
        });

        $rootScope.$on("$routeChangeError", function (event, next, current, error) {
            if (error.status === 401) {
                window.localStorage.removeItem("authenticationToken");
                $location.path("/sign-in").hash("").replace();
            }
        });

        $rootScope.$on("$routeChangeSuccess", function () {
            $rootScope.$broadcast("loaded");
        });

        document.addEventListener("deviceready", function () {
            $rootScope.$broadcast("lock");

            document.addEventListener("pause", function () {
                $rootScope.$broadcast("lock");
                $rootScope.$apply();
            }, false);

        }, false);
    });
