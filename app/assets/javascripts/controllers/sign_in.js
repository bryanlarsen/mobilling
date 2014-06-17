angular.module("moBilling.controllers.signInController", [])

    .controller("SignInController", function ($scope, Session) {
        $scope.session = new Session();

        $scope.success = function () {
            window.localStorage.setItem("authenticationToken", $scope.session.authentication_token);
        };

        $scope.error = function () {
            angular.forEach($scope.session.errors || {}, function (errors, field) {
                $scope.form[field].$setValidity("server", false);
            });
        };

        $scope.submit = function () {
            $scope.submitted = true;
            $scope.form.password.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.session.save().success($scope.success).error($scope.error);
            }
        };
    });
