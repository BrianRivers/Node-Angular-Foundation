var app = angular.module('mainApp', ['ngRoute'])
.factory('UserService', function() {
  var loggedUser = {
    username: "",
    key: "",
    firstName: "",
    lastName: "",
    email: "",
    loggedIn: false
  };
  return loggedUser;
})
.run(['$rootScope', '$location', 'UserService', function($root, $location, User) {
  $root.$on('$routeChangeSuccess', function(scope, curRoute, prevRoute) {
    if (!curRoute.access.isFree && !User.loggedIn) {
      $location.path('/');
    }
  });
}]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'partials/main.html',
      access: { isFree: true }
    })
    .when('/secure', {
      controller: 'secureController',
      templateUrl: 'partials/secure.html',
      access: { isFree: false }
    })
    .otherwise({ redirectTo: '/' });
}]);

app.controller('loginController', ['$scope', '$http', 'UserService', function($scope, $http, User) {
  $scope.submit = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      $http.post('http://localhost:3001/authenticate', {
        username: this.usernameInput,
        password: this.passwordInput
      })
      .success(function(data) {
        if (data) {
          User.username = data.user.username;
          User.key = data.user.key;
          User.firstName = data.user.firstName;
          User.lastName = data.user.lastName;
          User.email = data.user.email;
          User.loggedIn = true;
        }
        $('#login-dropdown').removeClass('open');
      })
      .error(function(err) {
        console.log(err);
        self.submitted = 'Not Authorized';
      });
      this.usernameInput = '';
      this.passwordInput = '';
    }
  };
}]);

app.controller('secureController', ['$scope', 'UserService', function($scope, User){

}]);