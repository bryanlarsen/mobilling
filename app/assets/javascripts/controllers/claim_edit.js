angular.module("moBilling.controllers.claimEdit", [])

    .controller("ClaimEditController", function ($scope, $location, $route, $anchorScroll, claim, Claim) {
        // HACK: Do not reload the current template if it is not needed.
        var lastRoute = $route.current;

        $scope.$on("$locationChangeSuccess", function () {
            $scope.loading = false;
            if (lastRoute.$$route.templateUrl === $route.current.$$route.templateUrl) {
                $route.current = lastRoute;
            }
        });
        // KCAH

        $scope.claim = claim.toJSON();

        $scope.isActiveStep = function (step) {
            return $scope.step === step;
        };

        $scope.setActiveStep = function (step) {
            $scope.step = step;
            $location.hash(step).replace();
            $anchorScroll();
        };

        $scope.step = $location.hash();

        if (!$scope.step || !/^(claim|consult|details)$/.test($scope.step)) {
            $scope.setActiveStep("claim");
        }

        $scope.isConsultVisible = function () {
            return $scope.claim.admission_on === $scope.claim.first_seen_on && $scope.claim.first_seen_consult
                || $scope.claim.admission_on !== $scope.claim.first_seen_on && $scope.claim.first_seen_consult && !$scope.claim.most_responsible_physician
                || $scope.claim.admission_on !== $scope.claim.first_seen_on && $scope.claim.first_seen_consult && $scope.claim.most_responsible_physician && !$scope.claim.icu_transfer;
        };

        $scope.$watch($scope.isConsultVisible, function (isConsultVisible) {
            if (!isConsultVisible) {
                $scope.claim.consult_type = undefined;
                $scope.claim.consult_premium_visit = undefined;
                $scope.claim.consult_premium_travel = undefined;
                $scope.claim.consult_time_in = undefined;
                $scope.claim.consult_time_out = undefined;
            }
        });

        $scope.cancel = function () {
            $location.path("/claims/saved").hash("").replace();
        };

        $scope.save = function () {
            $scope.submitting = true;
            $scope.claim.status = "saved";
            Claim.save($scope.claim, function () {
                $location.path("/claims/saved").hash("").replace();
            }, function () {
                $scope.submitting = false;
            });
        };

        function showError() {
            if ($scope.form.detailsForm.$invalid) {
                $scope.setActiveStep("details");
            }

            if ($scope.form.consultForm && $scope.form.consultForm.$invalid) {
                $scope.setActiveStep("consult");
            }

            if ($scope.form.claimForm.$invalid) {
                $scope.setActiveStep("claim");
            }
        }

        $scope.submit = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                $scope.submitting = true;
                $scope.claim.status = "unprocessed";
                Claim.save($scope.claim, function () {
                    $location.path("/claims/unprocessed").hash("").replace();
                }, function () {
                    $scope.submitting = false;
                });
            } else {
                showError();
            }
        };
    });
