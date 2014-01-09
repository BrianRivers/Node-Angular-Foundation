var app = angular.module('testApp', []);

app.controller('testController', ['$scope', '$http', function($scope, $http) {
  $scope.submit = function() {
    if (this.username && this.password) {
      var self = this;
      $.post('http://localhost:3001/authenticate', {
        username: this.username,
        password: this.password
      })
      .success(function(data) {
        console.log(data);
        self.submitted = 'Success!';
      })
      .error(function(err) {
        console.log(err);
      });
      this.username = '';
      this.password = '';
    }
  };
}]);