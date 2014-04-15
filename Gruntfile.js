/* global module:false */
module.exports = function(grunt){
   'use strict';
   var pkg = grunt.file.readJSON('package.json');
   var sources = ['src/**/*.js', 'test/**/*.js', 'Gruntfile.js'];
   // Project configuration.
   var config = {
      // Metadata.
      pkg : pkg,
      // Task configuration.
      jshint : {
         options : {
            jshintrc : '.jshintrc'
         },
         all : sources
      },
      clean : [
         './out'
      ],
      requirejs : {
         compile : {
            options : {
               waitSeconds : 0,
               baseUrl : '.',
               name : 'src/bootstrap',
               mainConfigFile : 'src/main.js',
               out : './out/main-built.js',
               optimize : 'uglify2',
               generateSourceMaps : true,
               preserveLicenseComments : false,
//               optimize : 'none',
               inlineText : true,
               findNestedDependencies : false,
               paths : {
                  requireLib : 'bower_components/requirejs/require'
               },
               include : [
                  'requireLib'
               ],
               exclude : [
                  'bower_components/require-css/normalize',
                  'bower_components/require-less/normalize'
               ]
            }
         }
      },
      preprocess : {
         web : {
            files : {
               'out/index.html'  : 'src/index.html'
            }
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

   grunt.registerTask('verify', ['jshint']);
   grunt.registerTask('test', ['karma:unit']);
   grunt.registerTask('build', [
      'verify', 'test', 'clean', 'requirejs:compile', 'preprocess:web'
   ]);

   // Default task.
   grunt.registerTask('default', [
      'watch'
   ]);

};
