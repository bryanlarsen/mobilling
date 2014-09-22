angular.module("moBilling.controllers")

    .controller("ClaimEditDetailController", function ($scope, ServiceCode, feeGenerator) {
        var detail = $scope.detail;

        $scope.service_code = {code: ''};
        $scope.fee = 0;
        $scope.units = 0;

        $scope.$watch("detail.code", function(value) {
            if (typeof value !== 'string') return;
            var code = value.toUpperCase().match(/^[A-Z]\d\d\d[A-Z]/);
            if (!code) {
                code = value.toUpperCase().match(/^[A-Z]\d\d\d/);
                if (code) code[0] = code[0]+'A';
            }
            if (code) {
                if (code[0] !== $scope.service_code.code) {
                    var promise = ServiceCode.get({code: code[0]}, function(service_code) {
                        $scope.service_code = service_code;
                    });
                }
            } else {
                $scope.service_code = {code: ''};
            }
        });

        $scope.$watchGroup(['service_code', 'detail.time_in', 'detail.time_out', 'detail.day'], function() {
            if ($scope.service_code) {
                var r = feeGenerator($scope.claim, detail, $scope.service_code);
                detail.fee = r.fee;
                detail.units = r.units;
            }
        });
    });
