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
.run(['$rootScope', '$location', 'SessionService', function($root, $location, Session) {
  // check for session logged in and access level on each route
  Session.sessionCheck();
  $root.$on('$routeChangeSuccess', function(scope, curRoute, prevRoute) {
    Session.sessionCheck();
    if (!curRoute.access.isFree && !Session.loggedIn) {
      $location.path('/');
    }
  });
}]);