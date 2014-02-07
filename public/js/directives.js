angular.module('mainApp.directives', []);

var USERNAME_REGEXP = /^[A-Za-z0-9]{4,50}$/;
app.directive('usernameFormat', function() {
  // Username and Password has to be from 3-16 characters long 
  // and can only be A-Z,a-z,0-9
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (USERNAME_REGEXP.test(viewValue)) {
          ctrl.$setValidity('username', true);
          return viewValue;
        } else {
          ctrl.$setValidity('username', false);
          return undefined;
        }
      });
    }
  };
});

var PASSWORD_REGEXP = /^[A-Za-z0-9_-]{8,20}$/;
app.directive('passwordFormat', function() {
  // Username and Password has to be from 8-20 characters long 
  // and can only be A-Z,a-z,0-9
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (PASSWORD_REGEXP.test(viewValue)) {
          ctrl.$setValidity('password', true);
          return viewValue;
        } else {
          ctrl.$setValidity('password', false);
          return undefined;
        }
      });
    }
  };
});

var NAME_REGEXP = /^[A-Za-z-]{2,50}$/;
app.directive('nameFormat', function() {
  // Name has to be from 2-16 characters long and can only be letters
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (NAME_REGEXP.test(viewValue)) {
          ctrl.$setValidity('name', true);
          return viewValue;
        } else {
          ctrl.$setValidity('name', false);
          return undefined;
        }
      });
    }
  };
});

var EMAIL_REGEXP = /^([A-Za-z0-9_\.\+-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,8})$/;
app.directive('emailFormat', function() {
  // Email has to be formated with @ and .domain
    return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (EMAIL_REGEXP.test(viewValue)) {
          ctrl.$setValidity('email', true);
          return viewValue;
        } else {
          ctrl.$setValidity('email', false);
          return undefined;
        }
      });
    }
  };
});