'use strict';

/**
 * Controller of the operation
 */
angular.module('dataNewBorn')
  .controller('OperationCtrl',['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.init("operation");
    $scope.fields = [];
  }]);
