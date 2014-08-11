angular.module("moBilling.controllers.claimEditConsult", [])

    .controller("ClaimEditConsultController", function ($scope, dayType) {
        /**
        * Converts time string into minutes
        * @param  time String format "hh:mm"
        * @return      Number time converted into minutes
        *
        */
        function timeStringToMinutes (time) {
            if (typeof time !== "string" || time.indexOf(":") < 0) {
                return undefined;
            }

            var hoursAndMinutes = time.split(":");

            return parseInt(hoursAndMinutes[0], 10) * 60 + parseInt(hoursAndMinutes[1], 10);
        }

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

        $scope.claim.hasValidConsultTime = function () {
            // There is no need to validate consult time if it's not visible
            if (!$scope.isTimeVisible()) {
                return true;
            }

            var minutesOut = timeStringToMinutes(this.consult_time_out),
                minutesIn = timeStringToMinutes(this.consult_time_in),
                totalTime = minutesOut - minutesIn;

            return totalTime >= 75;
        };

        $scope.$watch("claim.consult_premium_travel", function (consult_premium_travel) {
            if (!consult_premium_travel && $scope.claim.consult_premium_visit === "weekday_day") {
                $scope.claim.consult_premium_visit = undefined;
            }
        });
    });
