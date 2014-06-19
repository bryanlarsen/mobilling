angular.module("moBilling.controllers.claimEdit", [])

    .controller("ClaimEditController", function ($scope, $location, claim, Photo) {
        $scope.claim = claim;

        if ($scope.claim.admission_on === $scope.claim.first_seen_on) {
            $scope.first_seen_admission = true;
        }

        $scope.success = function () {
            $location.path("/");
        };

        $scope.error = function (response) {
            if (response.status === 422) {
                $scope.errors = response.data.errors;
                angular.forEach($scope.errors || {}, function (errors, field) {
                    $scope.form[field].$setValidity("server", false);
                });
            }
        };

        $scope.submit = function () {
            $scope.submitted = true;

            if ($scope.form.$valid) {
                $scope.claim.$save($scope.success, $scope.error);
            }
        };

        $scope.syncFirstSeenOn = function () {
            if ($scope.first_seen_admission) {
                $scope.claim.first_seen_on = $scope.claim.admission_on;
            }
        };

        $scope.$watch("claim.admission_on", $scope.syncFirstSeenOn);
        $scope.$watch("first_seen_admission", $scope.syncFirstSeenOn);
        $scope.$watch("claim.photo_id", function (photoId) {
            if (photoId) {
                $scope.photo = Photo.get({ id: photoId });
            }
        });
        $scope.$watch("file", function (file) {
            if (file) {
                $scope.uploading = true;

                Photo.upload(file).then(function (data) {
                    $scope.uploading = false;
                    $scope.claim.photo_id = data.id;
                    $scope.$apply();
                }, function () {
                    $scope.uploading = false;
                    $scope.$apply();
                });
            }
        });
    });
