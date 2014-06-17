angular.module("moBilling.controllers", [])

    .controller("SignInController", function ($scope, Session) {

        $scope.session = new Session();

        $scope.clearErrors = function () {
            $scope.form.password.$setValidity("server", true);
            $scope.session.errors = null;
        };

        $scope.success = function () {
            console.log($scope.session);
        };

        $scope.error = function () {
            angular.forEach($scope.session.errors || {}, function (errors, field) {
                $scope.form[field].$setValidity("server", false);
            });
        };

        $scope.submit = function () {
            $scope.submitted = true;
            $scope.clearErrors();

            if ($scope.form.$valid) {
                $scope.session.save().then($scope.success, $scope.error);
            }
        };
    });
