angular.module("moBilling.factories.detailsGenerator", [])

    .factory("detailsGenerator", function () {
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
            }[(first ? "first_" : "second_") + (er ? "er_" : "non_er_") + type];
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
            }[(er ? "er_" : "non_er_") + type];
        }

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

        function detailsGenerator(claim) {
            var first = claim.first_seen_on,
                last = claim.last_seen_on,
                mrp = claim.most_responsible_physician,
                consult = !!claim.consult_type,
                er = /^(general|comprehensive|limited)_er$/.test(claim.consult_type),
                icu = claim.icu_transfer,
                days = [],
                codes = [];

            return [];
        }

        return detailsGenerator;
    });
