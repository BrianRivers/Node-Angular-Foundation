angular.module('mainApp.directives')
.directive('editUser', function(){
  return {
    require: '^smartTable',
    restrict: 'E',
    template: '<button class="btn btn-default">Edit User</button>',
    replace: true,
    link: function($scope, elm, attrs, ctrl) {
      elm.bind('click', function() {
        $scope.$parent.$parent.$parent.$parent.editUser($scope.dataRow);
      });
    }
  };
})
.directive('deleteUser', function(){
  return {
    require: '^smartTable',
    restrict: 'E',
    template: '<button class="btn btn-danger">Delete User</button>',
    replace: true,
    link: function($scope, elm, attrs, ctrl) {
      elm.bind('click', function() {
        $scope.$parent.$parent.$parent.$parent.deleteUser($scope.dataRow);
      });
    }
  };
});