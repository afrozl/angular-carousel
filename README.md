angular-carousel
=========================

Mobile-ready vertical carousel directive for angular js 1.2.

## Install

Add this line to your *bower.json* dependencies

    "angular-carousel":  "git@github.com:marmorkuchen-net/angular-carousel.git"

and run *bower install* afterwards.

The carousel depends on [angular-swipe](https://github.com/marmorkuchen-net/angular-swipe), a small extention of the current angular 1.2 $swipe service, since it doesnt support vertical swipe movements.

Include these *.js* and *.css* files into your *.html* main document:

    <script src="<your bower_components>/angular-swipe/dist/angular-swipe.js"></script>
    <script src="<your bower_components>/angular-carousel/dist/angular-carousel.js"></script>

    <link rel="stylesheet" href="<your bower_components>/angular-carousel/dist/angular-carousel.css">

## Usage

Wrap the carousel in a layout-container:

    <div class="container" ng-controller="AppCtrl">
      <carousel content="mycontent"></carousel>
    </div>

The carousel is watching its content attribute, awaiting an array with strings of view template urls which will be included as our carousel pages. For example:

    app.controller('AppCtrl', ['$scope', function($scope)
    {
      $scope.mycontent = [ 'views/home.html', 'views/about.html', 'views/contact.html' ];
    }]);

When using the same template for every page (only the index changes, as in galleries for example) pass over an object with the following attributes:

    app.controller('AppCtrl', ['$scope', function($scope)
    {

      $scope.gallery = [ 'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg' ];

      $scope.mycontent = {
        template: 'views/gallery.html',
        count: $scope.gallery.length
      };

    }]);

#### Get current index

The page index is "exposed" to the scope of the current included pages and can be accessed with a small (hacky) trick. Use this in your template files (like 'views/gallery.html'):

    <h1>Gallery</h1>
    <p>Slide {{ carousel.index(page.id) + 1 }} of {{ pictures.length }}</p>

Look into 'app/' for a similar example.

#### Options

Overwrite the default options via the *options* attribute in the directive:

    <carousel content="mycontent" options="{ buffer: 5, hint: 10 }"></carousel>

Following options are available:

* *treshold*: 0.25 (Double) - swipe distance to trigger a page flip (0.25 = 25% of carousel's height)
* *rubberband*: 4 (Integer) - effect when reaching the carousel's border
* *duration*: 300 (Integer) - milliseconds (ms) of the longest transition animation
* *extreme*: 200 (Integer) - when (ms) the user starts two swipes within this timeframe it will be handled with nearly no animation (for fast usage of the carousel)
* *hint*: 0 (Integer) - makes the border of the bottom coming page visible (size in pixels)
* *buffer*: 3 (Integer) - number of the loaded pages (only odd numbers!)

# Development

Using grunt, bower and karma test environment with jasmine framework and jquery.

    bower install && npm install

    grunt serve

    grunt karma
    grunt karma:live

    grunt build (default)
