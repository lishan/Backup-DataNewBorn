'use strict';
angular.module('dataNewBorn').factory('UrlInterceptor', function(){
  return {
    'request': function(config) {
      let restServer = "http://localhost:8080";
      if(!config.url.endsWith('.html') && restServer.trim() !== "") {
        config.url = restServer + config.url;
      }
      return config;
    }
  };
});
