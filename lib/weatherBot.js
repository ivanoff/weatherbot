'use strict';

var async = require('async');
var util = require('util');
var Bot  = require('slackbots');
var w    = require('./modules/weather');
var r    = require('./modules/rules');

var weatherBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.myChannels = this.settings.channels.split(',');
  this.name = this.settings.name || 'weatherbot';

  console.log( this.channels );

  this.user = null;
};

util.inherits(weatherBot, Bot);

weatherBot.prototype.run = function( callback ){
  weatherBot.super_.call(this, this.settings);
  if( !this.settings.token || this.settings.token == 'put your Slack bot token here' ) {
    callback('Please define token at config file or by setting of WEATHERBOT_API_KEY');
  } else {
    this.on('start',   this._onStart  );
    this.on('message', this._onMessage);
    callback();
  }
};

weatherBot.prototype._onStart = function( callback ){
  this._loadBotUser();
  this._welcomeMessage();
};

weatherBot.prototype._onMessage = function (message) {
  if ( this._isChatMessage(message)
    && this._isChannelConversation(message)
    &&!this._isFromWeatherBot(message)
  ) {
    this._replyWeather(message);
  }
};

weatherBot.prototype._replyWeather = function (message) {

  var self = this;
  var channel = self._getChannelById( message.channel );

  r.getCityName( message.text, function( err, city, text ){
    if( city == '~error' ) {
      console.log( 'ERROR ' + text );
    } else {
      var message = 
          ( city == '~say' )? text
        : ( city == '~smile' )? ':smile:'
        : ( city == '~hello' )? 'Hi! I can tell weather in your city. Just say `Kyiv?` to invoke me!'
        : ( city == '~thank' )? 'You are welcome! :)'
        : '';

      if( city && !message ) {
        w.weatherByCity( city, function( err, data ){
          if( data[1] != 'City was not found' ) {
            var emoji = 
                ( data[1].match( /clear/i ) )? ':sunny:'
              : ( data[1].match( /(broken clouds)|(scattered clouds)/i ) )? ':sun_small_cloud:'
              : ( data[1].match( /shower rain/i ) )? ':rain_cloud:'
              : ( data[1].match( /clouds/i ) )? ':partly_sunny:'
              : ( data[1].match( /snow/i ) )? ':snow_cloud:'
              : ( data[1].match( /rain/i ) )? ':rain_cloud:'
              : '';
            self.postMessageToChannel( channel.name, 
                  emoji+' Today in '+city+' '
                  +data[0]+'°C, '
                  +data[1]
                  +', wind: '+data[2]+'m/s'
                , {as_user: true} )
          }
        })
      } else if( message ){
        self.postMessageToChannel( channel.name, message, {as_user: true} )
      }
    }
  })

};

weatherBot.prototype._loadBotUser = function () {
  var self = this;
  this.user = this.users.filter(function (user) {
    return user.name === self.name;
  })[0];
};

weatherBot.prototype._welcomeMessage = function () {
  var self = this;
  self.settings.myChannels.forEach(function( myChannel ){
    self.channels.forEach(function( channel ){
      if( channel.name == myChannel ){
        self.postMessageToChannel(channel.name, 'Hi! I can tell weather in your city. Just say `Kyiv?` to invoke me!',
          {as_user: true});
      }
    });
  });
};

weatherBot.prototype._isChatMessage = function (message) {
  console.log( message );
  return message.type === 'message' && Boolean(message.text);
};

weatherBot.prototype._isChannelConversation = function (message) {
  return typeof message.channel === 'string'
      && message.channel[0] === 'C';
};

weatherBot.prototype._isFromWeatherBot = function (message) {
  return message.user === this.user.id;
};

weatherBot.prototype._getChannelById = function (channelId) {
  return this.channels.filter(function (item) {
      return item.id === channelId;
  })[0];
};

module.exports = weatherBot;
