angular.module("moBilling.directives.confirmation", [])

    .directive("mbConfirmation", function () {
	return {
            restrict: "A",
	    require: "ngModel",
            scope: {
                mbConfirmation: "="
            },
	    link: function (scope, element, attributes, ngModelController) {
                scope.$watch(function () {
                    return scope.mbConfirmation === ngModelController.$viewValue;
                }, function (currentValue) {
                    ngModelController.$setValidity("confirmation", currentValue);
                });
	    }
	};
    });
