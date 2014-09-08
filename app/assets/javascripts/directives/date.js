angular.module("moBilling.directives")

    .directive("mbDate", function () {
        return {
            restrict: "E",
            require: "ngModel",
            replace: true,
            template: function (element, attributes) {
                if (Modernizr.inputtypes.date) {
                    return '<input type="date">';
                } else {
                    return '<input type="text">';
                }
            },
            link: function (scope, element, attributes, ngModelController) {
                if (Modernizr.inputtypes.date) {
                    ngModelController.$formatters.push(function (modelValue) {
                        var year, month, day;

                        if (modelValue) {
                            year  = parseInt(modelValue.split("-")[0], 10);
                            month = parseInt(modelValue.split("-")[1], 10) - 1;
                            day   = parseInt(modelValue.split("-")[2], 10);

                            // angular displays "2014-07-31" as
                            // "2014-07-30" when the timezone offset
                            // is a positive number - we need to add
                            // it to prevent this behaviour

                            return new Date(Date.UTC(year, month, day) + new Date().getTimezoneOffset() * 60 * 1000);
                        } else {
                            return undefined;
                        }
                    });

                    ngModelController.$parsers.push(function (viewValue) {
                        if (viewValue) {
                            return new Date(viewValue.getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().substr(0, 10);
                        } else {
                            return undefined;
                        }
                    });
                } else {
                    element.focus(function (event) {
                        event.stopImmediatePropagation();
                    });

                    element.wrap('<div class="input-group date">');
                    element.after('<span class="input-group-addon"><i class="fa fa-calendar"></i></span>');
                    element = element.parent();

                    attributes.$observe("min", function (min) {
                        element.datepicker("setStartDate", min);
                    });

                    attributes.$observe("max", function (max) {
                        element.datepicker("setEndDate", max);
                    });

                    element.datepicker({ autoclose: true, format: "yyyy-mm-dd" });

                    ngModelController.$formatters.push(function (modelValue) {
                        if (modelValue) {
                            element.datepicker("setDate", modelValue);
                        }

                        return modelValue;
                    });
                }
            }
        };
    });
