angular.module("moBilling.directives")

    .directive("mbTime", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: function (element, attributes) {
                if (Modernizr.inputtypes.time) {
                    return '<input type="time">';
                } else {
                    return '<input type="text">';
                }
            },
            link: function (scope, element, attributes, ngModelController) {
                if (Modernizr.inputtypes.time) {
                    var timezoneOffset = new Date(1900, 0, 1).getTimezoneOffset() * 60 * 1000;

                    ngModelController.$formatters.push(function (modelValue) {
                        var hour, minute;

                        if (modelValue) {
                            hour   = parseInt(modelValue.split(":")[0], 10);
                            minute = parseInt(modelValue.split(":")[1], 10);

                            return new Date(Date.UTC(1900, 0, 1, hour, minute) + timezoneOffset);
                        } else {
                            return undefined;
                        }
                    });

                    ngModelController.$parsers.push(function (viewValue) {
                        var hour, minute, date;

                        if (viewValue) {
                            date = new Date(viewValue.getTime() - timezoneOffset);

                            hour   = "0" + date.getUTCHours();
                            minute = "0" + date.getUTCMinutes();

                            return hour.substr(-2) + ":" + minute.substr(-2);
                        } else {
                            return undefined;
                        }
                    });
                } else {
                    $(element).timepicker({ showMeridian: false, defaultTime: false });

                    ngModelController.$formatters.push(function (modelValue) {
                        if (modelValue) {
                            $(element).timepicker("setTime", modelValue);
                        }

                        return modelValue;
                    });
                }
            }
        };
    });
