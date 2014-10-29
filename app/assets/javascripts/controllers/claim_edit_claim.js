angular.module("moBilling.controllers")

    .controller("ClaimEditClaimController", function ($scope, $window) {
        var claim = $scope.claim;

        $scope.service_locations = [
            { name: 'N/A', code: '' },
            { name: 'Hospital Day Surgery', code: 'HDS' },
            { name: 'Hospital Emergency Department', code: 'HED' },
            { name: 'Hospital In-Patient', code: 'HIP' },
            { name: 'Hospital Out-Patient', code: 'HOP' },
            { name: 'Hospital Referral Patient', code: 'HRP' },
            { name: 'Ontario Telemedicine Network', code: 'OTN' }
        ];

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

        $scope.add = function () {
            claim.diagnoses.push({ name: "" });
        };

        $scope.remove = function (diagnosis) {
            var index = claim.diagnoses.indexOf(diagnosis);

            claim.diagnoses.splice(index, 1);
        };

        $scope.initialize();
    });
