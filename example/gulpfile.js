var gulp = require('gulp');
var svgtemplates = require( 'svg-templates' );
var svgOptions = {
  source: 'source/img/svgs',
  dest: 'dist/img/svg',
  config: {
    "st-0": {
      "fill": "#FFFF00"
    },
    "st-1": {
      "fill": "#FFCC00"
    },
    "st-3": {
      "fill": "#CC22CC"
    },
    "golf-course": {
      "fill": "#CCCCCC"
    }
  }
};

gulp.task('default', svgtemplates( svgOptions ) );