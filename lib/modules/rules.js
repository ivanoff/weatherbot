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

  var iam = message.match( /^(no,? )?(weatherbot,? )?(you're|you'are|you are)\s(.*)\??/i );
  var ami = message.match( /^weatherbot[,\s]+(are you)\s([^\?]*)/i );
  var newUser = message.match( /\|(.*)\> has joined the channel/i );
  // check phrase: weatherbot, you are ...
  if( iam ){
    additional = iam[4];
    c = "~set";
  } 
  // check phrase: weatherbot, are you...
  else if( ami ){
    additional = ami[2];
    c = "~get";
  } 
  // check phrase: weatherbot, are you...
  else if( newUser ){
    additional = newUser[1];
    c = "~helloNew";
  } 
  // check phrase: weatherbot, are you...
  else if( message.match( /^weatherbot[,\s]+who (are you|you are|you're|you'are)\??/i ) ){
    c = "~get";
  } 
  // check phrase: who I am
  else if( message.match( /^(weatherbot[,\s]+)?who\s?(iam|ami|i am|am i)\??/i ) ){
    c = "~who";
  } 
  // just smile
  else if( c.match( /weatherbot/i ) || c.match( /^(cool|nice|good|omg|ah+a|heh|ha(-?ha)*)$/i ) ){
    c = "~smile";
  } 
  // fwords
  else if( message.match( /(shit|wtf|fuck)/i ) ){
    c = "~silent";
  } 
  // hello message
  else if( message.match( /^(hi|hello|hey|help|help me)\W*$/i ) ){
    c = "~hello";
  } 
  // thank you message
  else if( c.match( /(thank you|tanks|thanks|10x)/i ) ){
    c = "~thanks";
  } 
  // don't show
  else if( c && message.match( /(don't|can't show|do not|not to)/i ) ){
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
