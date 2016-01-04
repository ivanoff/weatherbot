'use strict';

var rules = {};

rules.getCityName = function( message, callback ){
  var c = message;

  // in case of small letter after space first letter to lowercase
  if( c.match( /\s[a-z]/ ) ) { 
    c = c.charAt(0).toLowerCase() + c.slice(1);
  }
  // fix the line
  c = c.replace( /\W+$/, "" );
  c = c.replace( /\s+/g, " " );

  // in case of finding uppercase
  if( c.match( /([A-Z])/ ) ){
    c = " " + c;
    c = c.replace( /.*?\s([A-Z].*)/, "$1" );
    c = c.replace( /\s([a-z].*)/, "" );
  }

  callback( null, c );
};

module.exports = rules;
