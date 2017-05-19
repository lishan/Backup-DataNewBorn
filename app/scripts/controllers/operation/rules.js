'use strict'

angular.module('dataNewBorn')
  .controller('OperationRulesCtrl', ['$scope', '$http', function ($scope, $http) {
    if ($scope.selectedItem) {
      $http.get('/api/pivottableconfigs/' + $scope.selectedItem.id + '/statisticfields').success(function (data) {
        $scope.selectedItem.statisticFields = data
      })

      let fieldMap = {}
      for (let i = 0; i < $scope.selectedItem.model.fields; i++) {
        let field = $scope.selectedItem.model.fields[i]
        fieldMap[field.name] = field
      }
      $scope.selectedItem.fieldMap = fieldMap

      $scope.selectedItem.conditions = JSON.parse($scope.selectedItem.queryConditions)
      $.each($scope.selectedItem.conditions, function(index, condition){
        condition.field = fieldMap[condition.name]
        // switch(condition.field.type){
        //   case 'NUMBER'
        // }
      });
      
    }

    $scope.statisticMethods = [
      {name: 'SUM', shade: 'dark'},
      {name: 'COUNT', shade: 'light'},
      {name: 'MEAN', shade: 'dark'},
      {name: 'MIN', shade: 'dark'},
      {name: 'MAX', shade: 'light'}
    ]
  }])
