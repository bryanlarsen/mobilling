angular.module("moBilling.controllers")

    .controller("ClaimNewController", function ($location) {
        $location.path("/claims/" + window.uuid.v4() + "/edit");
    });
