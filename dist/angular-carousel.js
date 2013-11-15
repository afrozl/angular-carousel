(function(window, angular, undefined) {

  'use strict';

  var ngCarousel = angular.module('angular-carousel', [ 'swipe' ]);

  ngCarousel.directive('carousel', [ '$parse', 'swipe', function($parse, $swipe) {
    return {

      restrict: 'E',
      replace: true,
      scope: {
        content: '=content'
      },
      template: '<div class="carousel"><div class="carousel__slider">' +
         '<div class="carousel__page" ng-include="carousel.content(0)" ng-init="index=carousel.index(0)"></div>' +
         '<div class="carousel__page" ng-include="carousel.content(1)" ng-init="index=carousel.index(1)"></div>' +
         '<div class="carousel__page" ng-include="carousel.content(2)" ng-init="index=carousel.index(2)"></div>' +
       '</div></div>',

      link: function($scope, $element, attrs) {

        var _options = {
          prefixes: [ 'webkit', 'moz', 'o', 'ms' ]
        };

        // private

        var _index = 0;
        var _order = [ 0, 1, 2 ];

        var _swipe;

        // dom

        var _slider = angular.element($element).children();
        var _pages = angular.element(_slider).children();

        // helpers

        function _prefixes(sProperty, sVal) {
          var css = {};

          css[sProperty] = sVal;

          angular.forEach(_options.prefixes, function(pFix) {
            css['-' + pFix + '-' + sProperty] = sVal;
          });

          return css;
        }

        // content

        function _init() {
          _index = 0;
        }

        function _position(pId) {
          var position;

          angular.forEach(_order, function(eOrderId, eIndex)
          {
            if (eOrderId === pId)
            {
              position = eIndex;
            }
          });

          return position;
        }

        // animation

        function _move(mCoordY) {
          angular.element(_slider).css(_prefixes( 'transform', 'translate3d(0, ' + mCoordY + 'px, 0 )' ));
          _swipe.slider = mCoordY;
        }

        // swipe

        _swipe = {
          start: 0,
          current: 0,
          slider: 0
        };

        var swipeEvents = {

          start: function(sCoords) {
            _swipe.start = sCoords.y;
            _swipe.current = sCoords.y;
          },

          move: function(sCoords) {
            var delta = sCoords.y - _swipe.current;
            var direction = sCoords.y - _swipe.start;
            var newy = _swipe.slider + delta;

            _swipe.current = sCoords.y;

            _move(newy);
          },

          end: function(sCoords) {

          },

          cancel: function(sCoords) {
            console.log('cancel');
          }

        };

        $swipe.bind($element, swipeEvents);

        // public

        $scope.carousel = {

          content: function(pId) {
            if ($scope.content !== undefined) {
              return $scope.content[_position(pId)];
            } else {
              return ''
            }
          },

          index: function(pId) {
            return _position(pId) + _index;
          }

        };

        // init when content changed

        $scope.$watchCollection('content', function() {
          _init();
        });
      }
    };
  }]);

})(window, window.angular);
