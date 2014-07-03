angular.module("moBilling.controllers.claimEditConsult", [])

    .controller("ClaimEditConsultController", function ($scope, dayType) {
        $scope.$watch("claim.first_seen_on", function (first_seen_on) {
            if (first_seen_on) {
                $scope.dayType = dayType(first_seen_on);
            }
        });

        $scope.$watch("dayType", function (dayType, dayTypeWas) {
            if (dayType !== dayTypeWas) {
                $scope.claim.consult_premium_visit = undefined;
                $scope.claim.consult_premium_travel = undefined;
            }
        });

        $scope.isPremiumVisitVisible = !!($scope.claim.consult_premium_visit || $scope.claim.consult_premium_travel);

        $scope.$watch("isPremiumVisitVisible", function (isPremiumVisitVisible) {
            if (!isPremiumVisitVisible) {
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

        $scope.$watch("claim.consult_premium_travel", function (consult_premium_travel) {
            if (!consult_premium_travel && $scope.claim.consult_premium_visit === "weekday_day") {
                $scope.claim.consult_premium_visit = undefined;
            }
        });
    });
