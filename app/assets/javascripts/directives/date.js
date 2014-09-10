angular.module("moBilling.directives")

    .directive("mbDate", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text">',
            link: function (scope, element, attributes, ngModelController) {
                element.focus(function () {
                    element.blur();

                    var picker = element.pickadate({
                        format: "yyyy-mm-dd",
                        container: "body",
                        min: attributes.min === undefined ? false : attributes.min,
                        max: attributes.max === undefined ? false : attributes.max
                    }).pickadate("picker");

                    picker.on("close", function () {
                        picker.stop();
                    });
                });
            }
        };
    });
