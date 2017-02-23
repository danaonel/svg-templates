# SVG Templates

## CLI Usage

#### Example config file

	{
	  "class1": {
	    "fill": "#FFFF00"
	  },
	  "class2": {
	    "fill": "#FFCC00"
	  },
	  "class3": {
	    "fill": "#CC22CC"
	  }
	}

____

	$ svgtemplates path/to/svg/files path/to/destination path/to/config/file

## Nodejs Usage

**test.js**

	var svgtemplates = require('svg-templates');
	svgtemplates({
		source: 'path/to/svg/files',
		dest: 'path/to/destination',
		config: {
			"class1": {
				"fill": "#00FF00"
			},
			"class2": {
				"fill": "#FFCC00"
			},
			"class3": {
				"fill": "#CC22CC"
			}
		}
	});

_____

	$ node test.js

## Gulp Usage

**gulpfile.js**

	var gulp = require('gulp');
	var svgtemplates = require( 'svg-templates' );
	var svgOptions = {
	      source: 'source/img/svgs',
	      dest: 'dist/img/svg',
	      config: {
	        "class1": {
	          "fill": "#FFFF00"
	        },
	        "class2": {
	          "fill": "#FFCC00"
	        },
	        "class3": {
	          "fill": "#CC22CC"
	        }
	      }
	    };
	gulp.task('default', svgtemplates( svgOptions ) );
	

____

	$ gulp

## What it does

All elements with class specified in the configuration will get new attribute(s) or update existing attribute(s).

The resulting file will be moved to *[path/to/destination]* leaving the original file intact in *[path/to/source/files]*.