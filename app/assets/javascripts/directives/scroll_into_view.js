angular.module("moBilling.directives")

    .directive("mbScrollIntoView", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attributes, ngModelController) {
                ngModelController.$parsers.unshift(function (viewValue) {
                    element[0].scrollIntoView();
                    return viewValue;
                });
            }
        };
    });
