angular.module("moBilling.controllers")

    .controller("SignOutController", function ($scope, $location) {
        window.localStorage.removeItem("authenticationToken");
        $location.path("/sign-in").hash("").replace();
    });
