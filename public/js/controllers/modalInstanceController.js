angular.module('mainApp.controllers')
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