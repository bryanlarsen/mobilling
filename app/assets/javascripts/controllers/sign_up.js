angular.module("moBilling.controllers.signUp", [])

    .controller("SignUpController", function ($scope, $location, user) {
        $scope.user = user;

        $scope.success = function () {
            window.localStorage.setItem("authenticationToken", user.authentication_token);
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
            $scope.form.name.$setValidity("server", true);
            $scope.form.email.$setValidity("server", true);
            $scope.form.password.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.user.$save($scope.success, $scope.error);
            }
        };
    });
