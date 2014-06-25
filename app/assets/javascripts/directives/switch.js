angular.module("moBilling.directives.switch", [])

    .directive("mbSwitch", function () {
        return {
            restrict: "E",
            replace: true,
            require: "ngModel",
            template: "<div class='switch switch-transition-enabled' ng-class='{active: checked}'><div class='switch-handle'></div></div>",
            scope: true,
            link: function (scope, element, attributes, ngModelController) {
                var onValue = attributes.onValue,
                    offValue = attributes.offValue;

                if (!attributes.hasOwnProperty("onValue")) {
                    onValue = true;

                    if (!attributes.hasOwnProperty("offValue")) {
                        offValue = false;
                    }
                }

                element.on("click tap", function (event) {
                    if (attributes.disabled == null) {
                        scope.$apply(function () {
                            scope.checked = !scope.checked;
                            ngModelController.$setViewValue(scope.checked ? onValue : offValue);
                        });
                    }
                });

                ngModelController.$render = function () {
                    scope.checked = (ngModelController.$viewValue === onValue);
                };
            }
        };
    });
