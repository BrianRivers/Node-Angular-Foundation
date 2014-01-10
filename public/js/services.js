/* Services */
angular.module('mainApp.services', [])
.factory('UserService', function() {
  var self = {};

    // create user
    self.loggedUser = {
      username: "",
      key: "",
      firstName: "",
      lastName: "",
      email: "",
      loggedIn: false
    };

  self.login = function ($http, ctrl) {
    $http.post('http://localhost:3001/authenticate', {
      username: ctrl.usernameInput,
      password: ctrl.passwordInput
    })
    .success(function(data) {
      if (data) {
        self.loggedUser.username = data.user.username;
        self.loggedUser.key = data.user.key;
        self.loggedUser.firstName = data.user.firstName;
        self.loggedUser.lastName = data.user.lastName;
        self.loggedUser.email = data.user.email;
        self.loggedUser.loggedIn = true;
      }
      $('#login-dropdown').removeClass('open');
    })
    .error(function(err) {
      console.log(err);
    });
    ctrl.usernameInput = '';
    ctrl.passwordInput = '';
  };

  return self;
});