angular.module("moBilling.directives")

    .directive("mbFixViewportHeightOnIOS7", function ($document, $window) {
        return {
            restrict: "E",
            link: function (scope, element, attributes) {
                function fixViewportHeightOnIOS7() {
                    var height = Math.min($($window).height(), $window.innerHeight || Infinity);

                    element.height(height);
                }

                $($window).on("resize orientationchange", fixViewportHeightOnIOS7);

                // use native.keyboard events instead (ionic plugin)
                element.on("blur", "input,select,textarea", fixViewportHeightOnIOS7);

                fixViewportHeightOnIOS7();
            }
        };
    });
