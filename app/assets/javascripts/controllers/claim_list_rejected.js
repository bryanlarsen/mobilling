angular.module("moBilling.controllers")

    .controller("ClaimListRejectedController", function ($scope, claims, user) {
        $scope.user = user;
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "rejected_doctor_attention" || claim.status === "rejected_admin_attention";
        });
    });
