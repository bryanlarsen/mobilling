angular.module("moBilling.directives")

    .directive("mbScrollIntoView", function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.on("focus keypress keyup keydown", function () {
                    var id, label;

                    id = element.attr("id");
                    label = $("label[for='" + id + "']");

                    if (label.length > 0) {
                        label.scrollIntoView(false);
                    } else {
                        element.scrollIntoView(false);
                    }
                });
            }
        };
    });
