angular.module("moBilling.controllers.dashboardList", [])
  .controller("DashboardListController", function ($scope, doctors, Doctor) {
    $scope.doctors = doctors;
    $scope.predicate = 'name';
    $scope.reverse = false;

    $scope.clickHeader = function(field) {
      if ($scope.predicate == field) {
        $scope.reverse = !$scope.reverse;
      } else {
        $scope.predicate = field;
        $scope.reverse = false;
      }
    };

  });
