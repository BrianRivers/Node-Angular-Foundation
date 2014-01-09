function testController($scope) {
  $scope.username = null;
  $scope.password = null;
  $scope.submit = function() {
    if (this.username && this.password) {
      this.username = '';
      this.password = '';
      this.submitted = 'Success!';
    }
  };
}