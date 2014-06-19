angular.module("moBilling.controllers.signIn", [])

    .controller("SignInController", function ($scope, $location, Session) {
        $scope.session = {};

        $scope.success = function (session) {
            $scope.submitting = false;
            window.localStorage.setItem("authenticationToken", session.authentication_token);
            $location.path("/");
        };

        $scope.error = function (response) {
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
            $scope.form.password.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.submitting = true;
                new Session($scope.session).$save($scope.success, $scope.error);
            }
        };
    });
