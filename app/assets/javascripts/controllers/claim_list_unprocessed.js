angular.module("moBilling.controllers.claimListUnprocessed", [])

    .controller("ClaimListUnprocessedController", function ($scope, claims) {
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "unprocessed";
        });
    });
