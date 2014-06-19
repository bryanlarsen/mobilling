angular.module("moBilling.controllers.signOut", [])

    .controller("SignOutController", function ($scope, $location) {
        window.localStorage.removeItem("authenticationToken");
        $location.replace();
        $location.path("/sign-in");
    });
