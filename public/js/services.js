/* Services */
angular.module('mainApp.services', [])
.factory('UserService', function() {
  // create user
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