var gulp = require('gulp');
var svgtemplates = require( 'svg-templates' );
var svgOptions = {
      source: 'svgs',
      dest: 'dist/svgs',
      config: {
          "microphone": {
              "fill": "#CCCCCC"
          },
          "support": {
              "fill": "#999999"
          },
          "fork": {
              "fill": "#CCCCCC"
          }
      }
    };

gulp.task('default', svgtemplates( svgOptions ) );