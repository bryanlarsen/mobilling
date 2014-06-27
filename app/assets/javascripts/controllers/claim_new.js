angular.module("moBilling.controllers.claimNew", [])

    .controller("ClaimNewController", function ($location) {
        $location.path("/claims/" + window.uuid.v4() + "/edit");
    });
