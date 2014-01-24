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

  // search for user by id for profile display
  user.userSearch(Session.info.id)
  .then(function(data) {
    if(data !== undefined && data.meta.success) {
      $scope.user = data.users;
    }
  });
}])
.controller('userListController', ['$scope', '$modal', 'SessionService', 'userService', function($scope, $modal, Session, user){
  // check for session
  if (Session.info) {

    // list users in table or log error
    user.userList()
    .then(function(data) {
      if (data !== undefined && data.meta.success) {
        $scope.users = data.users;
      }
    });

    // edit user
    $scope.editUser = function(val) {
      var user;
      for(user in $scope.users) {
        if($scope.users[user].id == val) {
          $scope.open($scope.users[user]);
        }
      }
    };

    // delete user
    $scope.deleteUser = function(val) {
      alert('delete: ' + val);
    };

    $scope.open = function (user) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/editProfile.html',
        controller: 'modalInstanceCtrl',
        resolve: {
          user: function () { return user; },
          $modalInstance: function() { return modalInstance; }
        }
      });
    };
  }
}])
.controller('modalInstanceCtrl', function modalController ($scope, $modalInstance, user) {
    //Every modal needs it's own controller and has it's own scope.
    $scope.user = user;

    $scope.ok = function () {
        $modalInstance().close();
        console.log('ok');
    };
    $scope.cancel = function () {
        $modalInstance().dismiss('cancel');
        console.log('cancel');
    };
})
;
