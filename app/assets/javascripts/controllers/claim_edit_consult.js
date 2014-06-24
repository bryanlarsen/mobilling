angular.module("moBilling.controllers.claimEditConsult", [])

    .controller("ClaimEditConsultController", function ($scope) {
        $scope.syncSwitches = function () {
            $scope.claim.consult_type_general_er           = ($scope.claim.consult_type === "general_er");
            $scope.claim.consult_type_general_non_er       = ($scope.claim.consult_type === "general_non_er");
            $scope.claim.consult_type_comprehensive_er     = ($scope.claim.consult_type === "comprehensive_er");
            $scope.claim.consult_type_comprehensive_non_er = ($scope.claim.consult_type === "comprehensive_non_er");
            $scope.claim.consult_type_limited_er           = ($scope.claim.consult_type === "limited_er");
            $scope.claim.consult_type_limited_non_er       = ($scope.claim.consult_type === "limited_non_er");
        };

        $scope.setConsultType = function (type) {
            if ($scope.claim.consult_type === type) {
                $scope.claim.consult_type = undefined;
            } else {
                $scope.claim.consult_type = type;
            }

            $scope.syncSwitches();
            $scope.$apply();
        };

        $scope.syncSwitches();
    });
