'use strict';

/**
 * Controller of the rfm
 */
angular.module('dataNewBorn')
  .controller('RfmCtrl',['$rootScope', '$scope', '$http', 'Notification', function ($rootScope, $scope, $http, Notification) {
    $rootScope.init("rfm");
    $scope.rfmSetting = { binsList:[2,2,2],   
      weights: [100,10,1],
      valueCol:"DISCOUNT",
      dateCol:"ORDERCREATIONTIME",
      idCol:"USERID",
      endDate:"2016-11-15",
      exportCols:["USERPHONE", "USERNAME"]};
    $scope.result="";

    $scope.execute=function(rfmSetting){
      $http.post(
          '/api/rfm',
          $scope.rfmSetting
      ).then(function(err){
        Notification.sucess(err);
      });
    }
  }]);
