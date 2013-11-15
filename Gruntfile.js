'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    yeoman: {
      app: 'app',
      src: 'src',
      dist: 'dist'
    },

    watch: {

      styles: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.css'
        ],
        tasks: ['copy:styles']
      },

      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.src %>}/{,*/}*.js',
          'test}/specs/*.js',
          '<%= yeoman.src %>}/{,*/}*.css'
        ]
      }

    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.src %>',
            'bower_components',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>',
            'bower_components',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>',
          livereload: false
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '<%= yeoman.src %>/{,*/}*.js',
        'test/spec/{,*/}*.js'
      ]
    },

    karma: {

      options: {
        frameworks: [ 'jasmine' ],
        files: [
          'bower_components/angular/angular.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-swipe/dist/angular-swipe.js',
          'bower_components/angular-mocks/angular-mocks.js',
          'bower_components/jquery/jquery.js',
          '<%= yeoman.src %>/*.{js,css}',
          'test/helpers/*.js',
          'test/specs/*.js',
          'test/templates/*.html'
        ],
        reporters: [ 'dots', 'progress' ],
        runnerPort: 9999,
        logColors: true,
        browsers: [ 'Chrome' ],
        preprocessors: {
          'test/templates/*.html': 'ng-html2js'
        }
      },

      unit:
      {
        singleRun: true
      },

      live:
      {
        autoWatch: true,
        singleRun: false
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.src %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '{,*/}*.css',
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['<%= yeoman.src %>/**/*.js'],
        dest: '<%= yeoman.dist %>/angular-carousel.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! angular-carousel.min.js <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/angular-carousel.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.registerTask('serve', [
    'clean:server',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('test:live', [
    'clean:server',
    'connect:test',
    'karma:live'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'test',
    'clean:dist',
    'concat',
    'uglify',
    'copy:dist'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
