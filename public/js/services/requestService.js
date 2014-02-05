angular.module('mainApp.services')
.factory('requestService', ['$http', function($http) {
  // location of API service
  var BASE_URL = 'http://localhost:3001/';
  var self = {};

  // handle GET requests with route and query params
  self.get = function(route) {
    var promise = $http.get(BASE_URL+route)
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  // handle POST requests with route and data
  self.post = function(route, data) {
    console.log("The Route:");
    console.log(route);
    console.log("______________");
    console.log("The Data:");
    console.log(data);
    console.log("______________");
    var promise = $http.post(BASE_URL+route, data)
    .then(function(response) {
      console.log("The Response:");
      console.log(response);
      console.log("______________");
      return response.data;
    }, function(error) {
      console.log("The Error:");
      console.log(error);
      console.log("______________");
      return error.data;
    });
    return promise;
  };

  self.put = function(route, data) {
    console.log("The Route:");
    console.log(route);
    console.log("______________");
    console.log("The Data:");
    console.log(data);
    console.log("______________");
    var promise = $http.put(BASE_URL+route, data)
    .then(function(response) {
      console.log("The Response:");
      console.log(response);
      console.log("______________");
      return response.data;
    }, function(error) {
      console.log("The Error:");
      console.log(error);
      console.log("______________");
      return error.data;
    });
    return promise;
  };

  self.delete = function(route) {
    var promise = $http.delete(BASE_URL+route)
    .then(function(response) {
      return response.data;
    }, function(error) {
      return error.data;
    });
    return promise;
  };

  return self;
}]);