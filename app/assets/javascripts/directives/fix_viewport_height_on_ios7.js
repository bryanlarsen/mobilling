angular.module("moBilling.directives")

    .directive("mbFixViewportHeightOnIos7", function ($document, $window, $timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                function fixViewportHeightOnIOS7() {
                    $timeout(function () {
                        var height = Math.min($($window).height(), $window.innerHeight || Infinity);

                        element.height(height);
                        $window.scrollTo(0, 0);
                    }, 100);
                }

                if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
                    $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    $window.cordova.plugins.Keyboard.disableScroll(true);
                }

                $window.addEventListener("resize", fixViewportHeightOnIOS7, false);
                $window.addEventListener("orientationchange", fixViewportHeightOnIOS7, false);
                $window.addEventListener("native.keyboardshow", fixViewportHeightOnIOS7);
                $window.addEventListener("native.keyboardhide", fixViewportHeightOnIOS7);

                fixViewportHeightOnIOS7();
            }
        };
    });
