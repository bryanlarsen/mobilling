angular.module("moBilling.directives")

    .directive("mbScrollIntoView", function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.on("focus keypress keyup keydown", function () {
                    var id, label, scrollableContent;

                    scrollableContent = element.closest(".scrollable-content");

                    if (scrollableContent.height() < scrollableContent.children().height()) {
                        id = element.attr("id");
                        label = $("label[for='" + id + "']");

                        if (label.length > 0) {
                            label.get(0).scrollIntoView();
                        } else {
                            element.get(0).scrollIntoView();
                        }
                    }
                });
            }
        };
    });
