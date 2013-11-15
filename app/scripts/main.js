/* global angular */

'use strict';

var app = angular.module('app', [ 'angular-carousel' ]);

app.controller('AppCtrl', ['$scope', '$timeout', function($scope, $timeout)
{
  $scope.content = [ 'views/page1.html', 'views/page2.html', 'views/page3.html' ];
  $timeout(function(){ $scope.content[1] = 'views/page1.html'; }, 2000);
}]);