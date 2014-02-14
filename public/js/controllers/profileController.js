angular.module('mainApp.controllers')
.controller('profileController', ['$scope', '$route', '$location', '$alert', 'SessionService', 'userService', function($scope, $route, $location, $alert, Session, User) {
  // set session data and title for page
  $scope.session = Session;
  $scope.$alert = $alert;
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
    // validate form and required fields then process
    if (form.$valid && $scope.user.username && $scope.user.email && $scope.user.RoleId) {
      User.edit($scope.user)
      .then(function(result) {
        console.log("This is what is returned:");
        console.log(result);
        $alert.makeAlert("success", "Profile successfully updated");
      });
    }
  };

  $scope.cancel = function() {
    // redirect to home
    $location.path('/');
  };
}]);