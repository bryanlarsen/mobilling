angular.module("moBilling.directives.dateFormat", [])

    .directive("dateFormat", function (dateFilter) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$formatters.push(function (modelValue) {
                    return new Date(modelValue);
                });

                ngModelController.$parsers.push(function (viewValue) {
                    return dateFilter(viewValue, attributes.dateFormat);
                });
            }
        };
    });
