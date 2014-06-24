angular.module("moBilling.controllers.claimEditClaim", [])

    .controller("ClaimEditClaimController", function ($scope, Photo) {
        $scope.claim.first_seen_admission = ($scope.claim.admission_on === $scope.claim.first_seen_on);

        $scope.$watchGroup(["claim.first_seen_admission", "claim.admission_on"], function () {
            if ($scope.claim.first_seen_admission) {
                $scope.claim.first_seen_on = $scope.claim.admission_on;
            }
        });

        // first_seen_consult
        $scope.$watchGroup(["claim.admission_on", "claim.first_seen_on"], function () {
            if (!$scope.isFirstSeenConsultVisible()) {
                $scope.claim.first_seen_consult = true;
            }
        });

        $scope.isFirstSeenConsultVisible = function () {
            return $scope.claim.admission_on !== $scope.claim.first_seen_on;
        };

        // icu_transfer
        $scope.$watchGroup(["claim.admission_on", "claim.first_seen_on", "claim.most_responsible_physician"], function () {
            if (!$scope.isICUTransferVisible()) {
                $scope.claim.icu_transfer = false;
            }
        });

        $scope.isICUTransferVisible = function () {
            return $scope.isFirstSeenConsultVisible() && $scope.claim.most_responsible_physician;
        };

        $scope.$watch("claim.photo_id", function (photo_id) {
            if (photo_id) {
                $scope.photo = Photo.get({ id: photo_id });
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
