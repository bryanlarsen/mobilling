angular.module("moBilling.controllers")

    .controller("SignUpController", function ($scope, $location, User, agents, specialties, currentUser) {
        $scope.initialize = function () {
            $scope.platform = (window.device && window.device.platform) ? window.device.platform : "Browser";
            $scope.agents = agents;
            $scope.specialties = specialties;
            $scope.user = {
                specialties: []
            };
        };

        $scope.openBrowser = function () {
            window.open("http://newapp.mo-billing.ca/", "_system", "location=yes");
        };

        function success(user) {
            currentUser.signIn(user);
            $scope.$emit("unlock");
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

        $scope.initialize();
    });
