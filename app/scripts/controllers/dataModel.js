'use strict';

/**
 * Controller of the dataModel
 */
angular.module('dataNewBorn').controller('DataModelCtrl',['$rootScope', '$scope', '$http','Notification', function ($rootScope, $scope, $http, Notification) {
  $rootScope.init("dataModel");
  $http.get("/api/data-tables").success(function(data){
    $scope.data = data;
  });

  $scope.add = function (id) {    
    // Upload.upload({
    //   url: `/api/data-tables/${id}`,
    //   data: {inputFile: $scope.file},
    //   withCredentials : true
    // }).then(function () {
    //   $http.get("/api/data-tables").success(function(data){
    //     $scope.data = data;
    //     Notification.success("追加成功");
    //   });
    // });
    var fd = new FormData();
    var file = document.querySelector('input[type=file]').files[0];
    fd.append("inputfile", file);
    $http({
      method: "post",
      url: '/api/data-tables/'+id,
      data: fd,
      headers: {'Content-Type':undefined},
      transformRequest: angular.identity 
    }).success(function () {
      $http.get("/api/data-tables").success(function(data){
        $scope.data = data;
        Notification.success("追加成功");
      })});
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
