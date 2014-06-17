angular.module("moBilling.controllers", [])

    .controller("SignInController", function ($scope, Session) {

        $scope.session = new Session();

        $scope.submit = function () {
            $scope.session.errors = undefined;

            if ($scope.form.$valid) {
                $scope.session.save();
            }
        };

    });
