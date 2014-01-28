/* Controllers */
angular.module('mainApp.controllers', [])
.controller('loginController', ['$scope', '$location', 'SessionService', function($scope, $location, Session) {
  // set session data for navbar
  $scope.session = Session;
  
  // verify user credentials for sign in
  $scope.submit = function() {
    if (this.usernameInput && this.passwordInput) {
      var self = this;
      Session.login(self);
    }
  };

  $scope.profile = function() {

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

  // search for user by id for profile display
  user.userSearch(Session.info.id)
  .then(function(data) {
    if(data !== undefined && data.meta.success) {
      $scope.user = data.users;
    }
  });

  $scope.saveEdit = function() {
    if(this.username) {
      $scope.user.username = this.username;
    }
    if(this.password) {
      $scope.user.password = this.password;
    }
    if(this.firstName) {
      $scope.user.firstName = this.firstName;
    }
    if(this.lastName) {
      $scope.user.lastName = this.lastName;
    }
    if(this.email) {
      $scope.user.email = this.email;
    }
    if(this.role) {
      $scope.user.RoleId = this.role;
    }
    
    user.userSaveEdit($scope.user);
  };
}])
.controller('userListController', ['$scope', '$modal', '$location', 'SessionService', 'userService', function($scope, $modal, $location, Session, user){
  // check for session
  if (Session.info) {
    $scope.emptyUser = {
      username: null,
      password: null,
      firstName: null,
      lastName: null,
      email: null,
      RoleId: null
    };

    // list users in table or log error
    user.userList()
    .then(function(data) {
      if (data !== undefined && data.meta.success) {
        $scope.users = data.users;
      }
    });

    // edit user
    $scope.editUser = function(val) {
      for(var indexedUser in $scope.users) {
        if($scope.users[indexedUser].id == val) {
          $scope.open($scope.users[indexedUser], user);
        }
      }
    };

    // create a new user
    $scope.createUser = function() {
      $scope.open($scope.emptyUser);
    };

    // delete user
    $scope.deleteUser = function(val) {
      var indexedUser;
      for(indexedUser in $scope.users) {
        if($scope.users[indexedUser].id == val) {
          user.deleteUser($scope.users[indexedUser].id);
        }
      }
    };

    $scope.open = function (user, userService) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/editProfile.html',
        controller: 'modalInstanceCtrl',
        resolve: {
          user: function () { return user; },
        }
      });
      modalInstance.result.then(function (result) {
        console.log(result);
        // Whenever issue is passed back there is an error about ".value" not existing
        // Whenever user is passed back it does not register the problem
        if(result.isIssue) {
          Session.makeAlert('danger',"You must enter a {{result.problem}} to create a new account");
        } else {
          if(result.id) {
            console.log("has id");
          } else {
            console.log("no id");
          }
        }
      });
    };
  }
}])
.controller('modalInstanceCtrl', function modalController ($scope, $modalInstance, user) {
    //Every modal needs it's own controller and has it's own scope.
    $scope.user = user;
    $scope.issue = {
      isIssue: false,
      problem: null
    };
    $scope.isModal = true;

    $scope.ok = function () {
      if(this.username) {
        $scope.user.username = this.username;
      } else { // To ensure that new users have a username
        if($scope.user.password === null) {
          $scope.issue.isIssue = true;
          $scope.issue.problem = "password";
          $modalInstance.close($scope.issue);
        }
      }

      if(this.password) {
        $scope.user.password = this.password;
      } else { // To ensure that new users have a password
        if($scope.user.password === null) {
          $scope.issue.isIssue = true;
          $scope.issue.problem = "password";
          $modalInstance.close($scope.issue);
        }
      }

      // RoleId is not wanting to work
      console.log(this.role);
      if(this.role) {
        $scope.user.RoleId = this.role;
       } //else { // To ensure that new users have a role
      //   if($scope.user.RoleId === null) {
      //     $scope.issue.isIssue = true;
      //     $scope.issue.problem = "Role Id";
      //     $modalInstance.close($scope.issue);
      //   }
      // }

      if(this.firstName) {
        $scope.user.firstName = this.firstName;
      }
      if(this.lastName) {
        $scope.user.lastName = this.lastName;
      }
      if(this.email) {
        $scope.user.email = this.email;
      }

      $modalInstance.close($scope.user);
      console.log('ok');
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
      console.log('cancel');
    };
});
