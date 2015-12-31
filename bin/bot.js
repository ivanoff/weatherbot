#!/usr/bin/env node

'use strict';

/**
 * Weatherbot starter
 *
 * Environment variables for weatherbot:
 *
 *  WEATHERBOT_NAME    : the username of the bot.
 *  WEATHERBOT_API_KEY : the authentication token to allow the bot to connect to your slack organization.
 *                       You can get your token here: https://<name>.slack.com/services/new/bot
 */

var config = require('config');
var weatherBot = require('../lib/weatherBot');

var wb = new weatherBot({
  name : process.env.WEATHERBOT_NAME    || ( config.has( 'name' ) && config.get( 'name' ) ) || 'weatherbot',
  token: process.env.WEATHERBOT_API_KEY || config.get( 'token' ),
  channels: config.get( 'channels' ) || 'weather',
});

wb.run(function( err ){
  if( err ){
    console.error( err );
  } else {
    console.log( 'Started...' );
    console.log( 'Channels to watch: ' + wb.settings.myChannels.join(', ') );
//    console.log( 'All channels list: ' + wb.settings.allChannels.join(', ') );
  }
});
