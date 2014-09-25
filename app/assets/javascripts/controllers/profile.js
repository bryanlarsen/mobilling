angular.module("moBilling.controllers")

    .controller("ProfileController", function ($scope, $location, User, user, agents, specialties, currentUser) {
        $scope.initialize = function () {
            $scope.agents = agents;
            $scope.specialties = specialties;
            $scope.user = user;

            $scope.office_codes = [
                { name: 'Hamilton (G)', code: 'G' },
                { name: 'Kingston (J)', code: 'J' },
                { name: 'London (P)', code: 'P' },
                { name: 'Missisauga (E)', code: 'E' },
                { name: 'Oshawa (F)', code: 'F' },
                { name: 'Ottawa (D)', code: 'D' },
                { name: 'Sudbury (R)', code: 'R' },
                { name: 'Thunder Bay (U)', code: 'U' },
                { name: 'Toronto (N)', code: 'N' }
            ];

            $scope.specialty_codes = [
                { name: 'Family Medicine (00)', code: 0 },
                { name: 'Anesthesia (01)', code: 1 },
                { name: 'Internal Medicine (00)', code: 13 },
                { name: 'Cardiology (60)', code: 60 }
            ];
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
