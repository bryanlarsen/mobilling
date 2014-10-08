angular.module("moBilling.filters")

    .filter("divide", function () {
        return function(data, divisor) {
            if (typeof(data) === 'undefined' || typeof(divisor) === 'undefined') {
                return 0;
            }
            return data / divisor;
        };
    });
