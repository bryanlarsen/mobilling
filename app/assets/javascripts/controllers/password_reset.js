angular.module("moBilling.controllers.passwordReset", [])

    .controller("PasswordResetController", function ($scope, $location, PasswordReset) {
        $scope.passwordReset = {};

        function success(passwordReset) {
            window.localStorage.setItem("authenticationToken", passwordReset.authentication_token);
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
    });
