angular.module("moBilling.directives")

    .directive("mbTypeahead", function () {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 1,
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$formatters.push(function (modelValue) {
                    $(element).typeahead("val", modelValue);

                    return modelValue;
                });

                ngModelController.$parsers.push(function (viewValue) {
                    if (typeof viewValue === "string") {
                        return viewValue;
                    } else {
                        return viewValue.name;
                    }
                });
            }
        };
    });
