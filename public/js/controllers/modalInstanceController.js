angular.module('mainApp.controllers')
.controller('modalInstanceCtrl', function modalController ($scope, $modalInstance, user, session, User) {
    // set session data and title for page
    $scope.session = session;
    if(user !== null) {
      $scope.user = user;
      $scope.header = "Edit User";
      $scope.originalUser = angular.copy(user);
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

    $scope.save = function (form) {
      console.log($scope.user);
      // validate form and required fields then process
      if (form.$valid && $scope.user.username && $scope.user.email && $scope.user.RoleId) {
        $scope.ok($scope.user);
      }
    };

    $scope.ok = function(result) {
      // create or update user and dismiss modal
      if(result.id) {
        User.edit(result)
        .then(function(res) {
          $modalInstance.close();
        }, function(err) {
          $modalInstance.close();
        });
      } else {
        User.create(result)
        .then(function(res) {
          $modalInstance.close(res.users);
        }, function(err) {
          $modalInstance.close();
        });
      }
    };

    $scope.cancel = function () {
      // revert to original user and dismiss modal
      angular.copy($scope.originalUser, $scope.user);
      $modalInstance.dismiss('cancel');
    };
});