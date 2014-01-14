/* Services */
angular.module('mainApp.services', [])
.factory('SessionService', ['$http', 'localStorageService', function($http, localStorageService) {
  var self = {};
  self.info = null;
  
  self.login = function (ctrl) {
    $http.post('http://localhost:3001/authenticate', {
      username: ctrl.usernameInput,
      password: ctrl.passwordInput
    })
    .success(function(data) {
      if (data) {
        localStorageService.add('session', data.user);
        self.info = data.user;
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
    self.info = false;
  };

  self.sessionCheck = function() {
    if(localStorageService.get('session') !== null) {
      var now = moment();
      var session = localStorageService.get('session');
      var updated_date = session.key.updatedAt;
      if(now.diff(updated_date, 'hours') > 12) {
        localStorageService.clearAll();
      } else {
        self.info = session;
      }
    } else {
      self.info = null;
    }
  };

  return self;
}])
.factory('httpRequestInterceptor', ['localStorageService',
  function (localStorageService) {
  return {
    request: function (config) {
      if(localStorageService.get('session') !== null) {
        config.headers = {'x-api-key': localStorageService.get('session').key.id};
        return config;
      } else {
        return config;
      }
    }
  };
}])
.factory('UserService', ['$http', 'localStorageService', function($http, localStorageService) {
  var self = {};
  // searches for all users against api
  self.userList = function() {
    // promise info http://stackoverflow.com/a/12513509/1415348
    var promise = $http.get('http://localhost:3001/users')
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  return self;
}]);