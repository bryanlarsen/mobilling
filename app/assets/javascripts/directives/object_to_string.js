angular.module("moBilling.directives.objectToString", [])

    .directive("mbObjectToString", function (dateFilter) {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 1,
            link: function (scope, element, attributes, ngModelController) {
                var key = attributes.mbObjectToString;

                ngModelController.$parsers.push(function (viewValue) {
                    if (typeof viewValue === "string") {
                        return viewValue;
                    } else {
                        return viewValue[key];
                    }
                });
            }
        };
    });
