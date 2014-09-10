angular.module("moBilling.directives")

    .directive("mbDate", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text">',
            link: function (scope, element, attributes, ngModelController) {
                var picker = element.pickadate({ format: "yyyy-mm-dd", container: "body" }).pickadate("picker");

                attributes.$observe("min", function (min) {
                    picker.set({ min: min === undefined ? false : min });
                });

                attributes.$observe("max", function (max) {
                    picker.set({ max: max === undefined ? false : max });
                });

                ngModelController.$formatters.push(function (modelValue) {
                    if (modelValue) {
                        picker.set("select", modelValue);
                    }

                    return modelValue;
                });

                element.focus(function () {
                    element.blur();
                });
            }
        };
    });
