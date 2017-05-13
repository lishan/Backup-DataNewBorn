'use strict';

angular.module('dataNewBorn')
  .controller('OperationPivotCtrl',['$scope', function ($scope) {
    $scope.tableHeaderRows= [[
        {
          name: '',
          label:'',
          rowspan: 2,
          colspan: 1
        },
        {
          name: '分类1',
          label:'分类1',
          rowspan: 1,
          colspan: 2
        },
        {
          name: '分类2',
          label:'分类2',
          rowspan: 1,
          colspan: 2
        },
        {
          name: '分类3',
          label:'分类3',
          rowspan: 1,
          colspan: 2
        },
        {
          name: '分类4',
          label:'分类4',
          rowspan: 1,
          colspan: 2
        },
        {
          name: '分类5',
          label:'分类5',
          rowspan: 1,
          colspan: 2
        }
      ],
      [
        {
          name: '统计值1',
          label:'统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label:'统计值2',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值1',
          label:'统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label:'统计值2',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值1',
          label:'统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label:'统计值2',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值1',
          label:'统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label:'统计值2',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值1',
          label:'统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label:'统计值2',
          rowspan: 1,
          colspan: 1
        }
      ]];
       $scope.tableDataRows= [['分类1', 100, 100, 100, 100, 100, 100, 100, 100, 100, 100 ],
       ['分类2', 100, 100, 100, 100, 100, 100, 100, 100, 100, 100 ],
       ['分类3', 100, 100, 100, 100, 100, 100, 100, 100, 100, 100 ],
       ['分类4', 100, 100, 100, 100, 100, 100, 100, 100, 100, 100 ],
       ['分类5', 100, 100, 100, 100, 100, 100, 100, 100, 100, 100 ]]

  }]);
