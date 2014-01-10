/* Controllers */
angular.module('mainApp.controllers', [])
.controller('loginController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, User) {
  $scope.user = User;
  // verify user credentials for sign in
  $scope.submit = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      User.login($http, self);
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
.controller('secureController', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}]);