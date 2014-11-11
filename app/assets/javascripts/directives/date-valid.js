angular.module("moBilling.directives")

    .directive("mbDateValid", function () {
        return {
            require: "ngModel",
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$parsers.unshift(function (value) {
                    var valid = value.match(/^\d{4}-\d{1,2}-\d{1,2}$/) && Date.parse(value);
                    valid = !!valid;
                    ngModelController.$setValidity('format', valid);
                    return valid ? value : '';
                });
            }
        };
    });
