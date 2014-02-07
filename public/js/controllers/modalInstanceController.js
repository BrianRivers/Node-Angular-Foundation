angular.module('mainApp.controllers')
.controller('modalInstanceCtrl', function modalController ($scope, $modalInstance, user, session, User, $timeout) {
    //Every modal needs it's own controller and has it's own scope.
    $scope.session = session;
    if(user !== null) {
      $scope.user = user;
      $scope.header = "Edit User";
    } else {
      $scope.user = {
        username: null,
        password: null,
        firstName: null,
        lastName: null,
        email: null,
        RoleId: null
      };
      $scope.header = "Create User";
    }
    $scope.isModal = true;

    // Username is a required field
    $scope.save = function (form) {
      console.log($scope.user);
      if (form.$valid && $scope.user.username && $scope.user.email && $scope.user.RoleId) {
        $scope.ok($scope.user);
      }
    };

    $scope.ok = function(result) {
      if(result.id) {
        // logging the returned values to check if the save was a success
        User.edit(result)
        .then(function(res) {
          console.log("Edited user from Modal returned info:");
          console.log(res);
          $modalInstance.close();
        }, function(err) {
          console.log("Edit error");
          console.log(err);
          $modalInstance.close();
        });
      } else {
        User.create(result)
        .then(function(res) {
          console.log("Created user from Modal returned info:");
          console.log(res);
          $modalInstance.close();
        }, function(err) {
          console.log("Create error");
          console.log(err);
          $modalInstance.close();
        });
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
});