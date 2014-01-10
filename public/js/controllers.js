angular.module('mainApp.controllers', [])
.controller('loginController', ['$scope', '$http', 'UserService', function($scope, $http, User) {
  $scope.submit = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      $http.post('http://localhost:3001/authenticate', {
        username: this.usernameInput,
        password: this.passwordInput
      })
      .success(function(data) {
        if (data) {
          User.username = data.user.username;
          User.key = data.user.key;
          User.firstName = data.user.firstName;
          User.lastName = data.user.lastName;
          User.email = data.user.email;
          User.loggedIn = true;
        }
        $('#login-dropdown').removeClass('open');
      })
      .error(function(err) {
        console.log(err);
        self.submitted = 'Not Authorized';
      });
      this.usernameInput = '';
      this.passwordInput = '';
    }
  };
}])
.controller('mainController', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}])
.controller('secureController', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}]);