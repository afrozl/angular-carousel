/* global angular */

(function(window, angular, undefined) {

  'use strict';

  var ngCarousel = angular.module('angular-carousel', [ 'swipe' ]);

  ngCarousel.directive('carousel', [ '$compile', 'swipe', function($compile, $swipe) {
    return {

      restrict: 'E',
      replace: true,
      scope: {
        content: '=content'
      },
      template: '<div class="carousel"><div class="carousel__slider"></div></div>',

      link: function($scope, $element, attrs) {

        var _options = {
          index: 'cindex',
          prefixes: [ 'webkit', 'moz', 'o', 'ms' ],
          transition: 'webkitTransitionEnd transitionend oTransitionEnd',
          buffer: 3,
          treshold: 0.25,
          rubberband: 4,
          duration: 300,
          extreme: 200,
          hint: 0
        };

        if (attrs.options !== undefined && typeof $scope.$eval(attrs.options) === 'object') {
          angular.extend(_options, $scope.$eval(attrs.options));
        }

        // private

        var _index, _order;
        var _swipe, _height, _flipped, _lock;

        var _top = -(Math.floor(_options.buffer / 2) + 1);
        var _bottom = -Math.floor(_options.buffer / 2);

        // dom

        var _slider = angular.element($element).children();

        for (var i = 0; i < _options.buffer; i++) {
          var elem = angular.element('<div class="carousel__page"><div class="carousel__page__container" ng-include="carousel.content(' + i + ')" ng-init="'+ _options.index + '=' + i + '"></div></div>');
          angular.element(_slider).append(elem);
        }

        var _pages = angular.element(_slider).children();

        $compile(_pages)($scope);

        // helpers

        function _prefixes(sProperty, sVal) {
          var css = {};

          css[sProperty] = sVal;

          angular.forEach(_options.prefixes, function(pFix) {
            css['-' + pFix + '-' + sProperty] = sVal;
          });

          return css;
        }

        function _resize() {
          _height = angular.element($element)[0].offsetHeight;
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

        function _border() {
          if (_swipe.direction) {
            return _index === _count() + _top;
          } else {
            return _index === _bottom;
          }
        }

        // content

        function _content(cPosition) {

          if ($scope.content.length !== undefined) {
            return $scope.content[cPosition];
          } else {
            return $scope.content.template;
          }
        }

        function _count() {
          if ($scope.content.length !== undefined) {
            return $scope.content.length;
          } else {
            return $scope.content.count;
          }
        }

        function _init() {
          _index = _bottom;
          _order = [];

          for (var i = 0; i < _options.buffer; i++) {
            _order.push(i);
          }

          _resize();
          _rearrange();
          _center();
        }

        function _flip() {
          var tmp, i;

          if (_swipe.direction) {

            // go down

            tmp = _order[0];
            for (i = 0; i < _options.buffer - 1; i++) {
              _order[i] = _order[i + 1];
            }
            _order[_options.buffer - 1] = tmp;

            _index++;

          } else {

            // go up

            tmp = _order[_options.buffer - 1];
            for (i = _options.buffer - 1; i > 0; i--) {
              _order[i] = _order[i - 1];
            }
            _order[0] = tmp;

            _index--;

          }
        }

        function _rearrange() {
          angular.forEach(_pages, function(ePage, eIndex) {
            angular.element(ePage).css(_prefixes( 'transform', 'translate3d(0, ' + (_position(eIndex) * _height) + 'px, 0 )' ));
          });
        }

        // animation

        function _animated(aEnabled, aDuration) {

          var duration = 0;

          if (aEnabled) {

            if (aDuration !== undefined){
              duration = aDuration;
            } else {
              duration = _options.duration;
            }

            _swipe.duration = duration;

            angular.element(_slider).addClass('carousel__slider--animated');

          } else {
            angular.element(_slider).removeClass('carousel__slider--animated');
          }

          _duration(duration);

        }

        function _duration(dMilliseconds) {
          angular.element(_slider).css( _prefixes('transitionDuration', dMilliseconds + 'ms') );
        }

        function _start() {
          _animated(false);
        }

        function _center() {
          _move(_height * _bottom);
        }

        function _move(mCoordY) {
          var newy = mCoordY - _options.hint;
          angular.element(_slider).css(_prefixes( 'transform', 'translate3d(0, ' + newy + 'px, 0 )' ));
          _swipe.slider = mCoordY;
        }

        function _end() {

          _lock = true;
          _flipped = false;

          var dist = Math.abs(_swipe.start - _swipe.current);
          if (dist === 0) { dist = 1; }

          var now = (new Date()).getTime();
          var elapsed = now - _swipe.last;
          var duration;

          if (_swipe.last === undefined || elapsed > _options.duration) {
            duration = Math.round((dist / _height) * _options.duration);
          } else {
            duration = Math.round((elapsed / _options.duration) * _options.duration);
          }

          if (dist > 2 && elapsed < _options.extreme && ! _border()) {
            _animated(false);
            _flipped = true;
            _finished();

          } else {

            if (duration === 0) { duration = 1; }

            _animated(true, duration);

            _swipe.last = (new Date()).getTime();

            if (_border() || dist < _options.treshold * _height) {

              if (_swipe.slider === (_height * _bottom)) {
                _finished();
              } else {
                _center();
              }

            } else {

              _flipped = true;

              if (_swipe.slider === (_height * _top) || _swipe.slider === _height * (_bottom + 1) ) {
                _finished();
              } else {
                if (_swipe.direction) {
                  _move(_height * _top);
                } else {
                  _move(_height * (_bottom + 1));
                }
              }
            }

          }

        }

        angular.element(_slider).bind(
          _options.transition,
          function(event) {
            if (event.srcElement.className.indexOf('carousel__slider') > -1) {
              _finished();
            }
          }
        );

        function _finished() {

          _animated(false);

          if (_flipped) {
            $scope.$apply(function()
            {
              _flip();
              _rearrange();
              _center();
            });
          }

          _lock = false;
        }

        // swipe

        _swipe = {
          start: 0,
          current: 0,
          direction: false,
          slider: 0,

          last: undefined,
          duration: 0,
          started: false
        };

        var swipeEvents = {

          start: function(sCoords) {
            if (_lock){ return; }
            _swipe.start = sCoords.y;
            _swipe.current = sCoords.y;
            _start();

            _swipe.started = true;
          },

          move: function(sCoords) {

            if (_lock || !_swipe.started){ return; }

            var direction = (sCoords.y - _swipe.start) <= 0;
            _swipe.direction = direction;

            if (Math.abs(_swipe.start - sCoords.y) <= _height) {
              var delta = sCoords.y - _swipe.current;
              var newy = _swipe.slider + delta;

              _swipe.current = sCoords.y;

              if (_border()) {
                _move( _swipe.slider + delta / _options.rubberband );
              } else {
                _move(newy);
              }
            }
            else if (! _border())
            {
              if (direction) {
                _move(_height * _top);
              } else {
                _move(_height * (_bottom + 1));
              }
            }
          },

          end: function() {
            if (_lock || !_swipe.started){ return; }
            _swipe.started = false;
            _end();
          }

        };

        $swipe.bind($element, swipeEvents);

        // public

        $scope.carousel = {

          content: function(pId) {
            var content = '';

            if ($scope.content !== undefined) {
              var position = _position(pId) + _index;

              if (position < _count() && position > -1) {
                content = _content(position);
              }
            }

            return content;
          },

          index: function(pId) {
            return _position(pId) + _index;
          }

        };

        // init when content changed

        $scope.$watch('content', function() {
          _init();
        });

        // listen to resize events

        angular.element(window).bind('resize', function(){ _resize(); });
      }
    };
  }]);

})(window, window.angular);
