angular.module("moBilling.directives")

    .directive("mbFixViewportHeightOnIos7", function ($document, $window, $interval) {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                function fixViewportHeightOnIOS7() {
                    var height = Math.min($($window).height(), $window.innerHeight || Infinity);

                    if ($window.device.platform === "iOS"
                        && parseFloat($window.device.version) >= 7
                        && parseFloat($window.device.version) < 8) {
                        height -= 20;
                    }

                    element.height(height);
                    $window.scrollTo(0, 0);
                }

                // $($window).on("resize orientationchange native.keyboardhide native.keyboardshow", fixViewportHeightOnIOS7);

                $($window).on("native.keyboardhide", function () {
                    alert("keyboardhide");
                });

                $interval(fixViewportHeightOnIOS7, 1000);

                fixViewportHeightOnIOS7();
            }
        };
    });
