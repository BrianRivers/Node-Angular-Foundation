angular.module('mainApp.directives', []);

var USER_PASS_REGEXP = /^[a-z0-9_-]{3,16}$/;
app.directive('basicFormat', function() {
  // Username and Password has to be from 3-16 characters long 
  // and can only be a-z,0-9,_,-
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (USER_PASS_REGEXP.test(viewValue)) {
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

var NAME_REGEXP = /^[a-z-]{2,16}$/;
app.directive('nameFormat', function() {
  // Name has to be from 2-16 characters long and can only be letters
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (NAME_REGEXP.test(viewValue)) {
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

var EMAIL_REGEXP = /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,8})$/;
app.directive('emailFormat', function() {
  // Email has to be formated with @ and .domain
    return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (EMAIL_REGEXP.test(viewValue)) {
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