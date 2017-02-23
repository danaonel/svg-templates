var svgtemplates = require('svg-templates');

svgtemplates({
  source: 'source/img/svgs',
  dest: 'dist/img/svgs',
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
});