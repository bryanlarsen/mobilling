angular.module("moBilling.controllers")

    .controller("ClaimListSavedController", function ($scope, claims, user) {
        $scope.user = user;
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "saved";
        });
    });
