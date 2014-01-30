/* Controllers */
angular.module('mainApp.controllers', [])
.controller('loginController', ['$scope', '$location', 'SessionService', function($scope, $location, Session) {
  // set session data for navbar
  $scope.session = Session;
  
  // verify user credentials for sign in
  $scope.login = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      Session.login(self);
    }
  };

  // remove session data and redirect to home page
  $scope.logout = function() {
    Session.logout();
    $location.path('/');
  };
}])
.controller('homeController', ['$scope', 'SessionService', function($scope, Session){
  // set session data for page
  $scope.session = Session;
}])
.controller('profileController', ['$scope', '$route', 'SessionService', 'userService', function($scope, $route, Session, user) {
  // set session data for page
  $scope.session = Session;
  $scope.isProfile = true;
  $scope.header = "Profile";

  // search for user by id for profile display
  user.userSearch(Session.info.id)
  .then(function(data) {
    if (data !== undefined && data.meta.success) {
      $scope.user = data.users;
    }
  });

  $scope.saveEdit = function() {
    if (this.username) {
      $scope.user.username = this.username;
    }
    if (this.password) {
      if (confirm('Are you sure you want a new password?')) {
        $scope.user.password = this.password;
      }
    } else { // Set to null so that the old password isn't altered
      $scope.user.password = null;
    }
    if (this.firstName) {
      $scope.user.firstName = this.firstName;
    }
    if (this.lastName) {
      $scope.user.lastName = this.lastName;
    }
    if (this.email) {
      $scope.user.email = this.email;
    }
    if (this.RoleId) {
      $scope.user.RoleId = this.RoleId;
    }
    
    console.log("The value being sent:");
    console.log($scope.user);
    console.log("______________");
    // logging the returned values to check if the save was a success
    // Even though a success is returned the values in the objects
    // are not changed
    user.userSaveEdit($scope.user)
    .then(function(result) {
      console.log("This is what is returned:");
      console.log(result);
      console.log("-----------------------------------");
    })
    .then(function() {$route.reload();});
  };
}])
.controller('userListController', ['$scope', '$modal', '$route', 'SessionService', 'userService', function($scope, $modal, $route, Session, User){
  // check for session
  if (Session.info) {
    $scope.session = Session;

    // list users in table or log error
    User.userList()
    .then(function(data) {
      if (data !== undefined && data.meta.success) {
        $scope.users = data.users;
      }
    });

    // edit user
    $scope.editUser = function(user) {
      $scope.open(user);
    };

    // create a new user
    $scope.createUser = function() {
      // Sends null so that the modal will know to make a blank user to fill.
      $scope.open(null);
    };

    // delete user
    $scope.deleteUser = function(user) {
      if(user.id != $scope.session.info.id) {
        if(confirm("Deleting "+user.username+" cannot be undone. Are you sure?"))
        {
          User.deleteUser(user.id)
          .then(function(data) {
            if (data !== undefined && data.meta.success) {
              $route.reload();
              Session.makeAlert("success","User was successfully deleted");
            }
          });
        }
      } else {
        alert("You cannot delete yourself!");
      }
    };

    $scope.open = function(user) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/userForm.html',
        controller: 'modalInstanceCtrl',
        resolve: {
          user: function () { return user; },
        }
      });
      modalInstance.result.then(function (result) {
        if(result.isIssue) {
          Session.makeAlert('danger',"You must enter a "+result.problem+" to create a new account");
        } else {
          if(result.id) {
            // logging the returned values to check if the save was a success
            User.userSaveEdit(result).then(function(res) {
              console.log("Edited user from Modal returned info:");
              console.log(res);
              console.log("------------------------------------------");
            });
            $route.reload(); //To make sure the list is up to date.
          } else {
            User.createUser(result).then(function(res) {
              console.log("Created user from Modal returned info:");
              console.log(res);
              console.log("------------------------------------------");
            });
            $route.reload(); //To make sure the list is up to date.
          }
        }
      });
    };
  }
}])
.controller('modalInstanceCtrl', function modalController ($scope, $modalInstance, user) {
    //Every modal needs it's own controller and has it's own scope.
    if(user !== null) {
      $scope.user = user;
    } else {
      $scope.user = {
        username: null,
        password: null,
        firstName: null,
        lastName: null,
        email: null,
        RoleId: null
      };
    }
    $scope.isModal = true;
    $scope.issue = {
      isIssue: false,
      problem: null
    };
    if (user !== null) {
      $scope.header = "Edit User";
    } else {
      $scope.header = "Create User";
    }


    // Username is a required field
    $scope.saveEdit = function () {
      if (this.username) {
        $scope.user.username = this.username;
      } else { // To ensure that new users have a username
        if ($scope.user.username === null) {
          $scope.issue.isIssue = true;
          $scope.issue.problem = "username";
          $modalInstance.close($scope.issue);
        }
      }

      // Password is a required field
      if (this.password) {
        if($scope.user.password === null) {
          if (confirm('Are you sure you want a new password?')) {
            $scope.user.password = this.password;
          } else {
            $scope.user.password = null;
            alert("Password was not changed");
          }
        } else {$scope.user.password = this.password;}
      } else { // To ensure that new users have a password
        if ($scope.user.password === null) {
          $scope.issue.isIssue = true;
          $scope.issue.problem = "password";
          $modalInstance.close($scope.issue);
        } else {
          $scope.user.password = null;
        }
      }

      // Role Id is a required field
      if (this.RoleId) {
        $scope.user.RoleId = this.RoleId;
      } else { //To ensure new users have a role
        if($scope.user.RoleId === null) {
          $scope.issue.isIssue = true;
          $scope.issue.problem = "Role Id";
          $modalInstance.close($scope.issue);
        }
      }

      if (this.firstName) {
        $scope.user.firstName = this.firstName;
      }
      if (this.lastName) {
        $scope.user.lastName = this.lastName;
      }
      

      // E-Mail is a required field
      if (this.email) {
        $scope.user.email = this.email;
      } else {
        if($scope.user.email === null) {
          $scope.issue.isIssue = true;
          $scope.issue.problem = "E-Mail";
          $modalInstance.close($scope.issue);
        }
      }

      $modalInstance.close($scope.user);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
});
