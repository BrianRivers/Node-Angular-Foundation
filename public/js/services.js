angular.module('mainApp.services', [])
.factory('UserService', function() {
  var loggedUser = {
    username: "",
    key: "",
    firstName: "",
    lastName: "",
    email: "",
    loggedIn: false
  };
  return loggedUser;
});