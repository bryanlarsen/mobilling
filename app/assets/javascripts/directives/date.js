angular.module("moBilling.directives.date", [])

    .directive("mbDate", function (dateFilter) {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 1,
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$formatters.push(function (modelValue) {
                    var year, month, day;

                    if (modelValue) {
                        year  = parseInt(modelValue.split("-")[0], 10);
                        month = parseInt(modelValue.split("-")[1], 10) - 1;
                        day   = parseInt(modelValue.split("-")[2], 10);

                        return new Date(year, month, day);
                    } else {
                        return undefined;
                    }
                });

                ngModelController.$parsers.push(function (viewValue) {
                    return dateFilter(viewValue, "yyyy-MM-dd");
                });
            }
        };
    });
