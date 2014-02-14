angular.module('mainApp.controllers')
.controller('userListController', ['$scope', '$modal', '$route', '$timeout', '$dialogs', '$filter', '$alert', 'SessionService', 'userService', 'formatFilter', function($scope, $modal, $route, $timeout, $dialogs, $filter, $alert, Session, User, format){
  // check for session
  if (Session.info) {
    // set session and alert
    $scope.session = Session;
    $scope.$alert = $alert;

    // list users in table
    User.list()
    .then(function(data) {
      if (data !== undefined && data.meta.success) {
        // Set users to scope property
        $scope.users = data.users;

        // create table rows
        $scope.rowCollection = $scope.users;

        // create table columns and headings
        $scope.columnCollection = [
          {label: 'Username', map: 'username'},
          {label: 'Email', map: 'email'},
          {label: 'First Name', map: 'firstName'},
          {label: 'Last Name', map: 'lastName'},
          {label: 'Last Updated', map: 'updatedAt', formatFunction: 'customFormat', formatParameter: 'd'},
          // {label: 'Last Updated', map: 'updatedAt', formatFunction: function(value) {
          //   return moment(value).format("YYYY-MM-DD hh:mm A");
          // }}, Currently uses custom filter after modifying Smart Table lib
          {label: 'Edit User', cellTemplateUrl: 'partials/directives/editUserButton.html', isSortable: false},
          {label: 'Delete User', cellTemplateUrl: 'partials/directives/deleteUserButton.html', isSortable: false}
        ];

        // global table config
        $scope.globalConfig = {
          isPaginationEnabled: true,
          isGlobalSearchActivated: true,
          itemsByPage: 20
        };

        // styling for table
        $('.pagination ul').addClass('pagination');
        $('.smart-table-global-search label').addClass('h5');
        $('.smart-table-global-search input').addClass('form-control');
        $('.smart-table-global-search').append('<br>');
      }
    });

    $scope.createUser = function() {
      // sends null so that the modal will know to make a blank user to fill.
      $scope.open(null);
    };

    $scope.editUser = function(user) {
      // open modal with user to edit
      $scope.open(user);
    };

    $scope.deleteUser = function(user) {
      // make sure user is not trying to delete themselves
      if(user.id != $scope.session.info.id) {
        var confirmDialog = $dialogs.confirm("Delete User", "Deleting "+user.username+" cannot be undone. Are you sure?");
        confirmDialog.result.then(function(btn) {
          User.delete(user.id)
          .then(function(data) {
            if (data !== undefined && data.meta.success) {
              var index = $scope.rowCollection.indexOf(user);
              if (index > -1) {
                $scope.rowCollection.splice(index, 1);
              }
              $alert.makeAlert("success","User was successfully deleted");
            }
          });
        }, function(btn) {
          // $alert.makeAlert("warning", "Deletion was cancelled");
        });
      } else {
        $dialogs.error("Delete User", "You cannot delete yourself!");
      }
    };

    $scope.open = function(user) {
      // open modal with data
      var modalInstance = $modal.open({
        templateUrl: 'partials/userForm.html',
        controller: 'modalInstanceCtrl',
        resolve: {
          user: function () { return user; },
          session: function () {return Session; },
          User: function () {return User; }
        }
      });

      modalInstance.result.then(function(user) {
        // if new user, add to table and display message
        if (user) {
          $scope.rowCollection.push(user);
          $alert.makeAlert("success","User was successfully created");
        }
      }, function() {
        console.log('dismiss');
      });
    };
  }
}]);