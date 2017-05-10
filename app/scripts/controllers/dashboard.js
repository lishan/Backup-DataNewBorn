'use strict'

/**
 * Controller of the dashboard
 */

angular.module('dataNewBorn').controller('DashboardCtrl', ['$rootScope', '$scope', '$uibModal', 'NgTableParams', '$http', '$filter', '$httpParamSerializerJQLike', function ($rootScope, $scope, $uibModal, NgTableParams, $http, $filter, $httpParamSerializerJQLike) {
  $rootScope.init('dashboard')
  $scope.openModal = function () {
    $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title-bottom',
      ariaDescribedBy: 'modal-body-bottom',
      templateUrl: 'myModalContent.html',
      size: 'md',
      scope: $scope,
      controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
        $scope.content = 'This is modal content'
        $scope.ok = function () {
          $uibModalInstance.close()
        }

        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel')
        }
      }]
    })
  }
  $scope.selectedItem = null
  $http.get('/api/dashboards/all').success(function (data) {
    $scope.themes = data
  })
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
