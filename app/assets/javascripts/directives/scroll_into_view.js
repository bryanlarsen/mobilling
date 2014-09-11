angular.module("moBilling.directives")

    .directive("mbScrollIntoView", function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.keypress(function () {
                    element.get(0).scrollIntoView();
                });
            }
        };
    });
