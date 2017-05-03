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
    $scope.selectedItem = null;
    $http.get("/api/dashboards").success((data)=>{
      $scope.themes = data;
    });
    $scope.selected = (item)=>{
      $scope.selectedItem = item;
    };
    // $scope.questionTable = new NgTableParams({
    //   page: 1,
    //   count: 10
    // }, {
    //   getData: function(params) {
    //     return $http.get("/api/config/links", {}).then(function(response){
    //       params.total(10);
    //       return response.data;
    //     });
    //   }
    // });
  }]);
