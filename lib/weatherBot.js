'use strict';

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

  if( channel.name == 'weather' ) {
    r.getCityName( message.text, function( err, city ){

      var iam = city.match( /^weatherbot[,\s]+(you're|you'are|you are)\s(.*)/i )
      if( iam ){
        self.postMessageToChannel( channel.name, "Yes, I'm "+iam[2]+" :)", {as_user: true} )
      } 
      else if( city.match( /weatherbot/i ) ){
        self.postMessageToChannel( channel.name, ":smile:", {as_user: true} )
      } 
      else if( city.match( /^\W/ ) || city.match( /^.{1,2}$/ ) || city.match( /(.*\s){3,}/ ) ){
        console.log( 'ERROR BAD CITY NAME: ' + city );
      } 
      else if( city.match( /(thank you)|(tanks)|(thanks)|(10x)/i ) ){
        self.postMessageToChannel( channel.name, 'You are welcome! :)', {as_user: true} )
      } 
      else if( city && message.text.match( /(don't)|(can't show)|(do not)|(not to)/i ) ){
        self.postMessageToChannel( channel.name, 'Gee... There is no weather in '+city+', pal :)', {as_user: true} )
      } else {
        w.weatherByCity( city, function( err, data ){
          if( data[1] != 'City was not found' ) {
            var emoji = 
                ( data[1].match( /clear/i ) )? ':sunny:'
              : ( data[1].match( /(broken clouds)|(scattered clouds)/i ) )? ':sun_small_cloud:'
              : ( data[1].match( /shower rain/i ) )? ':rain_cloud:'
              : ( data[1].match( /clouds/i ) )? ':partly_sunny:'
              : ( data[1].match( /snow/i ) )? ':snow_cloud:'
              : ( data[1].match( /rain/i ) )? ':rain_cloud:'
              :'';
            self.postMessageToChannel( channel.name, emoji+' Today in '+city+' '
              +data[0]+'°C, '
              +data[1]+', wind: '
              +data[2]+'m/s', 
            {as_user: true, icon_emoji: ':snowflake:'});
          }
        });
      }
    })
  };
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
        self.postMessageToChannel(channel.name, 'Hi! I can tell weather in your city. Just say `Kyiv?` to invoke me! // still testing...',
          {as_user: true, icon_emoji: ':snowflake:'});
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
