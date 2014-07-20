angular.module("moBilling.controllers.accountEdit", [])

  .controller("AccountEditController", function ($scope, User, user) {

    $scope.user = user.toJSON();

    $scope.submit = function () {
      console.log("submit", $scope.user.name, $scope.user.email)
    }

    $scope.save = function () {
      // $scope.submitting = true;
      // $scope.user.status = "saved";
      console.log("Save", $scope.user.name, $scope.user.email)
      $scope.user.name = "aaa"
      // User.save($scope.user, function () {
      //     console.log("saved");
      //     $scope.submitting = false;
      // }, function () {
      //     $scope.submitting = false;
      // });
    };
  });
