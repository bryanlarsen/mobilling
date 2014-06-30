angular.module("moBilling.controllers.signIn", [])

    .controller("SignInController", function ($scope, $location, Session) {
        $scope.session = {};

        function success(session) {
            window.localStorage.setItem("authenticationToken", session.authentication_token);
            $location.path("/claims").replace();
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
            $scope.form.password.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.submitting = true;
                Session.save($scope.session, success, error);
            }
        };
    });
