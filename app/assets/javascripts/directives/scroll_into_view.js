angular.module("moBilling.directives")

    .directive("mbScrollIntoView", function () {
        return {
            restrict: "A",
            link: function (scope, element, attributes) {
                element.on("focus keypress keyup keydown", function () {
                    var id, label, appContent, sectionContent;

                    appContent = element.closest(".app-content");
                    sectionContent = appContent.find(".scrollable-content *");

                    if (appContent.height() < sectionContent.height()) {
                        console.log("asd");

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
