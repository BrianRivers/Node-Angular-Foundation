/* Services */
angular.module('mainApp.services', [])
.factory('UserService', ['$http', 'localStorageService', function($http, localStorageService) {
  var self = {};
    self.loggedIn = false;

  // used for custom key header
  var headers;

  self.login = function (ctrl) {
    $http.post('http://localhost:3001/authenticate', {
      username: ctrl.usernameInput,
      password: ctrl.passwordInput
    })
    .success(function(data) {
      if (data) {
        localStorageService.add('user', data.user);
        // set header for requests
        headers = {
          headers: {
            "x-api-key": data.user.key.id
          }
        };
        self.loggedIn = true;
      }
      $('#login-dropdown').removeClass('open');
      ctrl.usernameInput = '';
      ctrl.passwordInput = '';
    })
    .error(function(err) {
      console.log(err);
      ctrl.usernameInput = '';
      ctrl.passwordInput = '';
    });
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
      console.log(now);
      console.log(user);
      console.log(updated_date);
      console.log(now.diff(updated_date, 'hours', true));
      if(now.diff(updated_date, 'hours') > 12) {
        localStorageService.clearAll();
      } else {
        self.loggedIn = true;
        // set header for requests
        headers = {
          headers: {
            "x-api-key": localStorageService.get('user').key.id
          }
        };
      }
    } else {
      self.loggedIn = false;
    }
  };

  // searches for all users against api
  self.userList = function() {
    // promise info http://stackoverflow.com/a/12513509/1415348
    var promise = $http.get('http://localhost:3001/users', headers)
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  return self;
}]);