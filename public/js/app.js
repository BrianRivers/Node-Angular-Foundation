/* Declare app level module with dependencies */
angular.module('mainApp.services', []);
angular.module('mainApp.controllers', []);
angular.module('mainApp.directives', []);
angular.module('mainApp.filters', []);
var app = angular.module('mainApp', [
  'ngRoute',
  'mainApp.services',
  'mainApp.controllers',
  'mainApp.directives',
  'mainApp.filters',
  'LocalStorageModule',
  'ngAnimate',
  'ui.bootstrap',
  'smartTable.table'
])
.config(['$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider) {
    // add interceptor for additional request and response handling
    $httpProvider.interceptors.push('httpInterceptor');

    // configure routes with controller and template
    $routeProvider
    .when('/', {
      controller: 'homeController',
      templateUrl: 'partials/home.html',
      access: { isFree: true }
    })
    .when('/profile', {
      controller: 'profileController',
      templateUrl: 'partials/userForm.html',
      access: { isFree: false }
    })
    .when('/users/list', {
      controller: 'userListController',
      templateUrl: 'partials/userList.html',
      access: { isFree: false }
    })
    .otherwise({ redirectTo: '/' });
}])
.run(['$rootScope', '$location', 'SessionService', function($root, $location, Session) {
  // check for session logged in and access level on each route
  Session.sessionCheck();
  $root.$on('$routeChangeSuccess', function(scope, curRoute, prevRoute) {
    Session.sessionCheck();
    // redirect to home page if protected page and no session
    if (!curRoute.access.isFree && !Session.info) {
      $location.path('/');
    }
  });
  // idle logout functionality
  var lastDigestRun = moment();
  $root.$watch(function detectIdle() {
    var now = moment();
    if (now.diff(lastDigestRun, 'hour') > 1) {
      Session.logout();
      $location.path('/');
    }
    lastDigestRun = now;
  });
}])
.animation('.my-repeat-animation', function() {
  return {
    enter : function(element, done) {
      jQuery(element).css({
        position:'relative',
        left:-10,
        opacity:0
      });
      jQuery(element).animate({
        left:0,
        opacity:1
      }, done);
    },

    leave : function(element, done) {
      jQuery(element).css({
        position:'relative',
        left:0,
        opacity:1
      });
      jQuery(element).animate({
        left:-10,
        opacity:0
      }, done);
    },

    move : function(element, done) {
      jQuery(element).css({
        opacity:0.5
      });
      jQuery(element).animate({
        opacity:1
      }, done);
    }
  };
});