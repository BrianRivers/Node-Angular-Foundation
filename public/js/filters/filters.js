angular.module('mainApp.filters')
.filter('customFormat', function() {
  return function(value, param) {
    switch(param) {
      case 'd': {
        // filter date
        return moment(value).format("YYYY-MM-DD hh:mm A");
      }
    }
  };
});