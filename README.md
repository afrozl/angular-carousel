angular-carousel
=========================

Mobile-ready vertical carousel directive for angular js 1.2.

## Install

Add this line to your *bower.json* dependencies

  "angular-carousel":  "git@github.com:marmorkuchen-net/angular-carousel.git"

and run *bower install* afterwards.

The carousel depends on [angular-swipe](https://github.com/marmorkuchen-net/angular-swipe), a small extention of the current angular 1.2 $swipe service, since it doesnt support vertical swipe movements.

Include these files into your .html document:

  <script src="<your bower_components>/angular-swipe/dist/angular-swipe.js"></script>
  <script src="<your bower_components>/angular-carousel/dist/angular-carousel.js"></script>

## Usage

Wrap the carousel in a layout-container:

  <div class="container" ng-controller="AppCtrl">
    <carousel content="mycontent"></carousel>
  </div>

The carousel is watching its content attribute, awaiting an array with strings of view template urls which will be our included as our carousel pages. For example:

  app.controller('AppCtrl', ['$scope', function($scope)
  {
    $scope.mycontent = [ 'views/home.html', 'views/about.html', 'views/contact.html' ];
  }]);

# Get current index

The page index is "exposed" to the scope of the current included pages and can be accessed with a small (hacky) trick. Use this in your template files (like 'views/gallery.html'):

  <h1>Gallery</h1>
  <p>Slide {{ carousel.index(cindex) + 1 }} of {{ pictures.length }}</p>

Look into 'app/' for a similar example.

# Options

Overwrite the default options via the *options* attribute in the directive:

  <carousel content="mycontent" options="{ buffer: 5, hint: 10 }"></carousel>

Following options are available:

* treshold: 0.25 (Double) - How long has the swipe to be to trigger a page flip (0.25 = 25% of carousel height)
* rubberband: 4 (Integer) - Effect when reaching the carousel's border
* duration: 300 (Integer) - Milliseconds of the longest animation
* extreme: 100 (Integer) - When the user gives another input within these Milliseconds it will be handled with nearly no animation (for fast usage of the carousel)
* hint: 0 (Integer) - Makes the border of the coming page visible (Size in pixels), buffer >3 recommended
* buffer: 3 (Integer) - Number of the loaded pages (only odd numbers!)

* transition: 'webkitTransitionEnd transitionend oTransitionEnd' (String) - names of animation transition end events for different vendors
* prefixes: [ 'webkit', 'moz', 'o', 'ms' ] (String-Array) - vendor prefixes for css attributes
* index: 'cindex' (String) - name of the variable which will be injected into the templates scope

# Development

Using grunt, bower and karma test environment with jasmine framework.

  bower install && npm install

  grunt serve

  grunt karma
  grunt karma:live

  grunt build