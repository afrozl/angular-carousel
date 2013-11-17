/* global angular */

'use strict';

var app = angular.module('app', [ 'angular-carousel' ]);

app.controller('AppCtrl', ['$scope', '$timeout', function($scope, $timeout)
{
  function getContent(cSize) {
    var content = [];

    for (var i = 0; i < cSize; i++) {
      content.push('views/gallery.html');
    }

    return content;
  }

  //$scope.somecontent = getContent(5);

  $scope.somecontent = { template: 'views/gallery.html', count: 10 };

  //$timeout(function(){ $scope.somecontent = getContent(5); }, 2000);
}]);