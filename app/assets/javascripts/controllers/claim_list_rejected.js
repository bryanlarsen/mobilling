angular.module("moBilling.controllers.claimListRejected", [])

    .controller("ClaimListRejectedController", function ($scope, claims) {
        $scope.claims = claims.filter(function (claim) {
            return claim.status === "rejected_doctor_attention" || claim.status === "rejected_admin_attention";
        });
    });
