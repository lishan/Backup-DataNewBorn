'use strict';

/**
 * Controller of the operation
 */
angular.module('dataNewBorn')
  .controller('OperationCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $rootScope.init('operation');
    $scope.fields = [];
    $scope.selectedItem = null;
    function init() {
      $http.get('/api/pivot-table-configs').success((data) => {
        $scope.configs = data;
        if ($scope.configs.length > 0) {
          $scope.selectedItem = $scope.configs[0];
        }
      });
    }
    init();
    // $scope.getPivotTableConfigs();
    $scope.selected = (item) => {
      $scope.selectedItem = item
    };
    $scope.$on('reload_page', function(data){
      init();
      console.log(data);
      $scope.selectedItem = data;
    });
  }]);
