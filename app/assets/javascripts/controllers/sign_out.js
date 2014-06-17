angular.module("moBilling.controllers.signOutController", [])

    .controller("SignOutController", function ($scope, $location) {
        window.localStorage.removeItem("authenticationToken");
        $location.path("/sign-in");
    });
