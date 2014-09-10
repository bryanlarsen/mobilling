angular.module("moBilling.directives")

    .directive("mbTime", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text">',
            link: function (scope, element, attributes, ngModelController) {
                element.focus(function () {
                    element.blur();

                    var picker = element.pickatime({
                        interval: 15,
                        format: "HH:i",
                        container: "body",
                        min: attributes.min === undefined ? false : attributes.min,
                        max: attributes.max === undefined ? false : attributes.max,
                        formatLabel: function (time) {
                            if (this.get("min").pick) {
                                var hours = (time.pick - this.get("min").pick) / 60;

                                return  "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h</sm!all>";
                            } else {
                                return "HH:i";
                            }
                        }
                    }).pickatime("picker");

                    picker.on("close", function () {
                        picker.stop();
                    });
                });
            }
        };
    });
