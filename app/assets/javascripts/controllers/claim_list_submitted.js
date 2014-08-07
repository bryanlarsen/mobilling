angular.module("moBilling.controllers.claimListSubmitted", [])

    .controller("ClaimListSubmittedController", function ($scope, claims) {
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "unprocessed" || claim.status === "processed";
        });
    });
