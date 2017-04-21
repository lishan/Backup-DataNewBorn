'use strict';

/**
 * Main Controller
 */
angular.module('dataNewBorn')
  .controller('MainCtrl', ['$rootScope', '$scope', '$cookies', '$location', 'hotkeys', function ($rootScope, $scope, $cookies, $location, hotkeys) {
    let username = $cookies.get("username");
    if(username !== undefined){
      $location.path("/dashboard");
      $rootScope.username = username;
    }else{
      $rootScope.username = null;
    }

    $scope.user = {};

    $scope.login = function(){
      if($scope.user.name !== undefined && $scope.user.pass !== undefined) {
        $cookies.put("username", $scope.user.name);
        $rootScope.username = username;
        $location.path("/dashboard");
      }
    };

    hotkeys.bindTo($scope).add({
      combo: 'enter',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        $scope.login();
      }
    });
  }]);
