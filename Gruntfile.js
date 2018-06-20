module.exports = function(grunt) {
   var jsTemp = 'temp/app.js';

   var jsVendors = [
      "scripts/vendors/angular.min.js",
      "scripts/vendors/jquery-3.2.1.min.js",
      "scripts/vendors/rangeslider.js",
      //"scripts/vendors/pdf.worker.js",
      "scripts/vendors/pdf.js",
      "scripts/vendors/pako.min.js",
      "scripts/vendors/jszip.min.js",
      "scripts/vendors/UPNG.js",
      "scripts/vendors/UZIP.js",
      "scripts/vendors/image-compressor.js",
   ];

   var jsPriority = [
      "scripts/app/app.js",

      "scripts/app/models/*.js",

      "build/templates.js",

      "scripts/app/directives/*.js",
      "scripts/app/filters/*.js",
      "scripts/app/controllers/*.js",
      "scripts/app/controllers/*/*.js"
   ];

   grunt.initConfig({
      concat: {
         rel :{
            src: jsVendors.concat([jsTemp]),
            dest: 'build/scripts.js'
         },
         temp :{
            src: jsPriority,
            dest: 'temp/app.es6.js'
         }
      },

      watch: {
         jsTemp: {
            files: jsPriority,
            tasks: ['concat:temp', 'babel'] //, 'uglify'
         },
         jsAll: {
            files: [jsTemp],
            tasks: ['concat:rel'] //, 'uglify'
         },
         less: {
            files: ['styles/**.less', 'styles/*/*.less'],
            tasks: ['less']
         },
         templates: {
            files: ['templates/*.html', 'templates/*/*.html'],
            tasks: ['ngtemplates']
         },
         /*build: {
            files: ['build/*.*', 'index.html'],
            tasks: ['assets_inline']
         }*/
      },

      babel: {
         options: {
            sourceMap: false,
            presets: ['env']
         },
         dist: {
            files: {
               'temp/app.js': 'temp/app.es6.js'
            }
         }
      },

      uglify : {
         my_target: {
            files: {
               'build/scripts.js' : ['build/scripts.js']
            }
         }
      },

      ngtemplates: {
         App: {
            src: ['templates/*.html', 'templates/*/*.html'],
            dest: 'build/templates.js',
            options:  {}
         }
      },

      less: {
         options: {
            compress: true,
            ieCompat: true
         },
         styles: {
            files: {
               'build/styles.css': ['styles/@includes.less']
            }
         }
      },

      assets_inline: {
         options: {
            inlineSvg: true,
            inlineSvgBase64: true,
            inlineImg: true,
            inlineLinkTags: true
         },
         all: {
            files: {
               'compressor.html': 'index.html'
            }
         }
      }
   });

   ['grunt-contrib-concat', 'grunt-contrib-watch', 'grunt-assets-inline', 'grunt-babel',
      'grunt-contrib-uglify', 'assemble-less', 'grunt-angular-templates']
      .forEach(function(task) {
         grunt.loadNpmTasks(task);
      });

   grunt.registerTask('default', ['ngtemplates', 'concat:temp', 'babel', 'concat:rel', 'less', 'watch']); //, 'uglify'
   grunt.registerTask('build', ['ngtemplates', 'concat:temp', 'babel', 'concat:rel', 'less', 'uglify', 'assets_inline']); //
};
