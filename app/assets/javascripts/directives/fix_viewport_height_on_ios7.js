angular.module("moBilling.directives")

    .directive("mbFixViewportHeightOnIOS7", function ($document, $window) {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                function fixViewportHeightOnIOS7() {
                    var height = Math.min(
                        $($window).height(), // This is smaller on Desktop
                        $window.innerHeight || Infinity // This is smaller on iOS7
                    );

                    element.height(height);
                }

                $window.addEventListener("resize", fixViewportHeightOnIOS7, false);
                $window.addEventListener("orientationchange", fixViewportHeightOnIOS7, false);

                fixViewportHeightOnIOS7();
            }
        };
    });
