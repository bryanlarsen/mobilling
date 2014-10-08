angular.module("moBilling.directives")

    .directive("mbDate", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text" readonly>',
            link: function (scope, element, attributes, ngModelController) {
                function validate() {
                    ngModelController.$setValidity("min", attributes.min ? attributes.min <= ngModelController.$viewValue : true);
                    ngModelController.$setValidity("max", attributes.max ? attributes.max >= ngModelController.$viewValue : true);
                }

                attributes.$observe("min", validate);
                attributes.$observe("max", validate);

                ngModelController.$parsers.unshift(function (viewValue) {
                    validate();

                    return viewValue;
                });

                element.on("click", function () {
                    var picker = element.pickadate({
                        format: "yyyy-mm-dd",
                        container: ".app-body",
                        min: attributes.min === undefined ? false : attributes.min,
                        max: attributes.max === undefined ? false : attributes.max,
                        editable: attributes.birthday,
                        selectYears: attributes.birthday ? 150 : false,
                        selectMonths: attributes.birthday
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
