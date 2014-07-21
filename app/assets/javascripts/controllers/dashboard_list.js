angular.module("moBilling.controllers.dashboardList", [])
  .controller("DashboardListController", function () {
    $scope.doctors = doctors.toJSON();
  });
