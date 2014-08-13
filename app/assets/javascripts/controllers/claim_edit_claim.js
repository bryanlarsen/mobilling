angular.module("moBilling.controllers")

    .controller("ClaimEditClaimController", function ($scope, Photo, diagnoses, hospitals) {
        $scope.isFirstSeenOnHidden = ($scope.claim.admission_on === $scope.claim.first_seen_on);

        $scope.hospitals = {
            displayKey: "name",
            source: hospitals.ttAdapter()
        };

        $scope.diagnoses = {
            displayKey: "name",
            source: diagnoses.ttAdapter()
        };

        $scope.$watchGroup(["isFirstSeenOnHidden", "claim.admission_on"], function () {
            if ($scope.isFirstSeenOnHidden) {
                $scope.claim.first_seen_on = $scope.claim.admission_on;
            }
        });

        // first_seen_consult
        $scope.isFirstSeenConsultVisible = function () {
            return $scope.claim.admission_on !== $scope.claim.first_seen_on;
        };

        $scope.$watch($scope.isFirstSeenConsultVisible, function (isFirstSeenConsultVisible) {
            if (!isFirstSeenConsultVisible) {
                $scope.claim.first_seen_consult = true;
            }
        });

        // icu_transfer
        $scope.isICUTransferVisible = function () {
            return $scope.isFirstSeenConsultVisible() && $scope.claim.most_responsible_physician;
        };

        $scope.$watch($scope.isICUTransferVisible, function (isICUTransferVisible) {
            if (!isICUTransferVisible) {
                $scope.claim.icu_transfer = false;
            }
        });

        $scope.$watch("claim.photo_id", function (photo_id) {
            if (photo_id) {
                $scope.photo = Photo.get({ id: photo_id });
            }
        });

        function success(data) {
            $scope.$apply(function () {
                $scope.uploading = false;
                $scope.claim.photo_id = data.id;
            });
        }

        function error() {
            $scope.$apply(function () {
                $scope.uploading = false;
            });
        }

        $scope.$watch("file", function (file) {
            if (file) {
                $scope.uploading = true;
                Photo.upload(file).then(success, error);
            }
        });
    });
