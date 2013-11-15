(function () {

  'use strict';

  describe('carousel', function() {

    var _dimension = 200; // carousel height x width

    var $element, $scope;

    // helpers

    function swipeUp() {
      swipe(_dimension / 2);
    }

    function swipeDown() {
      swipe(-_dimension / 2);
    }

    function swipe(distance, noTransitionEnd) {
      browserTrigger($element, 'touchstart', { x: _dimension/2, y: (_dimension/2) });
      browserTrigger($element, 'touchmove', { x: _dimension/2, y: (_dimension/2) + distance });
      browserTrigger($element, 'touchend', { x: _dimension/2, y: (_dimension/2) + distance });

      if (noTransitionEnd === undefined || ! noTransitionEnd) {
        browserTrigger($('.carousel__slider' ,$element), 'transitionend' );
      }
    }

    function position(position) {
      var elem;

      $('.carousel__page').each(function(cIndex, cPage) {
        if (getTransform($(cPage)) === 'matrix(1, 0, 0, 1, 0, ' + ( position * _dimension ) + ')') {
          elem = cPage;
        }
      });

      return elem;
    }

    function getTransform(elem) {
      var matrix = elem.css('-webkit-transform');

      if (! matrix) {
        matrix = elem.css('transform');
      }

      return matrix;
    }

    // styles

    $('head').append('<link href="/base/src/angular-carousel.css" rel="stylesheet" type="text/css">');
    $('head').append('<style> #test { width: ' + _dimension + 'px; height: ' + _dimension + 'px; }</style>');

    // angular setup

    beforeEach(module('angular-carousel'));

    beforeEach(module('test/templates/page1.html', 'test/templates/page2.html', 'test/templates/page3.html', 'test/templates/page4.html'));

    beforeEach(inject(function($rootScope, $compile) {

      $scope = $rootScope;

      $scope.content = [
        'test/templates/page1.html',
        'test/templates/page2.html',
        'test/templates/page3.html',
        'test/templates/page4.html'
      ];

      var wrapper = $('<div id="test"></div>');

      $element = $('<carousel content="content"></carousel>');
      $element = $compile($element)($scope);

      $(wrapper).append($element);
      $('body').append(wrapper);

      $scope.$digest();

    }));

    afterEach(function() {
      $element.remove();
      $scope.$destroy();
    });

    it('creates three pages when initalizing', function() {
      expect($('.carousel__page', $element).length).toBe(3);
    });

    it('includes the given contents', function() {
      expect($('#title', position(1)).html()).toEqual('Page 1');
    });

    it('exposes the current index of this page', function() {
      expect($('#index', position(2)).html()).toEqual('1');
    });

    describe('swipe handling', function() {

      it('changes the focused page after swipe', function() {
        swipeDown();
        expect($('#title', position(1)).html()).toEqual('Page 2');
        swipeDown();
        swipeUp();
        expect($('#title', position(1)).html()).toEqual('Page 2');
      });

      it('stays on the page when swipe is stopped and released', function() {
        swipe(-_dimension/2, true);
        swipe(_dimension/2);
        expect($('#title', position(1)).html()).toEqual('Page 2');
      });

    });

  });

})();
