angular.module("moBilling.controllers", [])

    .controller("SignInController", function ($scope) {

        $scope.submit = function () {
            console.log($scope.form);
        };

    });
