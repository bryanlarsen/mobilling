angular.module("moBilling.controllers")

    .controller("ClaimEditConsultController", function ($scope, $filter, dayType, detailsGenerator) {
        $scope.consultCode = detailsGenerator.consultCode;
        $scope.premiumVisitCode = detailsGenerator.premiumVisitCode;
        $scope.premiumTravelCode = detailsGenerator.premiumTravelCode;

        // on_call_admission_er is default in family_medicine
        if ($scope.isConsultVisible() && $scope.claim.specialty === "family_medicine" && !$scope.claim.consult_type) {
            $scope.claim.consult_type = "on_call_admission_er";
        }

        $scope.$watch("claim.first_seen_on", function (first_seen_on) {
            if (first_seen_on) {
                $scope.dayType = dayType(first_seen_on);
            }
        });

        $scope.$watch("dayType", function (dayType, dayTypeWas) {
            if (dayType !== dayTypeWas) {
                $scope.claim.consult_premium_visit = undefined;
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
            return ["comprehensive_er", "comprehensive_non_er", "special_er", "special_non_er"].indexOf($scope.claim.consult_type) !== -1;
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
            if (consult_premium_travel) {
                $scope.isPremiumVisitVisible = true;
            }

            if (!consult_premium_travel && $scope.claim.consult_premium_visit === "weekday_day") {
                $scope.claim.consult_premium_visit = undefined;
            }
        });

        $scope.$watch("claim.consult_premium_visit", function (consult_premium_visit, consult_premium_visit_was) {
            if (consult_premium_visit === "weekday_day") {
                $scope.claim.consult_premium_travel = true;
            }

            if (consult_premium_visit_was === "weekday_day") {
                $scope.claim.consult_premium_travel = false;
            }
        });

        $scope.consultTypes = {
            internal_medicine: ["general", "comprehensive", "limited"],
            cardiology: ["general", "comprehensive", "limited"],
            family_medicine: ["general", "special", "comprehensive", "on_call_admission"]
        }[$scope.claim.specialty];

        $scope.isConsultTimeVisible = function () {
            return ["comprehensive_er", "comprehensive_non_er", "special_er", "special_non_er"].indexOf($scope.claim.consult_type) !== -1;
        };

        $scope.consultLimits = {
            weekday_day: 10,
            weekday_office_hours: 10,
            weekday_evening: 10,
            weekday_night: Infinity,
            weekend_day: 20,
            weekend_night: Infinity,
            holiday_day: 20,
            holiday_night: Infinity
        };

        $scope.$watchGroup([
            "isPremiumVisitVisible",
            "claim.first_seen_on",
            "claim.consult_premium_visit"
        ], function () {
            var others;

            $scope.consultCounts = {};

            if ($scope.isPremiumVisitVisible && $scope.claim.first_seen_on) {
                others = $scope.claims.filter(function (claim) {
                    return claim.id !== $scope.claim.id && claim.first_seen_on === $scope.claim.first_seen_on;
                });

                ["weekday_day", "weekday_office_hours", "weekday_evening", "weekday_night", "weekend_day", "weekend_night", "holiday_day", "holiday_night"].forEach(function (consult_premium_visit) {
                    $scope.consultCounts[consult_premium_visit] = $filter("filter")(others, { consult_premium_visit: consult_premium_visit }).length;
                });

                $scope.claim.consult_premium_first = $filter("filter")(others, {
                    consult_premium_visit: $scope.claim.consult_premium_visit,
                    consult_premium_first: true
                }).length === 0;
            }
        });

        $scope.isConsultPremiumVisitDisabled = function (consultPremiumVisit) {
            return $scope.claim.consult_premium_visit !== consultPremiumVisit && $scope.consultCounts[consultPremiumVisit] >= $scope.consultLimits[consultPremiumVisit];
        };
    });
