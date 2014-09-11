angular.module("moBilling.controllers")

    .controller("ClaimEditClaimController", function ($scope, $window, Photo) {
        var claim = $scope.claim;

        claim.first_seen_on_admission = (claim.admission_on === claim.first_seen_on);

        $scope.$watchGroup(["claim.first_seen_on_admission", "claim.admission_on"], function () {
            if (claim.first_seen_on_admission) {
                claim.first_seen_on = claim.admission_on;
            }
        });

        // first_seen_consult
        $scope.isFirstSeenConsultVisible = function () {
            return claim.admission_on !== claim.first_seen_on;
        };

        $scope.$watch($scope.isFirstSeenConsultVisible, function (isFirstSeenConsultVisible) {
            if (!isFirstSeenConsultVisible) {
                claim.first_seen_consult = true;
            }
        });

        // icu_transfer
        $scope.isICUTransferVisible = function () {
            return $scope.isFirstSeenConsultVisible() && claim.most_responsible_physician;
        };

        $scope.$watch($scope.isICUTransferVisible, function (isICUTransferVisible) {
            if (!isICUTransferVisible) {
                claim.icu_transfer = false;
            }
        });

        $scope.$watch("claim.photo_id", function (photo_id) {
            if (photo_id) {
                $scope.photo = Photo.get({ id: photo_id });
            }
        });

        $scope.add = function () {
            claim.diagnoses.push({ name: "" });
        };

        $scope.remove = function (diagnosis) {
            var index = claim.diagnoses.indexOf(diagnosis);

            claim.diagnoses.splice(index, 1);
        };

        function success(data) {
            $scope.uploading = false;
            claim.photo_id = data.id;
        }

        function error() {
            $scope.uploading = false;
        }

        $scope.$watch("file", function (file) {
            if (file) {
                $scope.uploading = true;
                Photo.upload(file).then(success, error);
            }
        });
    });
