'use strict'

angular.module('dataNewBorn')
  .controller('OperationPivotCtrl', ['$scope', '$http', function ($scope, $http) {
    if (!$scope.selectedItem) {
      $scope.tableHeaderRows = []
      return
    }
    let xFieldCount = 0
    if ($scope.selectedItem.xFields) {
      xFieldCount = $scope.selectedItem.xFields.split(',').length
    }
    let yFieldCount = 0
    if ($scope.selectedItem.yFields) {
      yFieldCount += $scope.selectedItem.yFields.split(',').length
    }

    $http.post('/api/query/pivot/' + $scope.selectedItem.id).then(function (ret) {
      let xFieldCategories = []
      let yFieldCategories = []
      let statisticLabels = new Set()
      let rowDatas = {}
      $.each(ret.data, function (index, dataRow) {
        let names = Object.getOwnPropertyNames(dataRow)
        let rowData = rowDatas
        for (let i = 0; i < xFieldCount; i++) {
          if (!xFieldCategories[i]) {
            xFieldCategories[i] = new Set()
          }
          xFieldCategories[i].add(dataRow[names[i]])
          if (!rowData[dataRow[names[i]]]) {
            rowData[dataRow[names[i]]] = {}
          }
          rowData = rowData[dataRow[names[i]]]
        }
        for (let i = xFieldCount; i < xFieldCount + yFieldCount; i++) {
          if (!yFieldCategories[i - xFieldCount]) {
            yFieldCategories[i - xFieldCount] = new Set()
          }
          yFieldCategories[i - xFieldCount].add(dataRow[names[i]])
          if (!rowData[dataRow[names[i]]]) {
            rowData[dataRow[names[i]]] = {}
          }
          rowData = rowData[dataRow[names[i]]]
        }
        // rowData = []
        for (let i = xFieldCount + yFieldCount; i < names.length; i++) {
          statisticLabels.add(names[i])
          rowData[names[i]] = dataRow[names[i]]
        }
      })
      // make tableHeaderRows
      $scope.tableHeaderRows = []
      for (let i = 0; i < yFieldCategories.length; i++) {
        let tableHeaderRow = []
        let childrenSize = 1
        if (i != yFieldCategories.length - 1) {
          childrenSize = yFieldCategories[i + 1].length
        }
        yFieldCategories[i].forEach(function (category) {
          tableHeaderRow.push({
            name: category,
            label: category,
            rowspan: 1,
            colspan: childrenSize * statisticLabels.size
          })
        })
        $scope.tableHeaderRows.push(tableHeaderRow)
      }
      // handle statistic labels
      let lastHeaderRowLength = 1
      if ($scope.tableHeaderRows.length > 0) {
        lastHeaderRowLength = $scope.tableHeaderRows[$scope.tableHeaderRows.length - 1].length
      }
      let statisticRow = []
      for (let i = 0; i < lastHeaderRowLength; i++) {
        statisticLabels.forEach(function (label) {
          statisticRow.push({
            name: label,
            label: label
          })
        })
      }
      $scope.tableHeaderRows.push(statisticRow)
      // handle top left cell
      let topLeft = {
        name: '',
        label: '',
        rowspan: yFieldCount + 1,
        colspan: xFieldCount
      }
      $scope.tableHeaderRows[0].unshift(topLeft)
    })

    // $scope.tableDataRows
    // let tableDataRowHeaders = []
    // for (let i = 0; i < xFieldCategories.length; i++) {
      // let categories = xFieldCategories[i]
      // // the first field
      // if (tableDataRowHeaders.length === 0) {
      //   for (let j = 0; j < categories.length; j++) {
      //     tableDataRowHeaders.push([{
      //       name: categories[j],
      //       label: categories[j],
      //       rowspan: 1,
      //       colspan: 1
      //     }])
      //   }
      //   continue
      // }
      // for (let a = 0; a < tableDataRowHeaders.length; a++) {
      //   let header = tableDataRowHeaders[a]
      // }
    // }

    $scope.tableHeaderRows = [[
      {
        name: '',
        label: '',
        rowspan: 2,
        colspan: 2
      },
      {
        name: '分类1',
        label: '分类1',
        rowspan: 1,
        colspan: 2
      },
      {
        name: '分类2',
        label: '分类2',
        rowspan: 1,
        colspan: 2
      },
      {
        name: '分类3',
        label: '分类3',
        rowspan: 1,
        colspan: 2
      },
      {
        name: '分类4',
        label: '分类4',
        rowspan: 1,
        colspan: 2
      },
      {
        name: '分类5',
        label: '分类5',
        rowspan: 1,
        colspan: 2
      }
    ],
      [
        {
          name: '统计值1',
          label: '统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label: '统计值2',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值1',
          label: '统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label: '统计值2',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值1',
          label: '统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label: '统计值2',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值1',
          label: '统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label: '统计值2',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值1',
          label: '统计值1',
          rowspan: 1,
          colspan: 1
        },
        {
          name: '统计值2',
          label: '统计值2',
          rowspan: 1,
          colspan: 1
        }
      ]]
    $scope.tableDataRows = [
      {
        headers: [{
          name: '分类一',
          label: '分类一',
          rowspan: 2,
          colspan: 1
        }, {
          name: '男',
          label: '男',
          rowspan: 1,
          colspan: 1
        }],
        datas: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      }, {
        headers: [{
          name: '女',
          label: '女',
          rowspan: 1,
          colspan: 1
        }],
        datas: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      },
      {
        headers: [{
          name: '分类二',
          label: '分类二',
          rowspan: 2,
          colspan: 1
        }, {
          name: '男',
          label: '男',
          rowspan: 1,
          colspan: 1
        }],
        datas: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      }, {
        headers: [{
          name: '女',
          label: '女',
          rowspan: 1,
          colspan: 1
        }],
        datas: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
      }
    ]
  }])
