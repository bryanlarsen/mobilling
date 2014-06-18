angular.module("moBilling.controllers.claimList", [])

    .controller("ClaimListController", function ($scope, claims) {
        $scope.claims = claims;
    });
