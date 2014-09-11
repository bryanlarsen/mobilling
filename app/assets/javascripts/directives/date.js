angular.module("moBilling.directives")

    .directive("mbDate", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text">',
            link: function (scope, element, attributes, ngModelController) {
                element.on("click focus", function () {
                    var picker = element.pickadate({
                        format: "yyyy-mm-dd",
                        container: "body"
                    }).pickadate("picker");

                    picker.set({
                        min: attributes.min === undefined ? false : attributes.min,
                        max: attributes.max === undefined ? false : attributes.max
                    });

                    picker.on("close", function () {
                        element.blur();
                    });

                    return false;
                });
            }
        };
    });
