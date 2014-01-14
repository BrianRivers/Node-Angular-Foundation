/* Services */
angular.module('mainApp.services', [])
.factory('UserService', ['$http', 'localStorageService', function($http, localStorageService) {
  var self = {};
    self.loggedIn = false;

  self.login = function (ctrl) {
    $http.post('http://localhost:3001/authenticate', {
      username: ctrl.usernameInput,
      password: ctrl.passwordInput
    })
    .success(function(data) {
      if (data) {
        localStorageService.add('user', data.user);
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
    localStorageService.clearAll();
    self.loggedIn = false;
  };

  self.userCheck = function() {
    if(localStorageService.get('user') !== null) {
      var now = moment();
      var user = localStorageService.get('user');
      var updated_date = user.key.updatedAt;
      if(now.diff(updated_date, 'hours') > 12) {
        localStorageService.clearAll();
      } else {
        self.loggedIn = true;
      }
    } else {
      self.loggedIn = false;
    }
  };

  return self;
}]);