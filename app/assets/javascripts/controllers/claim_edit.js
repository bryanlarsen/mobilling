angular.module("moBilling.controllers.claimEdit", [])

    .controller("ClaimEditController", function ($scope, $location, claim, Claim) {
        $scope.claim = claim.toJSON();
        $scope.step = "claim";

        $scope.isActiveStep = function (step) {
            return $scope.step === step;
        };

        $scope.setActiveStep = function (step) {
            $scope.step = step;
        };

        $scope.isConsultVisible = function () {
            return $scope.claim.admission_on === $scope.claim.first_seen_on && $scope.claim.first_seen_consult
                || $scope.claim.admission_on !== $scope.claim.first_seen_on && $scope.claim.first_seen_consult && !$scope.claim.most_responsible_physician
                || $scope.claim.admission_on !== $scope.claim.first_seen_on && $scope.claim.first_seen_consult && $scope.claim.most_responsible_physician && !$scope.claim.icu_transfer;
        };

        $scope.cancel = function () {
            $location.replace();
            $location.path("/claims");
        };

        function success() {
            $location.replace();
            $location.path("/claims");
        };

        function error(response) {
            $scope.submitting = false;
            if (response.status === 422) {
                $scope.errors = response.data.errors;
                angular.forEach($scope.errors || {}, function (errors, field) {
                    $scope.form[field].$setValidity("server", false);
                });
            }
        };

        $scope.submit = function () {
            $scope.submitted = true;

            if ($scope.form.$valid) {
                $scope.submitting = true;
                Claim.save($scope.claim, success, error);
            }
        };
    });
