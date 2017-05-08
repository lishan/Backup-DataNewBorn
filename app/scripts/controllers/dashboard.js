'use strict';

/**
 * Controller of the dashboard
 */
angular.module('dataNewBorn')
  .controller('DashboardCtrl', ['$rootScope', '$scope', '$uibModal', 'NgTableParams', '$http', '$filter', function ($rootScope, $scope, $uibModal, NgTableParams, $http, $filter) {
    $rootScope.init("dashboard");
    $scope.openModal = () => {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'myModalContent.html',
        size: 'md',
        scope: $scope,
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.content = 'This is modal content';
          $scope.ok = function () {
            $uibModalInstance.close()
          };

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel')
          }
        }]
      })
    };
    $scope.selectedItem = null;
    $http.get('/api/dashboards/all').success((data) => {
      $scope.themes = data;
    });
    $scope.selected = (item) => {
      $scope.selectedItem = item;
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
          };
          chart.config = {
            title: 'chart.label',
            debug: true
          };
          chart.data = [ pageload ]
        }else if(chart.chartType === 'TABLE'){
          let data = [{name: "Moroni", age: 50},
            {name: "Tiancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34},
            {name: "Tiancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34},
            {name: "Tiancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34},
            {name: "Tiancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34}];
          chart.columns = [
            { title: 'Name', field: 'name', visible: true, filter: { 'name': 'text' } },
            { title: 'Age', field: 'age', visible: true }
          ];
          chart.tableParams = new NgTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            filter: {
              name: 'M'       // initial filter
            }
          }, {
            total: data.length, // length of data
            getData: function(params) {
              // use build-in angular filter
              let orderedData = params.sorting() ?
                $filter('orderBy')(data, params.orderBy()) :
                data;

              return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            }
          });
        }
      })
    };
  }]);
