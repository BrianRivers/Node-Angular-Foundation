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
    $locaction.path('/');
  };
}])
.controller('homeController', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}])
.controller('secureController', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}])
.controller('secure2Controller', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}]);