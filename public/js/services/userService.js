angular.module('mainApp.services')
.factory('userService', ['requestService', function(requestService) {
  var self = {};

  // searches for single user by id
  self.userSearch = function(id) {
    return requestService.get('users/'+id);
  };

  // searches for all users against api
  self.userList = function() {
    return requestService.get('users');
  };

  self.userSaveEdit = function(editedUser) {
    return requestService.put('users/'+editedUser.id, editedUser);
  };

  self.deleteUser = function(id) {
    return requestService.delete('users/'+id);
  };

  self.createUser = function(newUser) {
    return requestService.post('users', newUser);
  };

  return self;
}]);