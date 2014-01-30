/* Services */
angular.module('mainApp.services', [])
.factory('httpInterceptor', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {
    return {
      // override requests to add key to header from session info
      request: function (config) {
        if(localStorageService.get('session') !== null) {
          config.headers = {'x-api-key': localStorageService.get('session').key.id};
          return config;
        } else {
          return config;
        }
      },
      // response error handling and redirection
      responseError: function(rejection) {
          var sessionService = $injector.get("SessionService");
          if(rejection.status === 401) {
            $location.path('/');
            sessionService.logout();
            sessionService.makeAlert('danger', 'You must login first');
          } else if(rejection.status === 403) {
            $location.path('/');
            sessionService.makeAlert('danger', 'You do not have access to this page');
          } else if(rejection.status === 500) {
            $location.path('/');
            sessionService.makeAlert('warning', 'There was a server error');
          }
          return $q.reject(rejection);
        }
    };
}])
.factory('requestService', ['$http', function($http) {
  // location of API service
  var BASE_URL = 'http://localhost:3001/';
  var self = {};

  // handle GET requests with route and query params
  self.get = function(route) {
    var promise = $http.get(BASE_URL+route)
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  // handle POST requests with route and data
  self.post = function(route, data) {
    console.log("The Route:");
    console.log(route);
    console.log("______________");
    console.log("The Data:");
    console.log(data);
    console.log("______________");
    var promise = $http.post(BASE_URL+route, data)
    .then(function(response) {
      console.log("The Response:");
      console.log(response);
      console.log("______________");
      return response.data;
    }, function(error) {
      console.log("The Error:");
      console.log(error);
      console.log("______________");
      return error.data;
    });
    return promise;
  };

  self.put = function(route, data) {
    console.log("The Route:");
    console.log(route);
    console.log("______________");
    console.log("The Data:");
    console.log(data);
    console.log("______________");
    var promise = $http.put(BASE_URL+route, data)
    .then(function(response) {
      console.log("The Response:");
      console.log(response);
      console.log("______________");
      return response.data;
    }, function(error) {
      console.log("The Error:");
      console.log(error);
      console.log("______________");
      return error.data;
    });
    return promise;
  };

  self.delete = function(route) {
    var promise = $http.delete(BASE_URL+route)
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  return self;
}])
.provider('SessionService', function() {
  return {
    $get: ['$timeout', 'requestService', 'localStorageService', function($timeout, requestService, localStorageService) {
      // set vars for service
      var self = {};
      self.info = null;
      self.alerts = []; // To store alerts that are displayed

      // verify user credentials to log in
      self.login = function(ctrl) {
        var data = {
          username: ctrl.usernameInput,
          password: ctrl.passwordInput
        };
        requestService.post('authenticate', data).
        then(function(data) {
          // store returned user info in session
          if(data.user) {
            localStorageService.add('session', data.user);
            self.info = data.user;
            self.alerts.push({type:'success', msg: "Login Successful!"});
          }
        });
        // reset form and hide it
        ctrl.usernameInput = '';
        ctrl.passwordInput = '';
        $('#login-dropdown').removeClass('open');
        self.timeOutAlert();
      };

      // remove session info for logout
      self.logout = function() {
        localStorageService.clearAll();
        self.info = false;
      };

      // insure user has active session when peforming actions
      self.sessionCheck = function() {
        if(localStorageService.get('session') !== null) {
          var now = moment();
          var session = localStorageService.get('session');
          var updated_date = session.key.updatedAt;
          // force sign in after set time
          if(now.diff(updated_date, 'hours') > 12) {
            localStorageService.clearAll();
            self.info = null;
          } else {
            self.info = session;
          }
        } else {
          self.info = null;
        }
      };

      // To remove alerts when the 'x' button is pressed
      self.closeAlert = function(index) {
        self.alerts.splice(index, 1);
      };

      self.makeAlert = function(type, msg) {
        self.alerts.push({type: type, msg: msg});
        self.timeOutAlert();
      };

      self.timeOutAlert = function() {
        $timeout(function() {
          self.alerts.splice(0, 1);
        }, 3000);
      };

      // return sessionService
      return self;
    }]
  };
})
.factory('userService', ['requestService', function(requestService) {
  var self = {};

  // searches for single user by id
  self.userSearch = function(id) {
    return requestService.get('users/'+id);
  };

  // searches for all users against api
  self.userList = function() {
    return requestService.get('users');
  };

  self.userSaveEdit = function(editedUser) {
    return requestService.put('users/'+editedUser.id, editedUser);
  };

  self.deleteUser = function(id) {
    return requestService.delete('users/'+id);
  };

  self.createUser = function(newUser) {
    return requestService.post('users', newUser);
  };

  return self;
}]);