angular.module("moBilling.controllers")

    .controller("ProfileController", function ($scope, $location, User, user, agents, specialties, currentUser) {
        $scope.initialize = function () {
            $scope.agents = agents;
            $scope.specialties = specialties;
            $scope.user = user;
        };

        function success(user) {
            currentUser.signIn(user);
            $location.path("/claims").hash("").replace();
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

        $scope.initialize();
    });
