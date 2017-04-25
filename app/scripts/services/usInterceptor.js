'use strict';
angular.module('dataNewBorn').factory('UsInterceptor', ['$q', 'usSpinnerService', '$injector' ,($q, usSpinnerService, $injector)=>{
  return {
    'request': (config) => {
      usSpinnerService.spin('spinner');
      return config;
    },
    'response': (response) => {
      usSpinnerService.stop('spinner');
      return response;
    },
    'responseError': (reason) => {
      //Use $injector to load service dynamically in case of circle dependencies
      usSpinnerService.stop('spinner');
      let Notification = $injector.get('Notification');
      if(reason.data !== undefined && reason.data !== null) {
        Notification.error(reason.data);
      }
      return $q.reject(reason);
    },
  };
}]);
