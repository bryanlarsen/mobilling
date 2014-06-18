angular.module("moBilling.controllers.signUp", [])

    .controller("SignUpController", function ($scope, $location, user) {
        $scope.user = user;

        $scope.success = function (response) {
            console.log(user);
            console.log(response);
            window.localStorage.setItem("authenticationToken", user.authentication_token);
            $location.path("/");
        };

        $scope.error = function (errors) {
            $scope.errors = errors;
            angular.forEach($scope.errors || {}, function (errors, field) {
                $scope.form[field].$setValidity("server", false);
            });
        };

        $scope.submit = function () {
            $scope.submitted = true;
            $scope.form.name.$setValidity("server", true);
            $scope.form.email.$setValidity("server", true);
            $scope.form.password.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.user.$save().then($scope.success, $scope.error);
            }
        };
    });
