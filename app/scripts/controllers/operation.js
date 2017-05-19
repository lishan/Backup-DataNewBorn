'use strict'

/**
 * Controller of the operation
 */
angular.module('dataNewBorn')
  .controller('OperationCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $rootScope.init('operation')
    $scope.fields = []
    $scope.selectedItem = null
    $scope.getPivotTableConfigs = function () {
      $http.get('/api/pivot-table-configs').success((data) => {
        $scope.configs = data
        if ($scope.configs.length > 0) {
          $scope.selectedItem = $scope.configs[0]
        }
      })
    }
    $scope.getPivotTableConfigs()
    $scope.selected = (item) => {
      $scope.selectedItem = item
    }
  }])
