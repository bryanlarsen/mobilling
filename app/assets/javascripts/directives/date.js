angular.module("moBilling.directives.date", [])

    .directive("mbDate", function (dateFilter) {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 1,
            link: function (scope, element, attributes, ngModelController) {

                $(element).datepicker({
                    autoclose: true,
                });

                ngModelController.$formatters.push(function (modelValue) {
                    var year, month, day;
                    if (modelValue) {
                        year  = parseInt(modelValue.split("-")[0], 10);
                        month = parseInt(modelValue.split("-")[1], 10) - 1;
                        day   = parseInt(modelValue.split("-")[2], 10);

                        date = new Date(year, month, day);
                        $(element).datepicker('update', date);
                        return dateFormat(date, "mm/dd/yyyy");
                    } else {
                        return undefined;
                    }
                });

                ngModelController.$parsers.push(function (viewValue) {
                    try{
                        year  = parseInt(viewValue.split("/")[2], 10);
                        month = parseInt(viewValue.split("/")[0], 10) - 1;
                        day   = parseInt(viewValue.split("/")[1], 10);

                        date = new Date(year, month, day);
                        return dateFormat(date, "yyyy-mm-dd");

                    }catch (e){
                        return undefined;
                    }
                   
                    // return dateFilter(viewValue, "yyyy-MM-dd");
                });
            }
        };
    });
