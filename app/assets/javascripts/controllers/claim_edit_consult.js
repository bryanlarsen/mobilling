angular.module("moBilling.controllers")

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

        function timeStringToMinutes (timeString) {
            var hoursAndMinutes = timeString.split(":");

            return parseInt(hoursAndMinutes[0], 10) * 60 + parseInt(hoursAndMinutes[1], 10);
        }

        $scope.$watchGroup(["claim.consult_time_in", "claim.consult_time_out"], function () {
            var minutesIn, minutesOut;

            if ($scope.claim.consult_time_in && $scope.claim.consult_time_out) {
                minutesIn  = timeStringToMinutes($scope.claim.consult_time_in);
                minutesOut = timeStringToMinutes($scope.claim.consult_time_out);

                $scope.claim.consult_time = minutesOut - minutesIn;
            }
        });

        $scope.$watch("claim.consult_premium_travel", function (consult_premium_travel) {
            if (!consult_premium_travel && $scope.claim.consult_premium_visit === "weekday_day") {
                $scope.claim.consult_premium_visit = undefined;
            }
        });
    });
