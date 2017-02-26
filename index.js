'use strict';

var fs = require( 'node-fs' );
var path = require( 'path' );
var del = require('delete');
var mkdirp = require( 'mkdirp' );
var globber = require( 'globber' );
var cheerio = require( 'cheerio' );
var Promise = require( 'promise' );
var log = require( './utils/logger' );

const defaults = {
  source: null,
  dest: null,
  config: {}
}

module.exports = init;

function init( args ) {
  
  const options = Object.assign( {}, defaults, args );
  
  return new Promise( function( resolve, reject ) {

    checkSource( options.source )
    .then( () => { checkDestination( options.dest ) })
    .then( () => { generateFiles( options ) })
    .then( ( paths ) => { 
      resolve( paths );
    });
    
  });

}

function generateFiles( { source, dest, config } ) {
  
  return new Promise( function ( resolve, reject ) {
    
    var updatedFiles = []
  
    globber( source, (err, paths ) => {
      
      updatedFiles = paths;

      const updatedFilesPromises = paths.map( function( file ) {
      
        return new Promise( function( resolve, reject ) {

          readFile( file )
          .then( ( data ) => {
            var fileContent = updateFile( data, config )
                , srcPathArray = file.split( source )
                , fileName = srcPathArray[ 1 ]
                , destination = dest + fileName
                ;

            createFile( destination, fileContent, dest ).then( resolve( destination ) );

          });
        });
      });
    });
  
    return Promise.all( updatedFilesPromises ).then( updatedFilesPromises => {
      return resolve( updatedFiles );
    });
  
  });
}

/* 
    Check if source directory exists 
    If source does not exist stop
*/
function checkSource( src ) {
  
  return new Promise( function ( resolve, reject ) {
    
    fs.stat( src, (err, fileStat ) => {
      
      if( err ) {
        
        log.error( 'Folder ' + src + ' does not exist. Please provide a valid source folder.' );
        
        return reject( err );
        
      } else {
        
        return resolve( src );
        
      }
    });
  });
}

/* 
    Check if destination directory exists 
    If destination does not exist, create it and resolve
    If destination directory exists, delete it and resolve
*/
function checkDestination( dest ) {
  
  return new Promise( function ( resolve, reject ) {
    
    fs.stat( dest, (err, fileStat ) => {
      
      if ( err ) return resolve();
      
      del.promise( [ dest ] ).then( () => { return resolve() });
      
    });
  });
}

/*
    Utilities
*/
function createDir( dir ) {
  
  return new Promise( function ( resolve, reject ) {

      mkdirp( dir, function ( err ) {

          if ( err ) return reject( err );
          
          return resolve( dir );
          
      });
  });
}

function createFile( file, contents ) {
  
  return new Promise( function( resolve, reject ) {
  
    var dest = path.parse( file ).dir;
  
    createDir( dest )
    .then( function () {
      
      fs.writeFile( file, contents, function ( err ) {

          if ( err ) {
            
            log.error( 'File ' + file + ' cannot be created!!' + '\n' + err );
            return reject();
            
          } else {
            
            log.info( 'New File ' + file + ' has been created!!' );
            return resolve();
            
          }
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

function updateFile( data, config ) {
    
    const $ = cheerio.load( data );
    let updatedFileContent;

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

    updatedFileContent = $.html();

    return updatedFileContent;
}