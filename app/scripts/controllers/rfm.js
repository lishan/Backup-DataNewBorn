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

    // TODO
    $scope.startDate = new Date(2016, 10, 1)
    $scope.endDate = new Date(2016, 10, 7)
    $scope.startCompareDate = new Date(2016, 10, 8)
    $scope.endCompareDate = new Date(2016, 10, 13)

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
      {name: '整体', value: 'null', shade: 'dark',
      '重要价值客户': {}, '重要保持客户': {}, '重要发展客户': {}}
    ]

    $scope.setCondtionStr = function () {
      $scope.conditionsStr = '使用'
      if ($scope.startDate) {
        $scope.conditionsStr += '从' + $filter('date')($scope.startDate, 'yyyy-MM-dd') + '开始,'
      }
      if ($scope.endDate) {
        $scope.conditionsStr += '到' + $filter('date')($scope.endDate, 'yyyy-MM-dd') + '结束,'
      }
      if ($scope.startAmount) {
        $scope.conditionsStr += '金额大于等于' + $scope.startAmount + ','
      }
      if ($scope.endAmount) {
        $scope.conditionsStr += '金额小于' + $scope.endAmount + ','
      }
      if ($scope.selectedStatus) {
        $scope.conditionsStr += '订单状态为' + $scope.selectedStatus.name + ','
      }

      if ($scope.selectedGender) {
        $scope.conditionsStr += '客户性别为' + $scope.selectedGender.name + ','
      }
      if ($scope.selectedDiliver) {
        $scope.conditionsStr += '运货方为' + $scope.selectedDiliver.name + ','
      }
      if ($scope.selectedSupplierId) {
        $scope.conditionsStr += '提供商为' + $scope.selectedSupplierId.name + ','
      }

      $scope.conditionsStr = $scope.conditionsStr.substr(0, $scope.conditionsStr.length - 1)
      $scope.conditionsStr += '的数据, 为'
      let locations = ''
      $.each($scope.locations, function (index, location) {
        locations += location.name + ','
      })
      $scope.conditionsStr += locations
      $scope.conditionsStr = $scope.conditionsStr.substr(0, $scope.conditionsStr.length - 1)
      $scope.conditionsStr += '执行RFM模型。'
    }

    $scope.show = function () {
      $scope.setCondtionStr()
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

    $scope.toggleSelection = function (item) {
      item.isRowSelected = !item.isRowSelected
      $scope.locations = [{name: '整体', value: 'null', shade: 'dark',
      '重要价值客户': {}, '重要保持客户': {}, '重要发展客户': {}}]
      $.each($scope.queryDataTableData, function (index, rowData) {
        if (rowData.isRowSelected) {
          $scope.locations.push({
            name: rowData.bussinessLocation,
            value: rowData.bussinessLocation,
            '重要价值客户': {}, '重要保持客户': {}, '重要发展客户': {}
          })
        }
      })
      $scope.setCondtionStr()
    }

    $scope.types = [
      {
        category: '重要价值客户',
        characters: '最近一次消费时间近，近一周消费金额高，消费频率高',
        userType: 3,
        stars: [1, 2, 3, 4, 5]
      }, {
        category: '重要保持客户',
        characters: '最近一次消费时间远，但近一周消费金额高，消费频率高',
        userType: 2,
        stars: [1, 2, 3, 4]
      }, {
        category: '重要发展客户',
        characters: '近两周消费金额高，但消费频率不高',
        userType: 1,
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

      $http({
        method: 'POST',
        url: '/api/rfm/overall',
        data: $httpParamSerializerJQLike({
          location: $scope.selectedLocation.value
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function (ret) {
        // setup tables
        $scope.locationTable = {}
        $scope.locationTable.data = []

        let currentTotal = 0
        let currentCount = 0
        let currentNumber = 0
        for (let i = 0; i < 3; i++) {
          currentTotal += ret.data.datas[i].total
          currentCount += ret.data.datas[i].count
          currentNumber += ret.data.datas[i].number
          ret.data.datas[i].type = $scope.types[i].category
          ret.data.datas[i].mean1 = ret.data.datas[i].total / ret.data.datas[i].number
          ret.data.datas[i].mean2 = ret.data.datas[i].total / ret.data.datas[i].count
          // add pie data
          $scope.locationPie.datapoints.push({
            x: $scope.types[i].category,
            y: ret.data.datas[i].number
          })
          // add table data
          $scope.locationTable.data.push(ret.data.datas[i])
        }
        ret.data.datas[3].mean1 = ret.data.datas[3].total / ret.data.datas[3].number
        ret.data.datas[3].mean2 = ret.data.datas[3].total / ret.data.datas[3].count
        ret.data.datas[3].type = '总计'

        $scope.locationPie.datapoints.push({
          x: '其他',
          y: ret.data.datas[3].number - currentNumber
        })

        let otherRow = {
          type: '其他',
          number: ret.data.datas[3].number - currentNumber,
          total: ret.data.datas[3].total - currentTotal,
          count: ret.data.datas[3].count - currentCount
        }
        otherRow.mean1 = otherRow.total / otherRow.number
        otherRow.mean2 = otherRow.total / otherRow.count
        $scope.locationTable.data.push(otherRow)

        $scope.locationTable.data.push(ret.data.datas[3])
        $scope.locationTable.params = new NgTableParams({}, { dataset: $scope.locationTable.data})
      })

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
            location: $scope.selectedLocation.value
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
                  location: $scope.selectedLocation.value,
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
    $scope.setCondtionStr()

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

    $scope.getRFMChartCondition = function () {
      return {
        startDate: $scope.startDate ? $filter('date')($scope.startDate, 'yyyy-MM-dd') : null,
        endDate: $scope.endDate ? $filter('date')($scope.endDate, 'yyyy-MM-dd') : null,
        startAmount: $scope.startAmount,
        endAmount: $scope.endAmount,
        orderStatus: $scope.selectedStatus ? $scope.selectedStatus.name : null,
        gender: $scope.selectedGender ? $scope.selectedGender.name : null,
        diliver: $scope.selectedDiliver ? $scope.selectedDiliver.name : null,
        supplierId: $scope.selectedSupplierId ? $scope.selectedSupplierId.name : null
      }
    }
    $scope.buildRFMModel = function () {
      let selectedLocations = []
      $.each($scope.locations, function (index, location) {
        if (location.value !== 'null') {
          selectedLocations.push(location.value)
        }
      })
      let condition = $scope.getRFMChartCondition()
      condition.bussinessLocations = selectedLocations
      $http.post(
        '/api/rfm/build', condition
      ).then(function (response) {
        // Binding data
        $scope.result = response.data
        $scope.show()
      }, function (response) {
        $scope.result = response.data
      })
    }

    $scope.setCoupon = function () {
      let couponInfo = []
      $.each($scope.locations, function (index, location) {
        $.each($scope.types, function (index2, type) {
          if (location[type.category].topNum) {
            couponInfo.push({
              bussinessLocation: location.value,
              userType: type.userType,
              topNum: location[type.category].topNum,
              coupon: location[type.category].coupon,
              caseType: location[type.category].caseType
            })
          }
        })
      })

      $http.post(
        '/api/rfm/update/coupon', couponInfo
      ).then(function (response) {
        // TODO
        Notification.success('投放确认成功！共1000人。')
      })
    }

    $scope.getCompareResult = function () {
      let condition = $scope.getRFMChartCondition()
      condition.startCompareDate = $scope.startCompareDate ? $filter('date')($scope.startCompareDate, 'yyyy-MM-dd') : null
      condition.endCompareDate = $scope.endCompareDate ? $filter('date')($scope.endCompareDate, 'yyyy-MM-dd') : null
      $http.post(
        '/api/rfm/compare/summary', condition
      ).then(function (response) {
        // Binding data
        $scope.repay = response.data
      }, function (response) {
        $scope.repay = response.data
      })

      let titles = ['复购率', '金额', '金额', '订单量', '订单量']
     
      let dataNames = [
        ['未投放营销策略', '投放营销策略'],
        [ condition.startDate + '至' + condition.endDate, condition.startCompareDate + '至' + condition.endCompareDate],
        [ condition.startDate + '至' + condition.endDate, condition.startCompareDate + '至' + condition.endCompareDate],
        [ condition.startDate + '至' + condition.endDate, condition.startCompareDate + '至' + condition.endCompareDate],
        [ condition.startDate + '至' + condition.endDate, condition.startCompareDate + '至' + condition.endCompareDate]
      ]
      for (let i = 0; i < 5; i++) {
        $http.post(
          '/api/rfm/compare/' + i, condition
        ).then(function (ret) {
          $scope['resultChartConfig' + i] = {
            title: titles[i],
            subtitle: '',
            yAxis: { scale: true },
            debug: true,
            stack: false
          }

          $scope['resultChartData' + i] = [
            {
              name: dataNames[i][0],
              datapoints: []
            },
            {
              name: dataNames[i][1],
              datapoints: []
            }
          ]

          let names = Object.getOwnPropertyNames(ret.data[0])
          $.each(names, function (index, name) {
            $scope['resultChartData' + i][0].datapoints.push({
              x: name,
              y: ret.data[0][name]
            })
          })

          names = Object.getOwnPropertyNames(ret.data[1])
          $.each(names, function (index, name) {
            $scope['resultChartData' + i][1].datapoints.push({
              x: name,
              y: ret.data[1][name]
            })
          })
        })
      }
    }
  }])
