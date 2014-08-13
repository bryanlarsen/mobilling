angular.module("moBilling.controllers")

    .controller("ProfileController", function ($scope, User, user, agents, $location) {
        $scope.agents = agents;
        $scope.user = user.toJSON();

        function success() {
            $location.path("/claims/saved").hash("").replace();
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

        $scope.save = function () {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                $scope.submitting = true;
                User.update($scope.user, success, error);
            }
        };
    });
