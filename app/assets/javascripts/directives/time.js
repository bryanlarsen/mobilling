angular.module("moBilling.directives")

    .directive("mbTime", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text">',
            link: function (scope, element, attributes, ngModelController) {
                var picker = element.pickatime({
                    interval: 15,
                    container: "body",
                    format: "HH:i",
                    formatLabel: function (time) {
                        if (this.get("min").pick) {
                            var hours = (time.pick - this.get("min").pick) / 60;

                            return  "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h</sm!all>";
                        } else {
                            return "HH:i";
                        }
                    }
                }).pickatime("picker");

                attributes.$observe("min", function (min) {
                    picker.set({ min: min === undefined ? false : min });
                });

                attributes.$observe("max", function (max) {
                    picker.set({ max: max === undefined ? false : max });
                });
            }
        };
    });
