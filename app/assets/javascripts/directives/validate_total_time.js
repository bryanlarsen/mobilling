angular.module("moBilling.directives.validateTotalTime", [])

    .directive("mbValidateTotalTime", function (dateFilter) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attributes, ngModelController) {
                scope.$watchGroup(['claim.consult_time_in', 'claim.consult_time_out'], function() {
                    ngModelController.$setValidity('totalTime', scope.claim.hasValidConsultTime());
                });
            }
        };
    });
