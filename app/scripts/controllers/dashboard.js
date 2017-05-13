'use strict'

/**
 * Controller of the dashboard
 */

angular.module('dataNewBorn').controller('DashboardCtrl', ['$rootScope', '$scope', '$uibModal', 'NgTableParams', '$http', '$filter', '$httpParamSerializerJQLike', 'Notification', function ($rootScope, $scope, $uibModal, NgTableParams, $http, $filter, $httpParamSerializerJQLike, Notification) {
  $rootScope.init('dashboard');
  $scope.openModal = function () {
    $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title-bottom',
      ariaDescribedBy: 'modal-body-bottom',
      templateUrl: 'myModalContent1.html',
      size: 'lg',
      scope: $scope,
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.dashboard = {
          charts: []
        };
        $scope.ok = function () {
          $http.post('/api/dashboards/', $scope.dashboard).success(function(){
            $uibModalInstance.close();
            $http.get('/api/dashboards/all').success(function (data) {
              $scope.themes = data;
              $scope.selectedItem = null;
              Notification.success("新建成功");
            });
          });
        };
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel')
        };
      }]
    })
  };
  $scope.edit = function (item) {
    $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title-bottom',
      ariaDescribedBy: 'modal-body-bottom',
      templateUrl: 'myModalContent2.html',
      size: 'lg',
      scope: $scope,
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.dashboard = item;
        console.log($scope.dashboard);
        $scope.ok = function () {
          $http.put('/api/dashboards/', $scope.dashboard).success(function(){
            $uibModalInstance.close();
            $http.get('/api/dashboards/all').success(function (data) {
              $scope.themes = data;
              $scope.selectedItem = null;
              Notification.success("修改成功");
            });
          });
        };
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel')
        };
      }]
    })
  };
  $scope.selectedItem = null;
  $http.get('/api/dashboards/all').success(function (data) {
    $scope.themes = data;
    $scope.selectedItem = data[0];
  });
  $http.get('/api/chart-configs').success(function(data){
    $scope.charts = data;
  });

  $scope.delete = function(item){
    if(confirm(`确定删除Dashboard ${item.label}吗？`)){
      $http.delete('/api/dashboards/' + item.id).success(function(){
        $http.get('/api/dashboards/all').success(function (data) {
          $scope.themes = data;
          $scope.selectedItem = null;
          Notification.success("删除成功");
        });
      });
    }
  };
  $scope.selected = function (item) {
    $scope.selectedItem = item
    $.each(item.chartConfigDTOList, function (index, chart) {
      if (chart.chartType === 'TABLE') {
        $http.post('/api/query/chart/' + chart.id + '/detail').then(function (ret) {
          chart.columns = ret.data.columns
          chart.tableParams = new NgTableParams({
            page: 1, // show first page
            count: 10 // count per page
          }, {
            total: ret.data.totalCount,
            getData: function getData (params) {
              return $http({
                method: 'POST',
                url: '/api/query/chart/' + chart.id + '/detail',
                data: $httpParamSerializerJQLike({pageNo: params.page(), pageSize: params.count()}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(function (retData) {
                return retData.data.datas
              })
            }
          })
        })
      } else {
        chart.config = {
          title: chart.label,
          showTitle: false
        }
        $http.post('/api/query/chart/' + chart.id).then(function (ret) {
          let chartData = []
          $.each(ret.data, function (index, dataRow) {
            let names = Object.getOwnPropertyNames(dataRow)
            chartData.push({
              x: dataRow[names[0]],
              y: dataRow[names[1]]
            })
          })
          chart.data = [{
            datapoints: chartData
          }]
        })
      }
    })
  }
}])
