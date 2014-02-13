angular.module('mainApp.services')
.factory('httpInterceptor', ['$q', '$injector', '$location', '$alert', 'localStorageService', function ($q, $injector, $location, $alert, localStorageService) {
  return {
    // override requests to add key to header from session info
    request: function (config) {
      if(localStorageService.get('session') !== null) {
        config.headers = {
          'Content-Type': 'application/json;charset=UTF-8',
          'x-api-key': localStorageService.get('session').key.id
        };
        return config;
      } else {
        return config;
      }
    },
    // response error handling and redirection
    responseError: function(rejection) {
      console.log(rejection);
      console.log(rejection.data.meta.message.code);
      var sessionService = $injector.get("SessionService");
      if(rejection.status === 401) {
        $location.path('/');
        sessionService.logout();
        $alert.makeAlert('danger', 'You must login first');
      } else if(rejection.status === 403) {
        $location.path('/');
        $alert.makeAlert('danger', 'You do not have access to this page');
      } else if(rejection.status === 500) {
        if(rejection.data.meta.message.code == "ER_DUP_ENTRY") {
          $alert.makeAlert('warning', 'This username or email is already in use.');
        } else if (rejection.data.meta.message == "Data not found or unable to delete") {
          $alert.makeAlert('danger', 'Data not found');
        } else {
          $location.path('/');
          $alert.makeAlert('warning', 'There was a server error');
        }
      }
      return $q.reject(rejection);
    }
  };
}]);