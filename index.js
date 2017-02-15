'use strict';

var fs = require( 'node-fs' );
var globber = require( 'globber' )
var cheerio = require( 'cheerio' );
var Promise = require('promise');

function checkDir( who, dir ) {
  
  if( who === 'source' ) {
    
    fs.stat( dir, function( err, fileStat  ) {
      if( err ) {
        console.log( 'Source folder *' + dir + '* does not exist.' );
        return;
      } 
    });
    
  }
  
  if( who === 'dest' ) {
    fs.stat( dir, function( err, fileStat  ) {
      if( err ) {
        createDir( dir );
      } else {
        function removeCreateDir(){
          return removeDir( dir ).then( createDir( dir ) );
        }
      }
    });
  }
}

function createDir( dir ) {
  
  fs.mkdir( dir, '0777', true, function ( err ) {
      if ( err ) {
        var errMessage = 'Failed to create ' + dir + ' directory'
        console.log( errMessage, err );
      }
  });

}

function removeDir( dir ) {
  
  globber( dir, (err, path ) => {
    
    path.forEach( file => {
      fs.unlink( file );
    });
    
    fs.rmdirSync( dir );
    
  });
}

function updateFiles( options ) {
  
  var source = options.source
      , dest = options.dest
      , config = options.config
      ;
  
  // check if source directory exists
  checkDir( 'source', source );
  
  /* check if destination directory exists. 
    * If no, create new directory
    * If yes, delete existing directory and create new one. 
  */
  checkDir( 'dest', dest );
  
  globber( source, (err, path ) => {
    
    path.forEach( file => {
      
      fs.readFile( file, 'utf8', function( err, fileContents ) {
        
        if ( err ) throw err;
        
        var $ = cheerio.load( fileContents );
        
        // Iterate through ID in the config files
        for ( var id in config ) {

          if ( config.hasOwnProperty( id ) ) {

            var currObj = config[ id ];

            // Iterate through properties belonging to current ID in the config file
            for ( var attrb in currObj ) {

              if ( currObj.hasOwnProperty( attrb ) ) {

                $( '#'+ id ).attr( attrb, currObj[ attrb ] );

              }
            }
          }
        }
        
        var destinationFile = file.split('/');
        destinationFile = destinationFile.pop();
        var destination = dest + '/' + destinationFile;

        fs.writeFile( destination, $.html() , function(err) {
            if (err) throw err;
            console.log( destinationFile + ' has been updated!!!' );
        });
      });
    });

  });
  
}

module.exports = function( args ) {
  return updateFiles( args );
};