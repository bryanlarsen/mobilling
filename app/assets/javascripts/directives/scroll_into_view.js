angular.module("moBilling.directives")

    .directive("mbScrollIntoView", function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.on("keypress keyup keydown", function () {
                    element.get(0).scrollIntoView();
                });
            }
        };
    });
