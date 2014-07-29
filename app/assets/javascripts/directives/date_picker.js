angular.module("moBilling.directives.datePicker", [])

    .directive("mbDatePicker", function () {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 1,
            link: function (scope, element, attributes, ngModelController) {
                $(element).datepicker({ autoclose: true, format: "yyyy-mm-dd" });

                ngModelController.$formatters.push(function (modelValue) {
                    if (modelValue) {
                        $(element).datepicker("setDate", modelValue);
                    }

                    return modelValue;
                });
            }
        };
    });
