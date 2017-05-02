'use strict';

/**
 * Controller of the dashboard
 */
angular.module('dataNewBorn')
  .controller('DashboardCtrl',['$rootScope', '$scope', '$uibModal', 'NgTableParams', '$http', function ($rootScope, $scope, $uibModal, NgTableParams, $http) {
    $scope.openModal = ()=>{
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'myModalContent.html',
        size: 'md',
        scope: $scope,
        controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
          $scope.content = "This is modal content";
          $scope.ok = function () {
            $uibModalInstance.close();
          };

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }]
      });
    };
    $rootScope.init("dashboard");
    $scope.labels1 = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
    $scope.data1 = [300, 500, 100, 40, 120];
    $scope.labels2 = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series2 = ['Series A', 'Series B'];
    $scope.data2 = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.labels3 = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series3 = ['Series A', 'Series B'];
    $scope.data3 = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.questionTable = new NgTableParams({
      page: 1,
      count: 10
    }, {
      getData: function(params) {
        console.log(params);
        return $http.get("/api/config/links", {}).then(function(response){
          console.log(response.data);
          params.total(10);
          return response.data;
        });
      }
    });
  }]);
