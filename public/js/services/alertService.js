angular.module('mainApp.services')
.provider('$alert', function() {
  return {
    $get: ['$timeout', function($timeout) {
      // set vars for service
      var self = {};
      self.alerts = []; // To store alerts that are displayed

      //To add an alert that will fade after 3 seconds
      self.makeAlert = function(type, msg) {
        self.alerts.splice(0, 1);
        self.alerts.push({type: type, msg: msg});
        self.timeOutAlert();
      };

      // To remove alerts when the 'x' button is pressed
      self.closeAlert = function(index) {
        self.alerts.splice(index, 1);
      };

      self.timeOutAlert = function() {
        $timeout(function() {
          self.alerts.splice(0, 1);
        }, 3000);
      };

      self.test = "test";

      // return sessionService
      return self;
    }]
  };
});