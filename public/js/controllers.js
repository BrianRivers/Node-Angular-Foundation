/* Controllers */
angular.module('mainApp.controllers', [])
.controller('loginController', ['$scope', '$http', 'UserService', function($scope, $http, User) {
  // verify user credentials for sign in
  $scope.submit = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      User.login($http, self);
    }
  };
}])
.controller('mainController', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}])
.controller('secureController', ['$scope', 'UserService', function($scope, User){
  $scope.user = User;
}]);