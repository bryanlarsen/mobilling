angular.module("moBilling.controllers.dashboardList", [])
  .controller("DashboardListController", function ($scope, doctors, Doctor) {
    $scope.doctors = doctors;
    $scope.predicate = '-name';
    $scope.reverse = false;
  });
