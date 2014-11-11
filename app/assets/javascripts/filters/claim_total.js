angular.module("moBilling.filters")

    .filter("claimTotal", function () {
        return function(data, key) {
            if (typeof(data) === 'undefined') {
                return 0;
            }

            var sum = 0;

            data.daily_details.forEach(function (detail) {
                sum += detail.fee;
                (detail.premiums || []).forEach(function (premium) {
                    sum += premium.fee;
                });
            });

            return sum;
        };
    });

