#!/usr/bin/env node

var fs = require( 'node-fs' );
var svgtemplates = require('../index.js');

var source = process.argv[ 2 ]
    , dest = process.argv[ 3 ]
    , configFile = process.argv[ 4 ]
    , config
    , options = {}
    ;


(function () {

  if( !configFile ) {
    console.log( 'Please provide a configuration file!' );
    return;
  }

  var data = fs.readFileSync( configFile ).toString();

  config = JSON.parse( data );
  
  options.source = source;
  options.dest = dest;
  options.config = config;

}());

svgtemplates( options );