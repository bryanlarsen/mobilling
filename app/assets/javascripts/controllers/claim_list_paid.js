angular.module("moBilling.controllers")

    .controller("ClaimListPaidController", function ($scope, claims) {
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "paid";
        });
    });
