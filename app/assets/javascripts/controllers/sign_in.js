angular.module("moBilling.controllers")

    .controller("SignInController", function ($scope, $location, Session, currentUser) {
        $scope.initialize = function () {
            $scope.platform = (window.device && window.device.platform) ? window.device.platform : "Browser";
            $scope.session = {};
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
            $scope.form.password.$setValidity("server", true);

            if ($scope.form.$valid) {
                $scope.submitting = true;
                Session.save($scope.session, success, error);
            }
        };

        $scope.initialize();
    });
