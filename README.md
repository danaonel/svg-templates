# SVG Templates

## CLI Usage

svgtemplates [path/to/svg/files] [path/to/destination] [path/to/config/file]

## Require Usage

	var svgtemplates = require('svg-templates');
	svgtemplates({
		source: 'path/to/svg/files',
		dest: 'path/to/destination',
		config: {
    	"microphone": {
      	"fill": "#00FF00"
    		},
    	"support": {
      	"fill": "#FFCC00"
    	},
    	"fork": {
      	"fill": "#CC22CC"
			}
		}
	});

## What it does

It takes files located in [path/to/svg/files], replaces all values listed in [path/to/config/file] and copies the resulting files in [path/to/destination]