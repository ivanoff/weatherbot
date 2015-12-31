'use strict';

var util = require('util');
var Bot  = require('slackbots');
var w    = require('./modules/weather');

var weatherBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'weatherbot';
  this.settings.myChannels = this.settings.channels.split(',');

  console.log( this.channels );
/*
  self.settings.allChannels = [];
  self.channels.forEach(function( channel ){
    self.settings.allChannels.push( channel.name );
  });
*/

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
    && this._isMentioningWeather(message)
  ) {
    this._replyWeather(message);
  }
};

weatherBot.prototype._replyWeather = function (message) {
  var self = this;
  var channel = self._getChannelById( message.channel );
console.log( channel );
console.log( message );
  w( message, function( err, data ){
    self.postMessageToChannel(channel.name, data || 'Opss...', {as_user: true});
  });
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
          {as_user: true, icon_emoji: ':snowflake:'});
      }
    });
  });
/*
    this.postMessageToChannel(this.channels[0].name, 'Hi! \n' +
        'I can tell weather in your city. Just say `Kyiv?` or `<yourCityName>?` to invoke me!',
        {as_user: true});
*/
};

weatherBot.prototype._isChatMessage = function (message) {
  return message.type === 'message' && Boolean(message.text);
};

weatherBot.prototype._isChannelConversation = function (message) {
  return typeof message.channel === 'string'
      && message.channel[0] === 'C';
};

weatherBot.prototype._isMentioningWeather = function (message) {
  return message.text.toLowerCase().indexOf('Kyiv?') > -1
      || message.text.toLowerCase().indexOf(this.name) > -1;
};

weatherBot.prototype._isFromweatherBot = function (message) {
  return message.user === this.user.id;
};

weatherBot.prototype._getChannelById = function (channelId) {
  return this.channels.filter(function (item) {
      return item.id === channelId;
  })[0];
};

module.exports = weatherBot;
