angular.module('mainApp.services')
.provider('SessionService', function() {
  return {
    $get: ['$timeout', 'requestService', 'localStorageService', '$alert', function($timeout, requestService, localStorageService, $alert) {
      // set vars for service
      var self = {};
      self.info = null;
 
      // verify user credentials to log in
      self.login = function(ctrl) {
        var data = {
          username: ctrl.usernameInput,
          password: ctrl.passwordInput
        };
        requestService.post('authenticate', data)
        .then(function(data) {
          // store returned user info in session
          if (data.user) {
            localStorageService.add('session', data.user);
            self.info = data.user;
            $alert.makeAlert('success', "Login Successful!");
          }
        });
        // reset form and hide it
        ctrl.usernameInput = '';
        ctrl.passwordInput = '';
        $('#login-dropdown').removeClass('open');
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

      // return sessionService
      return self;
    }]
  };
});