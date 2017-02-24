'use strict';

var fs = require( 'node-fs' );
var npath = require( 'path' );
var del = require('del');
var mkdirp = require( 'mkdirp' );
var globber = require( 'globber' );
var cheerio = require( 'cheerio' );
var Promise = require( 'promise' );
var log = require( './utils/logger' );

var options = {
  source: null,
  dest: null,
  config: {}
}

module.exports = function( args ) {
  options = Object.assign( {}, args );
  return init( args );
};

function init( options ) {

  checkSource()
  .then( checkDestination )
  .then( updateFiles );

}

function updateFiles() {
  
  var source = options.source
      , dest = options.dest
      , config = options.config
      , updatedFilesPromises = []
      , filePromise
      ;
  
  globber( source, (err, path ) => {

    path.forEach( file => {
      
      filePromise = new Promise( function( resolve, reject ) {
        
        readFile( file )
        .then( function( data ) {
        
              var $ = cheerio.load( data );
            
              // Iterate through classes in the config files
              for ( var selector in config ) {

                // Iterate through properties only if selector exists in the file
                if( $( selector ).length > 0 ) {
                  var currObj = config[ selector ];

                  // Iterate through properties belonging to current ID in the config file
                  for ( var attrb in currObj ) {

                    if ( currObj.hasOwnProperty( attrb ) ) {

                      $( selector ).attr( attrb, currObj[ attrb ] );

                    }
                  }
                }
              }
            
              var destPath = file.split( source )
                  , destination
                  ;

              destination = npath.join( dest, destPath[ 1 ] );

              createFile( destination, $.html() ).then( resolve() );
        
          });
        
      });
    });
    
    updatedFilesPromises.push( filePromise );
    
    Promise.all( updatedFilesPromises );

  });
}

/* 
    Check if source directory exists 
    If source does not exist stop
*/
function checkSource() {
  
  return new Promise( function ( resolve, reject ) {
    
    var path = options.source;
    
    fs.stat( path, (err, fileStat ) => {
      
      if( err ) {
        
        log.error( 'Folder ' + path + ' does not exist.' );
        
        return reject( err );
        
      } else {
        
        return resolve( path );
        
      }
    });
  });
}

/* 
    Check if destination directory exists 
    If destination does not exist, create it and resolve
    If destination directory exists, delete it and resolve
*/
function checkDestination() {
    
    return new Promise( function ( resolve, reject ) {
      
        var path = options.dest;
        
        fs.stat( path, (err, fileStat ) => {
          
          if( err ) {
              createDir( options.dest )
              .then( resolve() );

          } else {
            
            del( path ).then( function() {
              resolve() ;
            });
            
          }
        });
    });
}

/*
    Utilities
*/
function createDir( path ) {
  
  return new Promise( function ( resolve, reject ) {

      mkdirp( path, function ( err ) {

          if ( err ) return reject( err );

          resolve();
      });
  });
}

function createFile( file, contents ) {
  
  return new Promise( function( resolve, reject ) {
  
    var path = npath.parse( file ).dir;
  
    createDir( path )
    .then( function () {
      
      fs.writeFile( file, contents, function ( err ) {

          if ( err ) return log.error( 'File ' + file + ' cannot be created!!' + '\n' + err );

          return log.info( 'New File ' + file + ' has been created!!' );
      });
  
    });
  });
}

function readFile( file ) {

    return new Promise( function( resolve, reject ) {

        fs.readFile( file, 'utf8', function( err, data ) {

            if ( err ) return reject( err );

            return resolve( data );
        });
    });
}