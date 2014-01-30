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
.controller('profileController', ['$scope', 'SessionService', 'userService', function($scope, Session, user) {
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
    
    console.log($scope.user);
    // logging the returned values to check if the save was a success
    // Even though a success is returned the values in the objects
    // are not changed
    user.userSaveEdit($scope.user)
    .then(function(result) {console.log(result);});
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
      $scope.open(user, User);
    };

    // create a new user
    $scope.createUser = function() {
      $scope.open(null);
    };

    // delete user
    $scope.deleteUser = function(user) {
      User.deleteUser(user.id)
      .then(function(data) {
        if (data !== undefined && data.meta.success) {
          $route.reload();
          Session.makeAlert("success","User was successfully deleted");
        }
      });
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
            User.userSaveEdit(result).then(function(res) {console.log(res);});
          } else {
            User.createUser(result).then(function(res) {console.log(res);});
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
    console.log($scope.user);
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
      if (this.email) {
        $scope.user.email = this.email;
      }

      console.log($scope.user);
      $modalInstance.close($scope.user);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
});
