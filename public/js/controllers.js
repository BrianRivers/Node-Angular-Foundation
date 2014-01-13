/* Controllers */
angular.module('mainApp.controllers', [])
.controller('loginController', ['$scope', '$location', 'UserService', function($scope, $location, User) {
  $scope.user = User;
  // verify user credentials for sign in
  $scope.submit = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      User.login(self);
    }
  };
  $scope.logout = function() {
    User.logout();
    $location.path('/');
  };
}])
.controller('homeController', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}])
.controller('userListController', ['$scope', 'UserService', function($scope, User){
  if (User.loggedIn) {
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