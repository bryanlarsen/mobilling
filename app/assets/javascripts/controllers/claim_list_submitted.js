angular.module("moBilling.controllers")

    .controller("ClaimListSubmittedController", function ($scope, claims, user) {
        $scope.user = user;
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "unprocessed" || claim.status === "processed";
        });
    });
