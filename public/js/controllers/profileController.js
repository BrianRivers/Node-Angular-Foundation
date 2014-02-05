angular.module('mainApp.controllers')
.controller('profileController', ['$scope', '$route', 'SessionService', 'userService', function($scope, $route, Session, user) {
  // set session data for page
  $scope.session = Session;
  $scope.isProfile = true;
  $scope.header = "Profile";

  // search for user by id for profile display
  user.userSearch(Session.info.id)
  .then(function(data) {
    if (data !== undefined && data.meta.success) {
      $scope.user = data.users;
    }
  });

  $scope.saveEdit = function() {
    if (this.username) {
      $scope.user.username = this.username;
    }
    if (this.password) {
      if (confirm('Are you sure you want a new password?')) {
        $scope.user.password = this.password;
      }
    } else { // Set to null so that the old password isn't altered
      $scope.user.password = null;
    }
    if (this.firstName) {
      $scope.user.firstName = this.firstName;
    }
    if (this.lastName) {
      $scope.user.lastName = this.lastName;
    }
    if (this.email) {
      $scope.user.email = this.email;
    }
    if (this.RoleId) {
      $scope.user.RoleId = this.RoleId;
    }
    
    console.log("The value being sent:");
    console.log($scope.user);
    console.log("______________");
    // logging the returned values to check if the save was a success
    // Even though a success is returned the values in the objects
    // are not changed
    user.userSaveEdit($scope.user)
    .then(function(result) {
      console.log("This is what is returned:");
      console.log(result);
      console.log("-----------------------------------");
    })
    .then(function() {$route.reload();});
  };
}]);