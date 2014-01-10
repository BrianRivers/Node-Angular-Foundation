/* Declare app level module with dependencies */
var app = angular.module('mainApp', [
  'ngRoute',
  'mainApp.services',
  'mainApp.controllers',
])
.config(['$routeProvider',
  function($routeProvider) {
    // configure routes with controller and template
    $routeProvider
    .when('/', {
      controller: 'mainController',
      templateUrl: 'partials/main.html',
      access: { isFree: true }
    })
    .when('/secure', {
      controller: 'secureController',
      templateUrl: 'partials/secure.html',
      access: { isFree: false }
    })
    .otherwise({ redirectTo: '/' });
}])
.run(['$rootScope', '$location', 'UserService', function($root, $location, User) {
  // check for user logged in and access level on each route
  $root.$on('$routeChangeSuccess', function(scope, curRoute, prevRoute) {
    if (!curRoute.access.isFree && !User.loggedIn) {
      $location.path('/');
    }
  });
}]);