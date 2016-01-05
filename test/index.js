"use strict";

var w, r;

describe('weather module', function () {
  beforeEach(function(){
    w = require('../lib/modules/weather');
  });
  afterEach(function(){
    w = null;
  });

  describe('check weatherByCity', function () {
    it('result is array with 3 elements', function (done) {
      w.weatherByCity( 'Kyiv', function( err, data ){
        data.should.be.type('object');
        data.should.be.instanceof(Array).and.have.lengthOf(3);
        done();
      });
    });

    it('first and last elements are numbers, second is string', function (done) {
      w.weatherByCity( 'Kyiv', function( err, data ){
        data[0].should.be.a.Number();
        data[1].should.be.a.String();
        data[2].should.be.a.Number();
        done();
      });
    });

    it('first element is greater than -100 and less than 100, third element is positive', function (done) {
      w.weatherByCity( 'Kyiv', function( err, data ){
        (data[0]<100).should.be.true;
        (data[0]>-100).should.be.true;
        (data[2]<300).should.be.true;
        (data[2]>=0).should.be.true;
        done();
      });
    });

    it('No city name message', function (done) {
      w.weatherByCity( '', function( err, data ){
        err.should.be.a.String();
        err.should.be.equal('No city name!');
        done();
      });
    });

    it('city unknown or something wrong', function (done) {
      w.weatherByCity( 'city unknown or something wrong', function( err, data ){
        data[0].should.be.equal('City was not found');
        done();
      });
    });

  });
      
});


describe('rules module', function () {
  beforeEach(function(){
    r = require('../lib/modules/rules');
  });
  afterEach(function(){
    r = null;
  });

  describe('get city names from message', function () {
    it('Kyiv', function (done) {
      r.getCityName( 'Kyiv', function( err, name ){
        name.should.be.a.String();
        name.should.equal('Kyiv');
        done();
      });
    });

    it('lviv?', function (done) {
      r.getCityName( 'lviv?', function( err, name ){
        name.should.be.a.String();
        name.should.equal('lviv');
        done();
      });
    });

    it('What about New York city?', function (done) {
      r.getCityName( 'What about New York city?', function( err, name ){
        name.should.be.a.String();
        name.should.equal('New York');
        done();
      });
    });

    it('Can you show the weather in London', function (done) {
      r.getCityName( 'Can you show the weather in London', function( err, name ){
        name.should.be.a.String();
        name.should.equal('London');
        done();
      });
    });

    it('If the  city is New  York then  what about it??', function (done) {
      r.getCityName( 'If the  city is New  York then  what about it??', function( err, name ){
        name.should.be.a.String();
        name.should.equal('New York');
        done();
      });
    });

  });
  

  describe('get city names from bad message', function () {
    it('Can you not to show weather in New York city?', function (done) {
      r.getCityName( 'Can you not to show weather in New York city?', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~say');
        text.should.equal('Gee... There is no weather in New York, pal :)');
        done();
      });
    });

    it("I don't want to know what in Oslo", function (done) {
      r.getCityName( "I don't want to know what in Oslo", function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~say');
        text.should.equal('Gee... There is no weather in Oslo, pal :)');
        done();
      });
    });

    it('if the city is new york in lowercase, then what about it?', function (done) {
      r.getCityName( 'if the city is new york in lowercase, then what about it?', function( err, name ){
        name.should.be.a.String();
        name.should.equal('~error');
        done();
      });
    });

    it('Weatherbot, who I am?', function (done) {
      r.getCityName( 'Weatherbot, who I am?', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~who');
        done();
      });
    });

    it('Who I am?', function (done) {
      r.getCityName( 'Who I am?', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~who');
        done();
      });
    });

    it('Who I am?', function (done) {
      r.getCityName( '<@U188FTX16|dr.cool> has joined the channel', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~helloNew');
        text.should.equal('dr.cool');
        done();
      });
    });

    it('Weatherbot, you are the tin can', function (done) {
      r.getCityName( 'Weatherbot, you are the tin can', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~set');
        text.should.equal('the tin can');
        done();
      });
    });

    it('Weatherbot, who are you?', function (done) {
      r.getCityName( 'Weatherbot, who are you?', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~get');
        done();
      });
    });

    it('Weatherbot, are you the tin can?', function (done) {
      r.getCityName( 'Weatherbot, are you the tin can?', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~get');
        text.should.equal('the tin can');
        done();
      });
    });

    it('No, Weatherbot, you are the tin-tin can', function (done) {
      r.getCityName( 'No, Weatherbot, you are the tin-tin can', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~set');
        text.should.equal('the tin-tin can');
        done();
      });
    });

    it('weatherbot can help', function (done) {
      r.getCityName( 'weatherbot can help', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~smile');
        done();
      });
    });

    it('thanks', function (done) {
      r.getCityName( 'thanks', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~thanks');
        done();
      });
    });

    it('bot, you are the tin can', function (done) {
      r.getCityName( 'bot, you are the tin can', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~error');
        text.should.equal('BAD CITY NAME: bot, you are the tin can');
        done();
      });
    });

    it(':smile:', function (done) {
      r.getCityName( ':smile:', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~error');
        text.should.equal('BAD CITY NAME: :smile');
        done();
      });
    });

    it('hello', function (done) {
      r.getCityName( 'hello', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~hello');
        done();
      });
    });

    it('help', function (done) {
      r.getCityName( 'help', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~hello');
        done();
      });
    });

    it('cool', function (done) {
      r.getCityName( 'cool', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~smile');
        done();
      });
    });

    it('Ha-haha', function (done) {
      r.getCityName( 'Ha-haha', function( err, name, text ){
        name.should.be.a.String();
        name.should.equal('~smile');
        done();
      });
    });

  });

});
