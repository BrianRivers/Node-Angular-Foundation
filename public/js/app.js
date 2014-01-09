var app = angular.module('mainApp', ['ngRoute'])
.factory('UserService', function() {
  var loggedUser = {
    username : "",
    key : "",
    firstName : "",
    lastName : "",
    email : "",
    loggedIn : false
  };
  return loggedUser;
})
.run(['$rootScope', '$location', 'UserService', function($root, $location, User) {
  $root.$on('$routeChangeSuccess', function(scope, curRoute, prevRoute) {
    console.log(curRoute);
    console.log(prevRoute);
    if (!prevRoute) {
      if (!curRoute.access.isFree && !User.loggedIn) {
        $location.path('/');
      }
    } else {
      if (!prevRoute.access.isFree && !User.loggedIn) {
        $location.path('/');
      }
    }
  });
}]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'mainPage.html',
      access: { isFree: true }
    })
    .when('/secure', {
      controller: 'secureCtrl',
      templateUrl: 'secure.html',
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

app.controller('secureCtrl', ['$scope', 'UserService', function($scope, User){

}]);