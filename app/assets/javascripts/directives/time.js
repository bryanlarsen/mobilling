angular.module("moBilling.directives")

    .directive("mbTime", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text">',
            link: function (scope, element, attributes, ngModelController) {
                element.on("click focus", function () {
                    var picker = element.pickatime({
                        interval: 15,
                        format: "HH:i",
                        container: "body",
                        formatLabel: function (time) {
                            var ref;

                            if (attributes.min) {
                                ref = this.get("min").pick;
                            }

                            if (attributes.max) {
                                ref = this.get("max").pick;
                            }

                            if (ref) {
                                var hours = Math.abs(time.pick - ref) / 60;

                                return  "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h</sm!all>";
                            } else {
                                return "HH:i";
                            }
                        }
                    }).pickatime("picker");

                    picker.set({
                        min: attributes.min === undefined ? false : attributes.min,
                        max: attributes.max === undefined ? false : attributes.max
                    });

                    picker.on("close", function () {
                        element.blur();
                    });

                    return false;
                });
            }
        };
    });
