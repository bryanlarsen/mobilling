angular.module("moBilling.controllers.claimListAll", [])

    .controller("ClaimListAllController", function ($scope, claims) {
        $scope.claims = claims;
    });
