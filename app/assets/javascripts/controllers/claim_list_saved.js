angular.module("moBilling.controllers")

    .controller("ClaimListSavedController", function ($scope, claims) {
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "saved";
        });
    });
