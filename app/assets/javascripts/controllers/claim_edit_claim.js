angular.module("moBilling.controllers.claimEditClaim", [])

    .controller("ClaimEditClaimController", function ($scope, Photo) {
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
