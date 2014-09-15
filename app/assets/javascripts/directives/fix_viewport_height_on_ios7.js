angular.module("moBilling.directives")

    .directive("body", function ($timeout, $document, $window) {
        return {
            restrict: "E",
            link: function (scope, element, attributes) {
                function fixViewportHeightOnIOS7() {
                    $timeout(function () {
                        var height = Math.min(
                            $($window).height(), // This is smaller on Desktop
                            $window.innerHeight || Infinity // This is smaller on iOS7
                        );

                        element.height(height);
                    }, 100);
                }

                $window.addEventListener("resize", fixViewportHeightOnIOS7, false);
                $window.addEventListener("orientationchange", fixViewportHeightOnIOS7, false);
                element.on("blur", "input,select,textarea", fixViewportHeightOnIOS7);

                fixViewportHeightOnIOS7();
            }
        };
    });
