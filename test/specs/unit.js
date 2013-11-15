(function () {

  'use strict';

  describe('carousel', function() {

    var elem, scope;

    beforeEach(module('angular-carousel'));

    beforeEach(module( 'test/templates/page1.html', 'test/templates/page2.html', 'test/templates/page3.html', 'test/templates/page4.html' ));

    beforeEach(inject(function($rootScope, $compile) {

      elem = angular.element('<div><carousel content="content"></carousel></div>');
      scope = $rootScope;

      scope.content = [
        'test/templates/page1.html',
        'test/templates/page2.html',
        'test/templates/page3.html'
      ];

      $compile(elem)(scope);
      scope.$digest();

    }));

    it('creates three pages when initalizing', function() {
      expect($('.carousel__page', elem).length).toBe(3);
    });

    it('includes the given contents', function() {
      expect($('.carousel__page:nth-child(1) #title', elem).html()).toEqual('Page 1');
    });

    it('exposes the current index of this page', function() {
      expect($('.carousel__page:nth-child(2) #index', elem).html()).toEqual('1');
    });

  });

})();
