(function(window, angular, undefined) {

  'use strict';

  var ngCarousel = angular.module('angular-carousel', [ 'swipe' ]);

  ngCarousel.directive('carousel', function() {
    return {

      restrict: 'E',
      replace: true,
      template: '<div class="carousel"><div class="carousel__slider"></div></div>',

      link: function(scope, element, attrs) {

      }
    };
  });

})(window, window.angular);
