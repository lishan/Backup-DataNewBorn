'use strict'

angular.module('dataNewBorn')
  .controller('OperationSidebarCtrl', ['$scope', '$uibModal', '$http', 'Notification', function ($scope, $uibModal, $http, Notification) {
    $http.get('/api/data-tables').success(function (data) {
      $scope.dataModels = data
    })

    $scope.delete = function (item) {
      if (confirm(`确定删除操作方案 ${item.label}吗？`)) {
        $http.delete('/api/pivot-table-configs/' + item.id).success(function () {
          Notification.success('删除成功')
          $scope.getPivotTableConfigs()
        })
      }
    }

    $scope.openCreateModal = () => {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'createContent.html',
        size: 'lg',
        scope: $scope,
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.item = {}
          $scope.ok = function () {
            $scope.item.dataModelId = $scope.item.model.id
            $http.post('/api/pivottableconfigs/create', $scope.item).success(function () {
              $scope.item = {}
              Notification.success('新建成功')
            })
            $uibModalInstance.close()
          }

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel')
          }
        }]
      })
    }
    $scope.openUpdateModal = (item) => {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-bottom',
        ariaDescribedBy: 'modal-body-bottom',
        templateUrl: 'updateContent.html',
        size: 'lg',
        scope: $scope,
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.item = item
          $scope.ok = function () {
            $scope.item.dataModelId = item.model.id
            $http.post(`/api/pivottableconfigs/${$scope.item.id}/update`, $scope.item).success(function () {
              Notification.success('修改成功')
              $uibModalInstance.close()
            })
          }

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel')
          }
        }]
      })
    }
  }])
