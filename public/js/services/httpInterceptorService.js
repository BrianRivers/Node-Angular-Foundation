angular.module('mainApp.services')
.factory('httpInterceptor', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {
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
      console.log(rejection.data.meta.message.code);
      var sessionService = $injector.get("SessionService");
      if(rejection.status === 401) {
        $location.path('/');
        sessionService.logout();
        sessionService.makeAlert('danger', 'You must login first');
      } else if(rejection.status === 403) {
        $location.path('/');
        sessionService.makeAlert('danger', 'You do not have access to this page');
      } else if(rejection.status === 500) {
        if(rejection.data.meta.message.code == "ER_DUP_ENTRY") {
          sessionService.makeAlert('warning', 'This username or email is already in use.');
        } else {
          $location.path('/');
          sessionService.makeAlert('warning', 'There was a server error');
        }
      }
      return $q.reject(rejection);
    }
  };
}]);