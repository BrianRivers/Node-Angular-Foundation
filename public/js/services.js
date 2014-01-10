/* Services */
angular.module('mainApp.services', [])
.factory('UserService', function() {
  var self = {};

    self.username = "";
    self.key = "";
    self.firstName = "";
    self.lastName = "";
    self.email = "";
    self.loggedIn = false;

  self.login = function ($http, ctrl) {
    $http.post('http://localhost:3001/authenticate', {
      username: ctrl.usernameInput,
      password: ctrl.passwordInput
    })
    .success(function(data) {
      if (data) {
        self.username = data.user.username;
        self.key = data.user.key;
        self.firstName = data.user.firstName;
        self.lastName = data.user.lastName;
        self.email = data.user.email;
        self.loggedIn = true;
      }
      $('#login-dropdown').removeClass('open');
    })
    .error(function(err) {
      console.log(err);
    });
    ctrl.usernameInput = '';
    ctrl.passwordInput = '';
  };

  self.logout = function() {
    self.username = "";
    self.key = "";
    self.firstName = "";
    self.lastName = "";
    self.email = "";
    self.loggedIn = false;
  };

  return self;
});