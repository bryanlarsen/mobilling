angular.module("moBilling.controllers")

    .controller("ClaimListPaidController", function ($scope, claims, user) {
        $scope.user = user;
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "paid";
        });
    });
