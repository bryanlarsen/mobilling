angular.module("moBilling.controllers")

    .controller("UnlockController", function ($scope, $location, currentUser) {
        $scope.retries = 3;
        $scope.unlock = {};

        if (!currentUser.pin) {
            success();
        }

        function success() {
            $scope.$emit("unlock");
        };

        function error() {
            $scope.retries--;

            if ($scope.retries === 0) {
                currentUser.signOut();
                $location.path("/").hash("").replace();
            } else {
                $scope.submitting = false;
                $scope.errors = { pin: ["is invaild"] };
                $scope.form.pin.$setValidity("server", false);
            }
        };

        $scope.submit = function () {
            $scope.submitted = true;

            if ($scope.form.$valid) {
                $scope.submitting = true;
                if ($scope.unlock.pin === currentUser.pin) {
                    success();
                } else {
                    window.setTimeout(function () {
                        $scope.$apply(error);
                    }, 3000);
                }
            }
        };
    });
