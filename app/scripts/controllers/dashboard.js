'use strict'

/**
 * Controller of the dashboard
 */
angular.module('dataNewBorn')
  .controller('DashboardCtrl', ['$rootScope', '$scope', '$uibModal', 'NgTableParams', '$http', function ($rootScope, $scope, $uibModal, NgTableParams, $http) {
    $scope.openModal = () => {
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
    $http.get('/api/dashboards/all').success((data) => {
      $scope.themes = data
    })
    $scope.selected = (item) => {
      $scope.selectedItem = item
      $.each(item.chartConfigDTOList, function (index, chart) {
        if (chart.chartType === 'PIE') {
          let pageload = {
            name: 'page.load',
            datapoints: [
              { x: 2001, y: 1012 },
              { x: 2002, y: 1023 },
              { x: 2003, y: 1045 },
              { x: 2004, y: 1062 },
              { x: 2005, y: 1032 },
              { x: 2006, y: 1040 },
              { x: 2007, y: 1023 },
              { x: 2008, y: 1090 },
              { x: 2009, y: 1012 },
              { x: 2010, y: 1012 }
            ]
          }
          chart.config = {
            title: 'chart.label',
            debug: true
          }
          chart.data = [ pageload ]
        }
      })
    }
  // $scope.questionTable = new NgTableParams({
  //   page: 1,
  //   count: 10
  // }, {
  //   getData: function(params) {
  //     return $http.get("/api/config/links", {}).then(function(response){
  //       params.total(10)
  //       return response.data
  //     })
  //   }
  // })
  }])
