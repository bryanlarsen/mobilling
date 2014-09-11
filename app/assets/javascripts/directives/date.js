angular.module("moBilling.directives")

    .directive("mbDate", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text" readonly>',
            link: function (scope, element, attributes, ngModelController) {
                element.on("click", function () {
                    var picker = element.pickadate({
                        format: "yyyy-mm-dd",
                        container: "body",
                        min: attributes.min === undefined ? false : attributes.min,
                        max: attributes.max === undefined ? false : attributes.max
                    }).pickadate("picker");

                    picker.start();
                    picker.open();

                    picker.on("close", function () {
                        element.blur();
                        picker.stop();
                        element.attr({ readonly: true });
                    });

                    return false;
                });
            }
        };
    });
