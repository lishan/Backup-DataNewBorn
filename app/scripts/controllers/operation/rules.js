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
      if($scope.selectedItem.xFields){
        $scope.selectedItem.fieldsx = [];
        let array = $scope.selectedItem.xFields.split(",");
        for(let i in array){
          for(let j in $scope.selectedItem.model.fields){
            if(array[i] === $scope.selectedItem.model.fields[j].name){
              $scope.selectedItem.fieldsx.push($scope.selectedItem.model.fields[j].label);
              break;
            }
          }
        }
      }
      if($scope.selectedItem.yFields){
        $scope.selectedItem.fieldsy = [];
        let array = $scope.selectedItem.yFields.split(",");
        for(let i in array){
          for(let j in $scope.selectedItem.model.fields){
            if(array[i] === $scope.selectedItem.model.fields[j].name){
              $scope.selectedItem.fieldsy.push($scope.selectedItem.model.fields[j].label);
              break;
            }
          }
        }
      }
    }

    $scope.statisticMethods = [
      {name: 'SUM', shade: 'dark'},
      {name: 'COUNT', shade: 'light'},
      {name: 'MEAN', shade: 'dark'},
      {name: 'MIN', shade: 'dark'},
      {name: 'MAX', shade: 'light'}
    ];

    $scope.remove = function(array, $index){
      array.splice($index,1);
    };

    $scope.add = function (array) {
      if(array !== undefined) {
        array.push({});
      }
    };

    $scope.saveRules = function(){
      // $http.post(`/api/pivottableconfigs/${$scope.item.id}/update`, $scope.item).success(function () {
      //   Notification.success('修改成功');
      //   $uibModalInstance.close()
      // })
    };
  }]);
