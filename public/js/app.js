var app = angular.module('testApp', []);

app.controller('testController', ['$scope', '$http', function($scope, $http) {
  $scope.submit = function() {
    if (this.username && this.password) {
      var self = this;
      $http.post('http://localhost:3001/authenticate', {
        username: this.username,
        password: this.password
      })
      .success(function(data) {
        if (data) {
          console.log(data.meta.success);
          self.submitted = 'Success!';
        } else {
          self.submitted = 'Not Authorized';
        }
      })
      .error(function(err) {
        console.log(err);
        self.submitted = 'Not Authorized';
      });
      this.username = '';
      this.password = '';
    }
  };
}]);