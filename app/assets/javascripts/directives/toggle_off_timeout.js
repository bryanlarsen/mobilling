angular.module("moBilling.directives")

    .directive("mbToggleOffTimeout", function (ToggleHelper, $rootScope, $timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                $rootScope.$on(ToggleHelper.events.toggleableToggled, function (event, target, newState) {
                    var promise;

                    if (newState) {
                        promise = $timeout(function () {
                            $rootScope.toggle(target, "off");
                        }, attributes.mbToggleOffTimeout);
                    } else {
                        $timeout.cancel(promise);
                    }
                });
            }
        };
    });
