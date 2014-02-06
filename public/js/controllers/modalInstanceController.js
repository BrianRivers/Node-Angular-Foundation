angular.module('mainApp.controllers')
.controller('modalInstanceCtrl', function modalController ($scope, $modalInstance, user, session, User, $timeout) {
    //Every modal needs it's own controller and has it's own scope.
    $scope.session = session;
    if(user !== null) {
      $scope.user = user;
      $scope.RoleId = $scope.user.RoleId;
      $scope.header = "Edit User";
    } else {
      $scope.user = {
        username: null,
        password: null,
        firstName: null,
        lastName: null,
        email: null,
        RoleId: null
      };
      $scope.header = "Create User";
    }
    $scope.isModal = true;
    $scope.emailCheck = true;
    $scope.usernameCheck = true;
    $scope.passwordCheck = true;
    $scope.RoleIdCheck = true;

    // Username is a required field
    $scope.save = function () {
      if (this.username) {
        $scope.usernameCheck = true;
        $scope.user.username = this.username;
      } else { // To ensure that new users have a username
        if(!$scope.user.id) {
          $scope.user.username = null;
          $scope.usernameCheck = false;
          session.makeAlert('danger',"You must enter a username to create a new account");
        }
      }

      // Password is a required field
      if (this.password) {
        $scope.passwordCheck = true;
        $scope.user.password = this.password;
      } else { // To ensure that new users have a password
        if(!$scope.user.id) {
          $scope.user.password = null;
          $scope.passwordCheck = false;
          session.makeAlert('danger',"You must enter a password to create a new account");
        }
      }

      // Role Id is a required field
      if (this.RoleId) {
        $scope.RoleIdCheck = true;
        $scope.user.RoleId = this.RoleId;
      } else { //To ensure new users have a role
        if(!$scope.user.id) {
          $scope.user.RoleId = null;
          $scope.RoleIdCheck = false;
          session.makeAlert('danger',"You must enter a Role Id to create a new account");
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
        $scope.emailCheck = true;
        $scope.user.email = this.email;
      } else {
        if(!$scope.user.id) {
          $scope.user.email = null;
          $scope.emailCheck = false;
          session.makeAlert('danger',"You must enter a valid E-mail to create a new account");
        }
      }

      $timeout(function() {
        if($scope.emailCheck === true && $scope.usernameCheck === true && $scope.passwordCheck === true && $scope.RoleIdCheck === true) {
          $scope.ok($scope.user);
        }
      }, 200);
      
    };

    $scope.ok = function(result) {
      if(result.id) {
        // logging the returned values to check if the save was a success
        User.edit(result)
        .then(function(res) {
          console.log("Edited user from Modal returned info:");
          console.log(res);
          $modalInstance.close();
        }, function(err) {
          console.log("Edit error");
          console.log(err);
          $modalInstance.close();
        });
      } else {
        User.create(result)
        .then(function(res) {
          console.log("Created user from Modal returned info:");
          console.log(res);
          $modalInstance.close();
        }, function(err) {
          console.log("Create error");
          console.log(err);
          $modalInstance.close();
        });
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
});