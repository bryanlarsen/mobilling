angular.module("moBilling.controllers.unlock", [])

    .controller("UnlockController", function ($scope, $location, user) {
        $scope.retries = 3;
        $scope.unlock = {};

        if (!user.pin) {
            success();
        }

        function success() {
            $location.path("/claims/saved").hash("").replace();
        };

        function error() {
            $scope.retries--;

            if ($scope.retries === 0) {
                window.localStorage.removeItem("authenticationToken");
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
                if ($scope.unlock.pin === user.pin) {
                    success();
                } else {
                    window.setTimeout(function () {
                        $scope.$apply(error);
                    }, 3000);
                }
            }
        };
    });
