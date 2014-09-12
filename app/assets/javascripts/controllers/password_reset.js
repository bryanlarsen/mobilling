angular.module("moBilling.controllers")

    .controller("PasswordResetController", function ($scope, $location, PasswordReset) {
        $scope.initialize = function () {
            $scope.passwordReset = {};
        };

        function success(passwordReset) {
            $location.path("/sign-in").hash("").replace();
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
            $scope.form.email.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.submitting = true;
                PasswordReset.save($scope.passwordReset, success, error);
            }
        };

        $scope.initialize();
    });
