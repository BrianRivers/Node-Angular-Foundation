/* Controllers */
angular.module('mainApp.controllers', [])
.controller('loginController', ['$scope', '$location', 'SessionService', function($scope, $location, Session) {
  $scope.session = Session;
  // verify user credentials for sign in
  $scope.submit = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      Session.login(self);
    }
  };
  $scope.logout = function() {
    Session.logout();
    $location.path('/');
  };
}])
.controller('homeController', ['$scope', 'SessionService', function($scope, Session){
  $scope.session = Session;
}])
.controller('userListController', ['$scope', 'SessionService', 'UserService', function($scope, Session, User){
  if (Session.info) {
    // List users in table or log error
    User.userList().then(function(data) {
      if (data.meta.success) {
        $scope.users = data.users;
      } else {
        console.log(data);
      }
    });
    $scope.editUser = function(val) {
      alert('edit: ' + val);
    };
    $scope.deleteUser = function(val) {
      alert('delete: ' + val);
    };
  }
}]);