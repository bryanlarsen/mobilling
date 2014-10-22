angular.module("moBilling.controllers")

    .controller("ClaimEditClaimController", function ($scope, $window, Photo) {
        var claim = $scope.claim;

        $scope.initialize = function () {
            claim.first_seen_on_admission = (claim.admission_on === claim.first_seen_on);
        };

        $scope.$watchGroup(["claim.first_seen_on_admission", "claim.admission_on"], function () {
            if (claim.first_seen_on_admission) {
                claim.first_seen_on = claim.admission_on;
            }
        });

        // first_seen_consult
        $scope.isFirstSeenConsultEnabled = function () {
            return claim.admission_on !== claim.first_seen_on;
        };

        $scope.$watch($scope.isFirstSeenConsultEnabled, function (isFirstSeenConsultEnabled) {
            claim.first_seen_consult = !isFirstSeenConsultEnabled;
        });

        // icu_transfer
        $scope.isICUTransferEnabled = function () {
            return $scope.isFirstSeenConsultEnabled() && claim.most_responsible_physician;
        };

        $scope.$watch($scope.isICUTransferEnabled, function (isICUTransferEnabled) {
            if (!isICUTransferEnabled) {
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
            $scope.$emit("uploaded");
            claim.photo_id = data.id;
        }

        function error() {
            $scope.$emit("uploaded");
        }

        $scope.$watch("file", function (file) {
            if (file) {
                $scope.$emit("uploading");
                Photo.upload(file).then(success, error);
            }
        });

        $scope.initialize();
    });
