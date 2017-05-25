'use strict'

/**
 * Controller of the rfm
 */
angular.module('dataNewBorn')
  .controller('RfmCtrl', ['$rootScope', '$scope', '$http', 'Notification', 'NgTableParams', '$httpParamSerializerJQLike', '$window', '$filter', function ($rootScope, $scope, $http, Notification, NgTableParams, $httpParamSerializerJQLike, $window, $filter) {
    $rootScope.init('rfm')
    // TODO demo execution plan
    $scope.themes = [
      {
        id: 1,
        label: '2016-11-01方案'
      },
      {
        id: 2,
        label: '2016-11-15方案'
      },
      {
        id: 3,
        label: '2016-12-01方案'
      }
    ]
    $scope.selectedItem = $scope.themes[0]

    $scope.show = function () {
      $http.post('/api/rfm/statistic/charts', {
        startDate: $scope.startDate ? $filter('date')($scope.startDate, 'yyyy-MM-dd') : null,
        endDate: $scope.endDate ? $filter('date')($scope.endDate, 'yyyy-MM-dd') : null,
        startAmount: $scope.startAmount,
        endAmount: $scope.endAmount,
        orderStatus: $scope.selectedStatus ? $scope.selectedStatus.name : null,
        gender: $scope.selectedGender ? $scope.selectedGender.name : null,
        diliver: $scope.selectedDiliver ? $scope.selectedDiliver.name : null,
        supplierId: $scope.selectedSupplierId ? $scope.selectedSupplierId.name : null
      }).then(function (ret) {
        // setup tables
        $scope.queryDataTableData = ret.data
        $scope.queryDataTableParams = new NgTableParams({}, { dataset: ret.data})
        // setup charts
        let labels = ['金额', '订单量', '订单平均金额']
        $scope.charts = [{}, {}, {}]
        for (let i = 0; i < 3; i++) {
          let chart = {}
          chart.config = {
            title: labels[i],
            showTitle: false,
            toolbox: {
              show: true,
              feature: {
                dataView: {show: true, readOnly: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            dataZoom: [
              {
                show: true,
                start: 0,
                end: 10
              },
              {
                show: true,
                yAxisIndex: 0,
                filterMode: 'empty',
                height: '80%',
                showDataShadow: false,
                left: '5%'
              }
            ]
          }
          let datapoints = []
          $.each(ret.data, function (index, dataRow) {
            let names = Object.getOwnPropertyNames(dataRow)
            datapoints.push({
              x: dataRow[names[0]],
              y: dataRow[names[i + 1]]
            })
          })
          chart.data = [{
            datapoints: datapoints
          }]
          $scope.charts[i] = chart
        }
      })
    }
    $scope.show()

    $scope.orderStatus = [
      {name: '订单已完成', shade: 'dark'},
      {name: '订单已取消', shade: 'light'},
      {name: '正在制作', shade: 'dark'}
    ]
    $scope.selectedStatus = $scope.orderStatus[0]

    $scope.genders = [
      {name: '女士', shade: 'dark'},
      {name: '先生', shade: 'light'}
    ]

    $scope.dilivers = [
      {name: '自配送', shade: 'dark'},
      {name: '百度物流', shade: 'light'}
    ]

    $scope.supplierIds = [
      {name: '单体商户', shade: 'dark'},
      {name: 'KA商户', shade: 'light'}
    ]

    $scope.locations = [
      {name: 'GX高新一中商圈', shade: 'dark'},
      {name: 'GX高新路商圈', shade: 'light'},
      {name: 'NQ小寨商圈', shade: 'dark'},
      {name: 'CN西关商圈', shade: 'dark'},
      {name: 'BQ市政府商圈', shade: 'light'}
    ]

    $scope.toggleSelection = function (item) {
      item.isRowSelected = !item.isRowSelected
      $scope.locations = []
      $.each($scope.queryDataTableData, function (index, rowData) {
        if (rowData.isRowSelected) {
          $scope.locations.push({
            name: rowData.bussinessLocation
          })
        }
      })
    }

    $scope.types = [
      {
        category: '重要价值客户',
        characters: '最近一次消费时间近，近一周消费金额高，消费频率高',
        stars: [1, 2, 3, 4, 5]
      }, {
        category: '重要保持客户',
        characters: '最近一次消费时间远，但近一周消费金额高，消费频率高',
        stars: [1, 2, 3, 4]
      }, {
        category: '重要发展客户',
        characters: '近两周消费金额高，但消费频率不高',
        stars: [1, 2, 3, 4]
      }
    ]

    $scope.selectedLocation = $scope.locations[0] // red

    $scope.selectLocation = function () {
      $scope.locationPie = {}
      $scope.locationPie.config = {
        title: $scope.selectedLocation.name,
        showTitle: true,
        grid: {
          top: 0,
          bottom: 0
        }
      }
      $scope.locationPie.datapoints = []
      $scope.locationPie.data = [{
        datapoints: $scope.locationPie.datapoints
      }]
      $.each($scope.types, function (index, type) {
        $scope.locationPie.datapoints.push({
          x: type.category,
          y: 1000
        })
      })
      // setup tables
      $scope.locationTable = {}
      $scope.locationTable.data = []
      $.each($scope.types, function (index, type) {
        $scope.locationTable.data.push({
          type: type.category,
          count: 1000,
          total: 100000,
          mean: 100
        })
      })
      $scope.locationTable.data.push({
        type: '其他',
        count: 1000,
        total: 100000,
        mean: 100
      })
      $scope.locationTable.data.push({
        type: '总共',
        count: 1000,
        total: 100000,
        mean: 100
      })
      $scope.locationTable.params = new NgTableParams({}, { dataset: $scope.locationTable.data})

      $scope.tables = []
      for (let i = 0; i < 3; i++) {
        let table = {
          id: i,
          type: $scope.types[i]
        }
        table.columns = [
          {title: '用户id',
          field: 'userid'},
          {title: '用户名',
          field: 'username'},
          {title: '电话号码',
          field: 'phone'},
          {title: '消费金额',
            field: 'm',
          valueFormatter: 'number:2'},
          {title: '消费次数',
          field: 'f'},
          {title: '最近消费(N天前)',
          field: 'r'}
        ]
        $http({
          method: 'POST',
          url: '/api/rfm/table/' + table.id,
          data: $httpParamSerializerJQLike({
            location: $scope.selectedLocation.name
          }),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (ret) {
          table.totalCount = ret.data.totalCount
          table.allCount = ret.data.allCount
          table.tableParams = new NgTableParams({
            page: 1, // show first page
            count: 10 // count per page
          }, {
            total: ret.data.totalCount,
            getData: function getData (params) {
              return $http({
                method: 'POST',
                url: '/api/rfm/table/' + table.id,
                data: $httpParamSerializerJQLike({
                  location: $scope.selectedLocation.name,
                  pageNo: params.page(),
                  pageSize: params.count()
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(function (retData) {
                return retData.data.datas
              })
            }
          })
        })
        $scope.tables.push(table)
      }
    }
    $scope.selectLocation()
    // TODO
    $scope.startDate = new Date(2016, 10, 1)
    $scope.endDate = new Date(2016, 10, 14)
    $scope.checkstartdate = new Date(2016, 10, 15)
    $scope.checkenddate = new Date(2016, 10, 22)

    $scope.export = function (tableId) {
      let label = $scope.types[tableId].category + '.xls'
      $http({
        method: 'POST',
        url: '/api/rfm/table/' + tableId + '/export',
        data: $httpParamSerializerJQLike({
          location: $scope.selectedLocation.name
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function (ret) {
        Notification.success('导出成功！')
        $window.location.href = '/api/rfm/download/file?fileName=' + ret.data.file + '&label=' + label
      })
    }

    $scope.buildRFMModel = function () {
      let selectedLocations = []
      $.each($scope.location, function (index, location) {
        selectedLocations.push(location.name)
      })
      $http.post(
        '/api/rfm/build', {
          bussinessLocations: selectedLocations,
          startDate: $scope.startDate ? $filter('date')($scope.startDate, 'yyyy-MM-dd') : null,
          endDate: $scope.endDate ? $filter('date')($scope.endDate, 'yyyy-MM-dd') : null,
          startAmount: $scope.startAmount,
          endAmount: $scope.endAmount,
          orderStatus: $scope.selectedStatus ? $scope.selectedStatus.name : null,
          gender: $scope.selectedGender ? $scope.selectedGender.name : null,
          diliver: $scope.selectedDiliver ? $scope.selectedDiliver.name : null,
          supplierId: $scope.selectedSupplierId ? $scope.selectedSupplierId.name : null
        }
      ).then(function (response) {
        // Binding data
        $scope.result = response.data
        $scope.show()
      }, function (response) {
        $scope.result = response.data
      })
    }

    $scope.resultChartConfig = {
      title: '投放用户消费对比',
      subtitle: '',
      yAxis: { scale: true },
      debug: true,
      stack: false
    }
    $scope.resultChartData = [
      {
        name: '上周',
        datapoints: [
          { x: 'GX高新一中商圈', y: 22 },
          { x: 'GX高新路商圈', y: 13 },
          { x: 'NQ小寨商圈', y: 35 },
          { x: 'CN西关商圈', y: 52 },
          { x: 'BQ市政府商圈', y: 32 }
        ]
      },
      {
        name: '本周',
        datapoints: [
          { x: 'GX高新一中商圈', y: 28 },
          { x: 'GX高新路商圈', y: 19 },
          { x: 'NQ小寨商圈', y: 55 },
          { x: 'CN西关商圈', y: 82 },
          { x: 'BQ市政府商圈', y: 38 }
        ]
      }
    ]

    $scope.resultChartConfig1 = {
      title: '未投放用户消费对比',
      subtitle: '',
      yAxis: { scale: true },
      debug: true,
      stack: false
    }
    $scope.resultChartData1 = [
      {
        name: '上周',
        datapoints: [
          { x: 'GX高新一中商圈', y: 22 },
          { x: 'GX高新路商圈', y: 13 },
          { x: 'NQ小寨商圈', y: 35 },
          { x: 'CN西关商圈', y: 52 },
          { x: 'BQ市政府商圈', y: 32 }
        ]
      },
      {
        name: '本周',
        datapoints: [
          { x: 'GX高新一中商圈', y: 22 },
          { x: 'GX高新路商圈', y: 15 },
          { x: 'NQ小寨商圈', y: 33 },
          { x: 'CN西关商圈', y: 49 },
          { x: 'BQ市政府商圈', y: 29 }
        ]
      }
    ]
  }])
