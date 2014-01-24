/* Services */
var BASE_URL = 'http://localhost:3001/';
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
  var self = {};

  self.get = function(route) {
    var promise = $http.get(BASE_URL+route)
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  self.post = function(route, data) {
    var promise = $http.post(BASE_URL+route, data)
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
      return {
        // set vars for service
        info: null,
        alerts: [], // To store alerts that are displayed
        login: function(ctrl) {
          var data = {
            username: ctrl.usernameInput,
            password: ctrl.passwordInput
          };
          requestService.post('authenticate', data).
          then(function(data) {
            // store returned user info in session
            localStorageService.add('session', data.user);
            this.info = data.user;
            this.alerts.push({type:'success', msg: "Login Successful!"});
          }, function(err) {
            console.log(err);
            this.makeAlert('danger', "Username or Password are misspelled or do not exist.");
          });
          // reset form and hide it
          ctrl.usernameInput = '';
          ctrl.passwordInput = '';
          $('#login-dropdown').removeClass('open');
          this.timeOutAlert();
        },

        // remove session info for logout
        logout: function() {
          localStorageService.clearAll();
          this.info = false;
        },

        // insure user has active session when peforming actions
        sessionCheck: function() {
          if(localStorageService.get('session') !== null) {
            var now = moment();
            var session = localStorageService.get('session');
            var updated_date = session.key.updatedAt;
            // force sign in after set time
            if(now.diff(updated_date, 'hours') > 12) {
              localStorageService.clearAll();
              this.info = null;
            } else {
              this.info = session;
            }
          } else {
            this.info = null;
          }
        },

        // To remove alerts when the 'x' button is pressed
        closeAlert: function(index) {
          this.alerts.splice(index, 1);
        },

        makeAlert: function(type, msg) {
          this.alerts.push({type: type, msg: msg});
        },

        timeOutAlert: function() {
          $timeout(function() {
            this.alerts.splice(0, 1);
          }, 3000);
        }
      };
    }]
  };
})
.factory('UserService', ['requestService', 'localStorageService', function(requestService, localStorageService) {
  var self = {};

  // searches for single user by id
  self.userSearch = function(id) {
    return requestService.get('users/'+id);
  };

  // searches for all users against api
  self.userList = function() {
    return requestService.get('users');
  };

  return self;
}]);