angular.module("moBilling.directives.confirmation", [])

    .directive("confirmation", function () {
	return {
            restrict: "A",
	    require: "?ngModel",
            scope: {
                confirmation: "="
            },
	    link: function (scope, element, attributes, ngModelController) {
                scope.$watch(function () {
                    return scope.confirmation === ngModelController.$viewValue;
                }, function (currentValue) {
                    ngModelController.$setValidity("confirmation", currentValue);
                });
	    }
	};
    });
