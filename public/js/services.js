/* Services */
var BASE_URL = 'http://localhost:3001/';
angular.module('mainApp.services', [])
.factory('SessionService', ['$http', '$timeout', 'localStorageService', function($http, $timeout, localStorageService) {
  // set vars for service
  var self = {};
  self.info = null;
  self.alerts = []; // To store alerts that are displayed

  // verify user credentials to log in
  self.login = function (ctrl) {
    $http.post(BASE_URL+'authenticate', {
      username: ctrl.usernameInput,
      password: ctrl.passwordInput
    })
    .success(function(data) {
      if (data) {
        // store returned user info in session
        localStorageService.add('session', data.user);
        self.info = data.user;
        self.alerts.push({type:'success', msg: "Login Successful!"});
      }
      // reset form and hide it
      ctrl.usernameInput = '';
      ctrl.passwordInput = '';
    })
    .error(function(err) {
      // display error and reset form
      console.log(err);
      ctrl.usernameInput = '';
      ctrl.passwordInput = '';
      self.makeAlert('danger', "Username or Password are misspelled or do not exist.");
    });
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
  };

  self.timeOutAlert = function() {
    $timeout(function() {
      self.alerts.splice(0, 1);
    }, 3000);
  };

  return self;
}])
.factory('httpRequestInterceptor', ['localStorageService',
  function (localStorageService) {
    return {
      // override requests to add key to header from session info
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

  // searches for single user by id
  self.userSearch = function(id) {
    var promise = $http.get(BASE_URL+'users/'+id)
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  // searches for all users against api
  self.userList = function() {
    // promise info http://stackoverflow.com/a/12513509/1415348
    var promise = $http.get(BASE_URL+'users')
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  return self;
}])
.factory('HttpErrorInterceptor', function($q) {
  return {

    'response': function (response) {
      //Will only be called for HTTP up to 300
      return response;
    },
   'requestError': function(rejection) {
      // I can't figure out how to do angularjs history
      // I tried to look that up but the only thing I could find
      // was the .run doing .$on('rounteChangeSuccess') and I don't know how
      // to make the interceptor factory and the .run to interact.
      if(rejection.status === 401) {
        $location.path('/');
        Session.logout();
        Session.makeAlert('danger', 'You must login first');
      } else if(rejection.status === 403) {
        $location.path('/');
        Session.makeAlert('danger', 'You do not have access to this page');
        console.log(rejection);
      } else if(rejection.status === 500) {
        $location.path('/');
        Session.makeAlert('warning', 'There was a server error');
      }
      return $q.reject(rejection);
    }
  };
});