angular.module('mainApp.controllers')
.controller('userListController', ['$scope', '$modal', '$route', '$timeout', 'SessionService', 'userService', function($scope, $modal, $route, $timeout, Session, User){
  // check for session
  if (Session.info) {
    $scope.session = Session;

    // list users in table or log error
    User.list()
    .then(function(data) {
      if (data !== undefined && data.meta.success) {
        // Set users to scope property
        $scope.users = data.users;

        // Create table rows
        $scope.rowCollection = $scope.users;

        // Create table columns and headings
        $scope.columnCollection = [
          {label: 'Username', map: 'username'},
          {label: 'Email', map: 'email'},
          {label: 'First Name', map: 'firstName'},
          {label: 'Last Name', map: 'lastName'},
          {label: 'Last Updated', map: 'updatedAt', formatFunction: function(value) {
            return moment(value).format("YYYY-MM-DD hh:mm A");
          }},
          {label: 'Edit User', cellTemplateUrl: 'partials/directives/editUserButton.html', isSortable: false},
          {label: 'Delete User', cellTemplateUrl: 'partials/directives/deleteUserButton.html', isSortable: false}
        ];

        // Global table config
        $scope.globalConfig = {
          isPaginationEnabled: true,
          isGlobalSearchActivated: true,
          itemsByPage: 1
        };

        // Styling for table
        $('.pagination ul').addClass('pagination');
        $('.smart-table-global-search label').addClass('h5');
        $('.smart-table-global-search input').addClass('form-control');
        $('.smart-table-global-search').append('<br>');
      }
    });

    // create a new user
    $scope.createUser = function() {
      // Sends null so that the modal will know to make a blank user to fill.
      $scope.open(null);
    };

    // edit user
    $scope.editUser = function(user) {
      $scope.open(user);
    };

    // delete user
    $scope.deleteUser = function(user) {
      if(user.id != $scope.session.info.id) {
        if(confirm("Deleting "+user.username+" cannot be undone. Are you sure?"))
        {
          User.delete(user.id)
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
          session: function () {return Session; },
          User: function () {return User; },
          $timeout: function () {return $timeout; }
        }
      });

      modalInstance.result.then(function() {
          $timeout(function() {
            $route.reload(); //To make sure the list is up to date.
          }, 500);
        }
      );
    };
  }
}]);