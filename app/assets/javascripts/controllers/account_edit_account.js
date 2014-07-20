angular.module("moBilling.controllers.accountEdit", [])

  .controller("AccountEditAccountController", function ($scope, User) {
    $scope.user = User.get();

    $scope.save = function () {
      $scope.submitting = true;
      $scope.user.status = "saved";
      User.save($scope.user, function () {
          console.log("saved");
      }, function () {
          $scope.submitting = false;
      });
    };
  });
