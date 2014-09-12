angular.module("moBilling.controllers")

    .controller("SidebarController", function ($scope, currentUser) {
        $scope.currentUser = currentUser;
    });
