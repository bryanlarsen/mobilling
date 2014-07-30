angular.module("moBilling.directives.date", [])

    .directive("mbDate", function (dateFilter) {
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

                            return new Date(Date.UTC(year, month, day));
                        } else {
                            return undefined;
                        }
                    });

                    ngModelController.$parsers.push(function (viewValue) {
                        return dateFilter(viewValue, "yyyy-MM-dd");
                    });
                } else {
                    $(element).datepicker({ autoclose: true, format: "yyyy-mm-dd" });

                    ngModelController.$formatters.push(function (modelValue) {
                        if (modelValue) {
                            $(element).datepicker("setDate", modelValue);
                        }

                        return modelValue;
                    });
                }
            }
        };
    });
