# Change SVG Colors

## CLI

	svgtemplates *svgs* *dist/svgs* *svg-config.js*

It takes files located in *svgs* folder, replaces all values listed in *svg-config.js* and copies the resulting files in *dist/svgs* folder

## Gulp

	gulp

The options object are added as a parameter to the gulp task


## Node

	node test.js

The options are added as a parameter to *svgtemplates()* function
