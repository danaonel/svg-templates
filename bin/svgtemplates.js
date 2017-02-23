#!/usr/bin/env node

var fs = require( 'node-fs' );
var svgtemplates = require('../index.js');
var Promise = require( 'promise' );
var log = require( '../utils/logger' );

var source = process.argv[ 2 ]
    , dest = process.argv[ 3 ]
    , configFile = process.argv[ 4 ]
    , config
    , options = {}
    ;


(function () {
    
    readFile( configFile )
    .then( function( data ) {
      
      config = JSON.parse( data );
      options.source = source;
      options.dest = dest;
      svgtemplates( options );
      
    })
    .catch( function() {
      log.error( 'Please provide a configuration file!!')
    });

}());

function readFile( file ) {

    return new Promise( function( resolve, reject ) {

        fs.readFile( file, 'utf8', function( err, data ) {

            if ( err ) return reject( err );

            return resolve( data );
        });
    });
}
