/* Declare app level module with dependencies */
var app = angular.module('mainApp', [
  'ngRoute',
  'mainApp.services',
  'mainApp.controllers',
  'LocalStorageModule',
])
.config(['$routeProvider',
  function($routeProvider) {
    // configure routes with controller and template
    $routeProvider
    .when('/', {
      controller: 'homeController',
      templateUrl: 'partials/home.html',
      access: { isFree: true }
    })
    .when('/users/list', {
      controller: 'userListController',
      templateUrl: 'partials/userlist.html',
      access: { isFree: false }
    })
    .otherwise({ redirectTo: '/' });
}])
.run(['$rootScope', '$location', 'UserService', function($root, $location, User) {
  // check for user logged in and access level on each route
  User.userCheck();
  $root.$on('$routeChangeSuccess', function(scope, curRoute, prevRoute) {
    User.userCheck();
    if (!curRoute.access.isFree && !User.loggedIn) {
      $location.path('/');
    }
  });
}]);