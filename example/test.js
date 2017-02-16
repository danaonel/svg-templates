var svgtemplates = require('svg-templates');

svgtemplates({
  source: 'svgs',
  dest: 'dist/svgs',
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