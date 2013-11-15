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

  $scope.content = getContent(10);

  //$timeout(function(){ $scope.content = getContent(5); }, 2000);
}]);