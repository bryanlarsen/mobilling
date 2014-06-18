angular.module("moBilling.controllers.signIn", [])

    .controller("SignInController", function ($scope, $location, session) {
        $scope.session = session;

        $scope.success = function () {
            window.localStorage.setItem("authenticationToken", session.authentication_token);
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
            $scope.form.password.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.session.$save($scope.success, $scope.error);
            }
        };
    });
