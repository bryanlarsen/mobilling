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
                            var ref;

                            if (attributes.min) {
                                ref = this.get("min").pick;
                            }

                            if (attributes.max) {
                                ref = this.get("max").pick;
                            }

                            if (ref !== undefined) {
                                var hours = Math.abs(time.pick - ref) / 60;

                                return  "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h</sm!all>";
                            } else {
                                return "HH:i";
                            }
                        },
                        min: attributes.min === undefined ? false : attributes.min,
                        max: attributes.max === undefined ? false : attributes.max
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
