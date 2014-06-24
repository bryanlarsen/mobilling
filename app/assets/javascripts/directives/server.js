angular.module("moBilling.directives.server", [])

    .directive("mbServer", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$parsers.unshift(function (viewValue) {
                    ngModelController.$setValidity("server", true);

                    return viewValue;
                });
            }
        };
    });
