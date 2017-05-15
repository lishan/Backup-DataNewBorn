'use strict'

angular.module('dataNewBorn')
  .controller('OperationRulesCtrl', ['$scope', '$http', function ($scope, $http) {
    if ($scope.selectedItem) {
      $http.get('/api/pivottableconfigs/' + $scope.selectedItem.id + '/statisticfields').success(function (data) {
        $scope.selectedItem.statisticFields = data
      })
    }
  }])
