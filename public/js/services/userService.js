angular.module('mainApp.services')
.factory('userService', ['requestService', function(requestService) {
  var self = {};

  // searches for single user by id
  self.search = function(id) {
    return requestService.get('users/'+id);
  };

  // searches for all users against api
  self.list = function() {
    return requestService.get('users');
  };

  self.create = function(user) {
    return requestService.post('users', user);
  };

  self.edit = function(user) {
    return requestService.put('users/'+user.id, user);
  };

  self.delete = function(id) {
    return requestService.delete('users/'+id);
  };

  return self;
}]);