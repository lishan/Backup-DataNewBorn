'use strict';

/**
 * Controller of the rfm
 */
angular.module('dataNewBorn')
  .controller('RfmCtrl',['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.init("rfm");
    $scope.rfmSetting = {R:2,RWeight:100};
  }]);
