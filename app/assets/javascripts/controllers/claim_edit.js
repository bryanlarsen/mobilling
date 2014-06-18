angular.module("moBilling.controllers.claimEdit", [])

    .controller("ClaimEditController", function ($scope, $location, claim) {
        $scope.claim = claim;

        $scope.success = function () {
            $location.path("/");
        };

        $scope.error = function (response) {
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
                $scope.claim.$save($scope.success, $scope.error);
            }
        };
    });
