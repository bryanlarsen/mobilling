angular.module("moBilling.directives.time", [])

    .directive("mbTime", function (dateFilter) {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 1,
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$formatters.push(function (modelValue) {
                    var hour, minute;

                    if (modelValue) {
                        hour   = parseInt(modelValue.split(":")[0], 10);
                        minute = parseInt(modelValue.split(":")[1], 10);

                        return new Date(1900, 0, 1, hour, minute);
                    } else {
                        return undefined;
                    }
                });

                ngModelController.$parsers.push(function (viewValue) {
                    return dateFilter(viewValue, "HH:mm");
                });
            }
        };
    });
