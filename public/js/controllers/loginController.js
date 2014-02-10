angular.module('mainApp.controllers')
.controller('loginController', ['$scope', '$location', 'SessionService', function($scope, $location, Session) {
  // set session data for navbar
  $scope.session = Session;
  
  // verify user credentials for sign in
  $scope.login = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      Session.login(self);
    }
  };

  // remove session data and redirect to home page
  $scope.logout = function() {
    Session.logout();
    $location.path('#/');
  };
}]);