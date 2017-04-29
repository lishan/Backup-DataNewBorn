'use strict'

/**
 * Main Controller
 */
angular.module('dataNewBorn')
  .controller('MainCtrl', ['$rootScope', '$scope', '$cookies', '$location', '$http', 'hotkeys', 'DEV_MODE', function ($rootScope, $scope, $cookies, $location, $http, hotkeys, DEV_MODE) {
    let username = $cookies.get('username')
    if (username !== undefined) {
      $location.path('/dashboard')
      $rootScope.username = username
    }else {
      $rootScope.username = null
    }

    $scope.user = {}

    $scope.login = function () {
      if ($scope.user.name !== undefined && $scope.user.pass !== undefined) {
        if (DEV_MODE) {
          $cookies.put('username', $scope.user.name)
          $rootScope.username = username
          $location.path('/dashboard')
        } else {
          var data = 'j_username=' + encodeURIComponent($scope.user.name) +
            '&j_password=' + encodeURIComponent($scope.user.pass) +
            '&remember-me=true&submit=Login'

          return $http.post('/api/authentication', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).success(function (response) {
            $cookies.put('username', $scope.user.name)
            $rootScope.username = username
            $location.path('/dashboard')
          })
        }
      }
    }

    hotkeys.bindTo($scope).add({
      combo: 'enter',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function () {
        $scope.login()
      }
    })
  }])
