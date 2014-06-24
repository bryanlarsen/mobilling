angular.module("moBilling.controllers.claimEdit", [])

    .controller("ClaimEditController", function ($scope, $location, claim, Claim, ClaimForm, Photo) {
        $scope.claim = ClaimForm.fromResource(claim);

        $scope.step = "claim";

        $scope.cancel = function () {
            $location.replace();
            $location.path("/");
        };

        $scope.success = function () {
            $location.replace();
            $location.path("/");
        };

        $scope.error = function (response) {
            $scope.submitting = false;
            if (response.status === 422) {
                $scope.errors = response.data.errors;
                angular.forEach($scope.errors || {}, function (errors, field) {
                    $scope.form[field].$setValidity("server", false);
                });
            }
        };

        $scope.submit = function () {
            var claim;

            $scope.submitted = true;

            if ($scope.form.$valid) {
                $scope.submitting = true;
                claim = new Claim($scope.claim.toResource());
                claim.$save($scope.success, $scope.error);
            }
        };

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
