angular.module('mainApp.controllers')
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
}]);