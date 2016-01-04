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

  var additional;

  // check phrase: weatherbot, you are ...
  var iam = c.match( /^weatherbot[,\s]+(you're|you'are|you are)\s(.*)/i );
  if( iam ){
    additional = "Yes, I'm "+iam[2]+" :)";
    c = "~say";
  } 
  // just smile
  else if( c.match( /weatherbot/i ) || c.match( /^cool|nice|good|ah+a|ha$/i ) ){
    c = "~smile";
  } 
  // thank you message
  else if( c.match( /^hi|hello|hey|help$/i ) ){
    c = "~hello";
  } 
  // thank you message
  else if( c.match( /(thank you)|(tanks)|(thanks)|(10x)/i ) ){
    c = "~thanks";
  } 
  // don't show
  else if( c && message.match( /(don't)|(can't show)|(do not)|(not to)/i ) ){
    additional = 'Gee... There is no weather in '+c+', pal :)';
    c = "~say";
  }
  // error
  else if( c.match( /^\W/ ) || c.match( /^.{1,2}$/ ) || c.match( /(.*\s){3,}/ ) ){
    additional = 'BAD CITY NAME: ' + c;
    c = "~error";
  } 

  callback( null, c, additional );
};

module.exports = rules;
