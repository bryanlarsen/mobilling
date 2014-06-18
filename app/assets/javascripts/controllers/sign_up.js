angular.module("moBilling.controllers.signUp", [])

    .controller("SignUpController", function ($scope, $location, User) {
        $scope.user = new User();

        $scope.success = function () {
            window.localStorage.setItem("authenticationToken", $scope.user.authentication_token);
            $location.path("/");
        };

        $scope.error = function () {
            angular.forEach($scope.user.errors || {}, function (errors, field) {
                $scope.form[field].$setValidity("server", false);
            });
        };

        $scope.submit = function () {
            $scope.submitted = true;
            $scope.form.email.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.user.save().success($scope.success).error($scope.error);
            }
        };
    });
