angular.module('mainApp.controllers')
.controller('homeController', ['$scope', 'SessionService', function($scope, Session){
  // set session data for page
  $scope.session = Session;
}]);