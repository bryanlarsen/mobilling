angular.module("moBilling.controllers.claimEditConsult", [])

    .controller("ClaimEditConsultController", function ($scope) {
        function syncSwitches() {
            $scope.claim.consult_type_general_er           = ($scope.claim.consult_type === "general_er");
            $scope.claim.consult_type_general_non_er       = ($scope.claim.consult_type === "general_non_er");
            $scope.claim.consult_type_comprehensive_er     = ($scope.claim.consult_type === "comprehensive_er");
            $scope.claim.consult_type_comprehensive_non_er = ($scope.claim.consult_type === "comprehensive_non_er");
            $scope.claim.consult_type_limited_er           = ($scope.claim.consult_type === "limited_er");
            $scope.claim.consult_type_limited_non_er       = ($scope.claim.consult_type === "limited_non_er");
        };

        $scope.toggleConsultType = function (type) {
            if ($scope.claim.consult_type === type) {
                $scope.claim.consult_type = undefined;
            } else {
                $scope.claim.consult_type = type;
            }

            syncSwitches();
            $scope.$apply();
        };

        $scope.isTimeVisible = function () {
            return $scope.claim.consult_type && $scope.claim.consult_type.indexOf("comprehensive") === 0;
        };

        syncSwitches();
    });
