/* Services */
angular.module('mainApp.services', [])
.factory('SessionService', ['$http', 'localStorageService', function($http, localStorageService) {
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
        localStorageService.add('session', data.user);
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

  self.sessionCheck = function() {
    if(localStorageService.get('session') !== null) {
      var now = moment();
      var user = localStorageService.get('session');
      var updated_date = user.key.updatedAt;
      if(now.diff(updated_date, 'hours') > 12) {
        localStorageService.clearAll();
      } else {
        self.loggedIn = true;
        // set header for requests
        headers = {
          headers: {
            "x-api-key": localStorageService.get('session').key.id
          }
        };
      }
    } else {
      self.loggedIn = false;
    }
  };

  return self;
}])
.factory('UserService', ['$http', 'localStorageService', function($http, localStorageService) {
  var self = {};
  var headers = {
          headers: {
            "x-api-key": localStorageService.get('session').key.id
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