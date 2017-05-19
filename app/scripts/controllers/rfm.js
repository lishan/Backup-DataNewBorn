'use strict'

/**
 * Controller of the rfm
 */
angular.module('dataNewBorn')
  .controller('RfmCtrl', ['$rootScope', '$scope', '$http', 'Notification', 'NgTableParams', '$httpParamSerializerJQLike', '$window', function ($rootScope, $scope, $http, Notification, NgTableParams, $httpParamSerializerJQLike, $window) {
    $rootScope.init('rfm')
    // TODO demo execution plan
    $scope.themes = [
      {
        id: 1,
        label: '2016-11-01计划'
      },
      {
        id: 2,
        label: '2016-11-15计划'
      },
      {
        id: 3,
        label: '2016-12-01计划'
      }
    ]
    $scope.selectedItem = $scope.themes[0]

    $scope.show = function () {
      $http.get('/api/rfm/statistic/charts/').then(function (ret) {
        $scope.charts = []
        let labels = ['金额', '订单量', '订单平均金额']
        $.each(ret.data, function (index, chartData) {
          let chart = {}
          chart.config = {
            title: labels[index],
            showTitle: false
          }
          let datapoints = []
          $.each(chartData, function (index, dataRow) {
            let names = Object.getOwnPropertyNames(dataRow)
            datapoints.push({
              x: dataRow[names[0]],
              y: dataRow[names[1]]
            })
          })
          chart.data = [{
            datapoints: datapoints
          }]
          $scope.charts.push(chart)
        })
      })
    }
    $scope.show()
    $scope.locations = [
      {name: 'GX高新一中商圈', shade: 'dark'},
      {name: 'GX高新路商圈', shade: 'light'},
      {name: 'NQ小寨商圈', shade: 'dark'},
      {name: 'CN西关商圈', shade: 'dark'},
      {name: 'BQ市政府商圈', shade: 'light'}
    ]
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
          field: 'phone'}
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
    };
    $scope.selectLocation();
    // TODO
    $scope.startdate = new Date(2016, 10, 1)
    $scope.enddate = new Date(2016, 10, 14)

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
    };

    $scope.buildRFMModel = function () {
      $http.post(
        '/api/rfm/build'
      ).then(function (response) {
        // Binding data
        $scope.result = response.data
        $scope.show()
      }, function (response) {
        $scope.result = response.data
      })
    };
  }])
