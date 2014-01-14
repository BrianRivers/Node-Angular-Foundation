/* Controllers */
angular.module('mainApp.controllers', [])
.controller('loginController', ['$scope', '$location', 'SessionService', function($scope, $location, Session) {
  // set session data for navbar
  $scope.session = Session;
  
  // verify user credentials for sign in
  $scope.submit = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      Session.login(self);
    }
  };

  $scope.profile = function() {

  };

  // remove session data and redirect to home page
  $scope.logout = function() {
    Session.logout();
    $location.path('/');
  };
}])
.controller('homeController', ['$scope', 'SessionService', function($scope, Session){
  // set session data for page
  $scope.session = Session;
}])
.controller('userListController', ['$scope', 'SessionService', 'UserService', function($scope, Session, User){
  // check for session
  if (Session.info) {

    // list users in table or log error
    User.userList().then(function(data) {
      if (data.meta.success) {
        $scope.users = data.users;
      } else {
        console.log(data);
      }
    });

    // edit user
    $scope.editUser = function(val) {
      alert('edit: ' + val);
    };

    // delete user
    $scope.deleteUser = function(val) {
      alert('delete: ' + val);
    };
  }
}]);