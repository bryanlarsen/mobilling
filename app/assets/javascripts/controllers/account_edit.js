angular.module("moBilling.controllers.accountEdit", [])

  .controller("AccountEditController", function ($scope, User, user) {

    $scope.user = user.toJSON();
    $scope.updateStatus = null;

    $scope.save = function () {
      $scope.submitted = true;
      if ($scope.userForm.$valid) {
          $scope.submitting = true;
          $scope.updateStatus = null;
          updateUser = _.omit(_.cloneDeep($scope.user), ["agents"])
          User.save(updateUser, function () {
              $scope.submitting = false;
              $scope.updateStatus = "saved";
              console.log("saved", $scope.updateStatus)
          }, function () {
              $scope.submitting = false;
              $scope.updateStatus = "error";
              console.log("error", $scope.updateStatus)
          });
      } else {

      }
    };
  });
