angular.module("moBilling.controllers.unlock", [])

    .controller("UnlockController", function ($scope, $location, user) {
        $scope.unlock = {};

        $scope.submit = function () {
            $scope.submitted = true;

            if ($scope.form.$valid) {
                console.log($scope.unlock.pin);
            }
        };
    });
