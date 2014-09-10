angular.module("moBilling.controllers")

    .controller("ClaimEditConsultController", function ($scope, $filter, dayType, detailsGenerator) {
        var claim = $scope.claim,
            filter = $filter("filter");

        $scope.consultCode = detailsGenerator.consultCode;
        $scope.premiumVisitCode = detailsGenerator.premiumVisitCode;
        $scope.premiumTravelCode = detailsGenerator.premiumTravelCode;
        $scope.consultPremiumVisitCounts = {};
        $scope.consultPremiumTravelCounts = {};

        // on_call_admission_er is default in family_medicine
        if ($scope.isConsultVisible() && claim.specialty === "family_medicine" && !claim.consult_type) {
            claim.consult_type = "on_call_admission_er";
        }

        $scope.$watch("claim.first_seen_on", function (first_seen_on) {
            if (first_seen_on) {
                $scope.dayType = dayType(first_seen_on);
            }
        });

        $scope.$watch("dayType", function (dayType, dayTypeWas) {
            if (dayType !== dayTypeWas) {
                claim.consult_premium_visit = undefined;
            }
        });

        $scope.isPremiumVisitVisible = !!(claim.consult_premium_visit || claim.consult_premium_travel);

        $scope.$watch("isPremiumVisitVisible", function (isPremiumVisitVisible) {
            if (!isPremiumVisitVisible) {
                claim.consult_premium_visit = undefined;
                claim.consult_premium_travel = undefined;
            }
        });

        $scope.isTimeVisible = function () {
            return ["comprehensive_er", "comprehensive_non_er", "special_er", "special_non_er"].indexOf(claim.consult_type) !== -1;
        };

        $scope.$watch($scope.isTimeVisible, function (isTimeVisible) {
            if (!isTimeVisible) {
                claim.consult_time_in = undefined;
                claim.consult_time_out = undefined;
            }
        });

        function timeToMinutes (string) {
            var hoursAndMinutes = string.split(":");

            return parseInt(hoursAndMinutes[0], 10) * 60 + parseInt(hoursAndMinutes[1], 10);
        }

        $scope.$watchGroup(["claim.consult_time_in", "claim.consult_time_out"], function () {
            var minutesIn, minutesOut;

            if (claim.consult_time_in && claim.consult_time_out) {
                minutesIn  = timeToMinutes(claim.consult_time_in);
                minutesOut = timeToMinutes(claim.consult_time_out);

                claim.consult_time = minutesOut - minutesIn;
            }
        });

        $scope.$watch("claim.consult_premium_travel", function (consult_premium_travel) {
            if (consult_premium_travel) {
                $scope.isPremiumVisitVisible = true;
            }
        });

        $scope.consultTypes = {
            internal_medicine: ["general", "comprehensive", "limited"],
            cardiology:        ["general", "comprehensive", "limited"],
            family_medicine:   ["general", "special", "comprehensive", "on_call_admission"]
        }[claim.specialty];

        $scope.isConsultTimeVisible = function () {
            return ["comprehensive_er", "comprehensive_non_er", "special_er", "special_non_er"].indexOf(claim.consult_type) !== -1;
        };

        $scope.consultPremiumVisits = [
            "weekday_day",
            "weekday_office_hours",
            "weekday_evening",
            "weekday_night",
            "weekend_day",
            "weekend_night",
            "holiday_day",
            "holiday_night"
        ];

        $scope.consultPremiumVisitLabels = {
            weekday_day:          "Day 7:00-17:00",
            weekday_office_hours: "Office hours 7:00-17:00",
            weekday_evening:      "Evening 17:00-0:00",
            weekday_night:        "Night 0:00-7:00",
            weekend_day:          "Weekend 7:00-0:00",
            weekend_night:        "Night 0:00-7:00",
            holiday_day:          "Holiday 7:00-0:00",
            holiday_night:        "Night 0:00-7:00"
        };

        $scope.$watchGroup([
            "isPremiumVisitVisible",
            "claim.first_seen_on",
            "claim.consult_premium_visit",
            "claim.consult_premium_travel"
        ], function () {
            $scope.consultPremiumVisitCounts = {};
            $scope.consultPremiumTravelCounts = {};

            if ($scope.isPremiumVisitVisible && claim.first_seen_on) {
                var others = filter($scope.claims, { id: "!" + claim.id, first_seen_on: claim.first_seen_on });

                $scope.consultPremiumVisits.forEach(function (consult_premium_visit) {
                    var consultPremiumVisitClaims = filter(others, { consult_premium_visit: consult_premium_visit });

                    $scope.consultPremiumVisitCounts[consult_premium_visit] = consultPremiumVisitClaims.length;

                    if (claim.consult_premium_travel) {
                        $scope.consultPremiumTravelCounts[consult_premium_visit] = filter(consultPremiumVisitClaims, {
                            consult_premium_travel: true
                        }).length;
                    }
                });

                claim.consult_premium_first = filter(others, {
                    consult_premium_visit: claim.consult_premium_visit,
                    consult_premium_first: true
                }).length === 0;
            }
        });

        $scope.isConsultPremiumVisitLimitReached = function () {
            var limit,
                consult_premium_visit = claim.consult_premium_visit;

            limit = {
                weekday_day:          10,
                weekday_office_hours: 10,
                weekday_evening:      10,
                weekday_night:        Infinity,
                weekend_day:          20,
                weekend_night:        Infinity,
                holiday_day:          20,
                holiday_night:        Infinity
            }[consult_premium_visit];

            return $scope.consultPremiumVisitCounts[consult_premium_visit] >= limit;
        };

        $scope.isConsultPremiumTravelLimitReached = function () {
            var limit,
                consult_premium_visit = claim.consult_premium_visit;

            limit = {
                weekday_day:          2,
                weekday_office_hours: 2,
                weekday_evening:      2,
                weekday_night:        Infinity,
                weekend_day:          6,
                weekend_night:        Infinity,
                holiday_day:          6,
                holiday_night:        Infinity
            }[consult_premium_visit];

            return $scope.consultPremiumTravelCounts[consult_premium_visit] >= limit;
        };
    });
