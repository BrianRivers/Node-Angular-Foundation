angular.module('mainApp.controllers')
.controller('profileController', ['$scope', '$route', 'SessionService', 'userService', function($scope, $route, Session, User) {
  // set session data for page
  $scope.session = Session;
  $scope.isProfile = true;
  $scope.header = "Profile";

  // search for user by id for profile display
  User.search(Session.info.id)
  .then(function(data) {
    if (data !== undefined && data.meta.success) {
      $scope.user = data.users;
    }
  });

  $scope.save = function(form) {
    console.log($scope.user);
    if (form.$valid && $scope.user.username && $scope.user.email && $scope.user.RoleId) {
      console.log("The value being sent:");
      console.log($scope.user);
      // send off user data to
      User.edit($scope.user)
      .then(function(result) {
        console.log("This is what is returned:");
        console.log(result);
      })
      .then(function() { $route.reload(); });
    }
  };
}]);