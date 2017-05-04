'use strict'

/**
 * Controller of the operation
 */
angular.module('dataNewBorn')
  .controller('OperationCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $rootScope.init('operation')
    $scope.fields = []
    $scope.selectedItem = null
    $http.get('/api/pivot-table-configs').success((data) => {
      $scope.configs = data
    })
    $scope.selected = (item) => {
      $scope.selectedItem = item
    }
  }])
