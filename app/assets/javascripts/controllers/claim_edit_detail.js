angular.module("moBilling.controllers")

    .controller("ClaimEditDetailController", function ($scope, ServiceCode, feeGenerator) {
        var detail = $scope.detail;

        $scope.service_code = { code: '' };

        $scope.editing = function() {
            return $scope.activated.index === $scope.index(detail);
        }

        $scope.openClaimDetail = function() {
            $scope.activated.index = $scope.index(detail);
        };

        $scope.closeClaimDetail = function() {
            $scope.activated.index = null;
        };

        $scope.addPremium = function() {
            if (detail.premiums) {
                detail.premiums.push({ code: '' });
            } else {
                detail.premiums = [{ code: '' }];
            }
        };

        $scope.removePremium = function(index) {
            detail.premiums.splice(index, 1);
        };


        $scope.$watch('detail', function() {
            feeGenerator($scope.claim, detail).then(function (result) {
                // OK
            });
        }, true);
    });
