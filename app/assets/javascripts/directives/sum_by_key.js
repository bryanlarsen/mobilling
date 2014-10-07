angular.module("moBilling.directives")

    .filter("sumByKey", function () {
        return function(data, key) {
            if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
                return 0;
            }

            var sum = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                sum += parseInt(data[i][key]);
            }

            return sum;
        };
    });


angular.module("moBilling.directives")

    .filter("divide", function () {
        return function(data, divisor) {
            if (typeof(data) === 'undefined' || typeof(divisor) === 'undefined') {
                return 0;
            }
            return data / divisor;
        };
    });
