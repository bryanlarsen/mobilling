angular.module("moBilling.controllers.claimListAll", [])

    .controller("ClaimListAllController", function ($scope, claims) {
        $scope.claims = claims;
        $scope.predicate = 'created_at';
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
