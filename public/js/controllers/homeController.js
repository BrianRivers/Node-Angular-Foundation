angular.module('mainApp.controllers')
.controller('homeController', ['$scope', '$alert', 'SessionService', function($scope, $alert, Session){
  // set session data for page
  $scope.session = Session;
  $scope.$alert = $alert;
}]);