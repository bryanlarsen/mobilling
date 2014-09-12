angular.module("moBilling.controllers")

    .controller("SignOutController", function ($scope, $location, Session, currentUser) {
        Session.remove().$promise.finally(function () {
            currentUser.signOut();
            $location.path("/sign-in").hash("").replace();
        });
    });
