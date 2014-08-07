angular.module("moBilling.controllers.accountEdit", [])

    .controller("AccountEditController", function ($scope, User, user, agents, $location) {
        $scope.agents = agents;
        $scope.user = user.toJSON();

        $scope.save = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                $scope.submitting = true;
                User.update($scope.user, function () {
                    $location.path("/claims/saved").hash("").replace();
                }, function () {
                    $scope.submitting = false;
                });
            }
        };
    });
