angular.module("moBilling.controllers.signUp", [])

    .controller("SignUpController", function ($scope, $location, User) {
        $scope.user = {};

        function success(user) {
            window.localStorage.setItem("authenticationToken", user.authentication_token);
            $location.replace();
            $location.path("/claims");
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
            $scope.form.name.$setValidity("server", true);
            $scope.form.email.$setValidity("server", true);
            $scope.form.password.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.submitting = true;
                User.save($scope.user, success, error);
            }
        };
    });
