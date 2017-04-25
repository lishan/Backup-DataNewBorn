'use strict';

/**
 * Controller of the dataModel
 */
angular.module('dataNewBorn').controller('DataModelCtrl',['$rootScope', '$scope', '$http', 'Upload', function ($rootScope, $scope, $http, Upload) {
  $rootScope.init("dataModel");
  $http.get("/api/data-tables").success(function(data){
    $scope.data = data;
  });

  $scope.add = function (id) {
    Upload.upload({
      url: `/api/data-tables/${id}`,
      data: {inputFile: $scope.file}
    }).then(function () {
      $http.get("/api/data-tables").success(function(data){
        $scope.data = data;
        Notification.success("追加成功");
      });
    });
  };

  $scope.remove = function (id){
    $http.post(`/api/data-tables/${id}/clear`, {}).success(function(){
      $http.get("/api/data-tables").success(function(data){
        $scope.data = data;
        Notification.success("删除成功");
      });
    });

  };

}]);
