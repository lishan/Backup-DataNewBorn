'use strict';

/**
 * Controller of the dashboard
 */
angular.module('basicApp')
  .controller('DataModelCtrl',['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.tab = "dataModel";
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
