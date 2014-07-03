angular.module("moBilling.factories.detailsGenerator", [])

    .factory("detailsGenerator", function () {
        function daysRange(first, last) {
            var i,
                days = [];

            first = new Date(first).getTime();
            last = new Date(last).getTime();

            if (!isNaN(first) && !isNaN(last)) {
                for (i = first; i <= last; i += 1000 * 60 * 60 * 24) {
                    days.push(new Date(i).toISOString().substr(0, 10));
                }
            }

            return days;
        }

        function firstCode(first) {
            return first ? "first" : "second";
        }

        function erCode(er) {
            return er ? "er" : "non_er";
        }

        function visitCode(type) {
            return {
                weekday_office_hours: "office_hours",
                weekday_day:          "day",
                weekday_evening:      "evening",
                weekday_night:        "night",
                weekend_day:          "holiday",
                weekend_night:        "night",
                holiday_day:          "holiday",
                holiday_night:        "night"
            }[type];
        }

        function consultCode(type) {
            return {
                general_er:           "A135",
                general_non_er:       "C135",
                comprehensive_er:     "A130",
                comprehensive_non_er: "C130",
                limited_er:           "A435",
                limited_non_er:       "C435"
            }[type];
        }

        function premiumVisitCode(first, er, type) {
            return {
                first_non_er_office_hours:  "C992",
                first_non_er_day:           "C990",
                first_non_er_evening:       "C994",
                first_non_er_holiday:       "C986",
                first_non_er_night:         "C996",
                second_non_er_office_hours: "C993",
                second_non_er_day:          "C991",
                second_non_er_evening:      "C995",
                second_non_er_holiday:      "C987",
                second_non_er_night:        "C997",
                first_er_office_hours:      "K992",
                first_er_day:               "K990",
                first_er_evening:           "K994",
                first_er_holiday:           "K998",
                first_er_night:             "K996",
                second_er_office_hours:     "K993",
                second_er_day:              "K991",
                second_er_evening:          "K995",
                second_er_holiday:          "K999",
                second_er_night:            "K997"
            }[[firstCode(first), erCode(er), visitCode(type)].join("_")];
        }

        function premiumTravelCode(er, type) {
            return {
                non_er_office_hours: "C961A",
                non_er_day:          "C960",
                non_er_evening:      "C962",
                non_er_holiday:      "C963",
                non_er_night:        "C964",
                er_office_hours:     "K961",
                er_day:              "K960",
                er_evening:          "K962A",
                er_holiday:          "K963",
                er_night:            "K964"
            }[[erCode(er), visitCode(type)].join("_")];
        }

        function detailsGenerator(claim) {
            var first = claim.first_seen_on,
                last = claim.last_seen_on,
                admission = claim.admission_on === claim.first_seen_on,
                mrp = claim.most_responsible_physician,
                consult = claim.consult_type,
                visit = claim.consult_premium_visit,
                travel = claim.consult_premium_travel,
                er = /^(general|comprehensive|limited)_er$/.test(claim.consult_type),
                icu = claim.icu_transfer,
                discharge = claim.last_seen_discharge,
                details = [];

            daysRange(first, last).forEach(function (day, i) {
                if (day === first) {
                    if (consult) {
                        // consult
                        details.push({ day: day, code: consultCode(consult) });

                        if (visit) {
                            // visit premium
                            details.push({ day: day, code: premiumVisitCode(true, er, visit) });

                            if (travel) {
                                // travel premium
                                details.push({ day: day, code: premiumTravelCode(er, visit) });
                            }
                        }

                        if (admission && mrp) {
                            // admission premium
                            details.push({ day: day, code: "E082" });
                        }
                    }
                } else if (day === last && discharge) {
                    // discharge
                    if (mrp) {
                        details.push({ day: day, code: "C124" });
                        details.push({ day: day, code: "E083" });
                    } else {
                        details.push({ day: day, code: "C138" });
                    }
                } else if (i === 1) {
                    // first day after admission
                    if (mrp) {
                        if (icu) {
                            details.push({ day: day, code: "C142" });
                            details.push({ day: day, code: "E083" });
                        } else {
                            details.push({ day: day, code: "C122" });
                            details.push({ day: day, code: "E083" });
                        }
                    } else {
                        details.push({ day: day, code: "C138" });
                    }
                } else if (i === 2) {
                    // second day after admission
                    if (mrp) {
                        if (icu) {
                            details.push({ day: day, code: "C143" });
                            details.push({ day: day, code: "E083" });
                        } else {
                            details.push({ day: day, code: "C123" });
                            details.push({ day: day, code: "E083" });
                        }
                    } else {
                        details.push({ day: day, code: "C138" });
                    }
                } else if (i >= 3 && i <= 35) {
                    // 3-35 day after admission
                    if (mrp) {
                        details.push({ day: day, code: "C132" });
                        details.push({ day: day, code: "E083" });
                    } else {
                        details.push({ day: day, code: "C138" });
                    }
                } else if (i >= 36 && i <= 91) {
                    // 36-91 day after admission
                    if (mrp) {
                        details.push({ day: day, code: "C137" });
                        details.push({ day: day, code: "E083" });
                    } else {
                        details.push({ day: day, code: "C138" });
                    }
                } else if (i >= 92) {
                    // 92+ day after admission
                    if (mrp) {
                        details.push({ day: day, code: "C139" });
                        details.push({ day: day, code: "E083" });
                    } else {
                        details.push({ day: day, code: "C138" });
                    }
                }
            });

            details.forEach(function (detail) {
                detail.autogenerated = true;
            });

            return details;
        }

        return detailsGenerator;
    });
