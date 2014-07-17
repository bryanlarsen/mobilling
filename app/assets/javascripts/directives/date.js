angular.module("moBilling.directives.date", [])

    .directive("mbDate", function (dateFilter) {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 1,
            link: function (scope, element, attributes, ngModelController) {

                $(element).datepicker({autoclose: true});

                ngModelController.$formatters.push(function (modelValue) {
                    var year, month, day;

                    try{
                        year  = parseInt(modelValue.split("-")[0], 10);
                        month = parseInt(modelValue.split("-")[1], 10) - 1;
                        day   = parseInt(modelValue.split("-")[2], 10);

                        return dateFormat(new Date(year, month, day), 'mm/dd/yyyy');
                    }catch (e){
                        return undefined;
                    }

                });

                ngModelController.$parsers.push(function (viewValue) {
                    var year, month, day;

                    try{
                        year  = parseInt(viewValue.split("/")[2], 10);
                        month = parseInt(viewValue.split("/")[0], 10) - 1;
                        day   = parseInt(viewValue.split("/")[1], 10);

                        return dateFilter(new Date(year, month, day), "yyyy-MM-dd");
                    }catch (e){
                        return undefined;
                    }
                    
                });
            }
        };
    });
