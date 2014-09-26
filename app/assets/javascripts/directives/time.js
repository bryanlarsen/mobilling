angular.module("moBilling.directives")

    .directive("mbTime", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: '<input type="text" readonly>',
            link: function (scope, element, attributes, ngModelController) {
                function validate() {
                    ngModelController.$setValidity("min", attributes.min ? attributes.min <= ngModelController.$viewValue : true);
                    ngModelController.$setValidity("max", attributes.max ? attributes.max >= ngModelController.$viewValue : true);
                }

                attributes.$observe("min", validate);
                attributes.$observe("max", validate);

                ngModelController.$parsers.unshift(function (viewValue) {
                    validate();

                    return viewValue;
                });

                element.on("click", function () {
                    var picker = element.pickatime({
                        interval: 15,
                        format: "HH:i",
                        container: "body",
                        formatLabel: function (time) {
                            var min, max;

                            if (attributes.min) {
                                min = this.parse(null, attributes.min);
                                max = time.pick;
                            } else if (attributes.max) {
                                max = this.parse(null, attributes.max);
                                min = time.pick;
                            } else {
                                return "HH:i";
                            }

                            var hours = (max - min) / 60;
                            if (hours < 0) {
                                hours = hours + 24;
                            }

                            return  "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h</sm!all>";
                        }
                    }).pickatime("picker");

                    picker.start();
                    picker.open();

                    picker.on("close", function () {
                        element.blur();
                        picker.stop();
                        element.attr({ readonly: true });
                    });

                    return false;
                });
            }
        };
    });
