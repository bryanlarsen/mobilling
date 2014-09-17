angular.module("moBilling.directives")

    .directive("mbFixViewportHeightOnIos7", function ($document, $window, $interval) {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                function fixViewportHeightOnIOS7() {
                    var height = Math.min($($window).height(), $window.innerHeight || Infinity);

                    $("meta[name=viewport]").attr("content", "initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width");

                    element.height(height);
                    element.parent().height(height);
                    $window.scrollTo(0, 0);
                }

                // $($window).on("resize orientationchange native.keyboardhide native.keyboardshow", fixViewportHeightOnIOS7);

                $interval(fixViewportHeightOnIOS7, 1000);

                fixViewportHeightOnIOS7();
            }
        };
    });
