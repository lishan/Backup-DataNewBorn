'use strict';

/**
 * Controller of the dataModel
 */
angular.module('dataNewBorn')
  .controller('DataModelCtrl',['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.init("dashModel");
  }]);
