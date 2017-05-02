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
      exportCols:["USERPHONE", "USERNAME", "BUSSINESSLOCATION"]};
    $scope.result={rfmCutpoints:[], status: "未知"};

    $scope.buildRFMModel=function(rfmSetting){
      $http.post(
          '/api/rfm/build',
          $scope.rfmSetting
      ).then(function(response) {
        //Binding data
        $scope.result = response.data;
      }, function(response){
        $scope.result = response.data;
      });
    }

    $scope.updateRFMScore=function(rfmSetting){
      $http.post(
          '/api/rfm/update',
          $scope.rfmSetting
      ).then(function(response) {
        //Binding data
        Notification.success("更新成功");
      }, function(response){
        Notification.error("更新失败:" + response.message);
      });
    }
  }]);
