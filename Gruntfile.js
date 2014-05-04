/* global module:false */
module.exports = function(grunt){
   'use strict';
   var pkg = grunt.file.readJSON('package.json');
   var sources = ['src/**/*.js', 'test/**/*.js', 'Gruntfile.js'];
   var destinationFolder = './out';
   // Project configuration.
   var config = {
      // Metadata.
      pkg : pkg,
      destinationFolder : destinationFolder,
      // Task configuration.
      jshint : {
         options : {
            jshintrc : '.jshintrc'
         },
         all : sources
      },
      clean : [
         '<%= destinationFolder %>'
      ],
      requirejs : {
         cmn : {
            options : {
               waitSeconds : 0,
               baseUrl : '.',
               name : 'src/cmn/module',
               mainConfigFile : ['src/main.js'],
               out : '<%= destinationFolder %>/cmn-built.js',
               optimize : 'uglify2',
               generateSourceMaps : true,
               preserveLicenseComments : false,
               inlineText : true,
               findNestedDependencies : true,
               paths : {
                  requireLib : 'bower_components/requirejs/require'
               },
               include : [
                  'requireLib',
                  'json'
               ],
               exclude : [
                  'bower_components/require-css/normalize',
                  'bower_components/require-less/normalize'
               ]
            }
         },
         app : {
            options : {
               waitSeconds : 0,
               baseUrl : '.',
               name : 'src/bootstrap',
               mainConfigFile : ['src/main.js', 'src/app/main.js'],
               out : '<%= destinationFolder %>/app-built.js',
               optimize : 'uglify2',
               generateSourceMaps : true,
               preserveLicenseComments : false,
               inlineText : true,
               findNestedDependencies : true,
               exclude : [
                  'src/cmn/module'
               ]
            }
         }
      },
      preprocess : {
         web : {
            src : 'src/index.html',
            dest : '<%= destinationFolder %>/index.html'
         }
      },
      watch : {
         scripts : {
            files : sources,
            tasks : ['verify', 'test'],
            options : {
               spawn : true,
               interrupt : true,
               atBegin : true
            }
         }
      },
      karma : {
         unit : {
            configFile : 'test/config/karma.conf.js',
            options : {
               singleRun : true,
               browsers : ['PhantomJS']
            }
         }
      },
      copy : {
         config : {
            expand : true,
            src : ['config/**'],
            dest : '<%= destinationFolder %>'
         }
      }
   };

   grunt.initConfig(config);

   // These plugins provide necessary tasks.
   grunt.loadNpmTasks('grunt-contrib-requirejs');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-preprocess');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-karma');
   grunt.loadNpmTasks('grunt-contrib-copy');

   grunt.registerTask('verify', ['jshint']);
   grunt.registerTask('test', ['karma:unit']);
   grunt.registerTask('build', [
      'verify', 'test', 'clean', 'requirejs:cmn', 'requirejs:app', 'preprocess:web', 'copy:config'
   ]);

   // Default task.
   grunt.registerTask('default', [
      'watch'
   ]);

};
