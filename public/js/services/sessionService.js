angular.module('mainApp.services')
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
        requestService.post('authenticate', data)
        .then(function(data) {
          // store returned user info in session
          if (data.user) {
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
        self.alerts.splice(0, 1);
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
});