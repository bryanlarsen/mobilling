angular.module("moBilling.controllers.claimListSaved", [])

    .controller("ClaimListSavedController", function ($scope, claims) {
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "saved";
        });
    });
