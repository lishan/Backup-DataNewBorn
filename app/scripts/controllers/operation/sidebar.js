'use strict'

angular.module('dataNewBorn')
  .controller('OperationSidebarCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {
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
  }])
