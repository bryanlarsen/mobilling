angular.module("moBilling.controllers.claimEditConsult", [])

    .controller("ClaimEditConsultController", function ($scope) {
        $scope.isPremiumVisitVisible = !!($scope.claim.consult_premium_visit || $scope.claim.consult_premium_travel);

        $scope.$watch($scope.isConsultVisible, function (isConsultVisible) {
            if (!isConsultVisible) {
                $scope.claim.consult_type = undefined;
                $scope.claim.consult_premium_visit = undefined;
                $scope.claim.consult_premium_travel = undefined;
            }
        });

        $scope.isTimeVisible = function () {
            return $scope.claim.consult_type && $scope.claim.consult_type.indexOf("comprehensive") === 0;
        };

        $scope.$watch($scope.isTimeVisible, function (isTimeVisible) {
            if (!isTimeVisible) {
                $scope.claim.consult_time_in = undefined;
                $scope.claim.consult_time_out = undefined;
            }
        });
    });
