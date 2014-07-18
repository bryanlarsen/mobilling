angular.module("moBilling.directives.date", [])

    .directive("mbDate", function (dateFilter) {
        return {
            restrict: "A",
            require: "ngModel",
            priority: 1,
            link: function (scope, element, attributes, ngModelController) {

                if (!Modernizr.inputtypes.date) {
                    $(element).datepicker({autoclose: true, format: 'yyyy-mm-dd'});
                }

                ngModelController.$formatters.push(function (modelValue) {
                    var year, month, day;

                    try{
                        year  = parseInt(modelValue.split("-")[0], 10);
                        month = parseInt(modelValue.split("-")[1], 10) - 1;
                        day   = parseInt(modelValue.split("-")[2], 10);

                        return new Date(year, month, day);
                    }catch (e){
                        return undefined;
                    }

                });

                ngModelController.$parsers.push(function (viewValue) {
                    try{
                        return dateFilter(viewValue, "yyyy-MM-dd");
                    }catch (e){
                        return undefined;
                    }
                    
                });
                
            }
        };
    });
