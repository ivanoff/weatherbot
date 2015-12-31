"use strict";

var assert = require('assert');

var workingHoursLimit = 9;
var analyze, params, str;

describe('analyze testing', function () {

  describe('check totalTime', function () {
    before (function() { analyze = require( '../lib/analyze' )( workingHoursLimit, params = {} ) });
    after  (function() { analyze = null });
    it('Check totalTime for 01:10', function ( done ) {
      analyze.totalTime( '<div class="th td5">Total for the period: 01:10</div>', function( e, workingHours ) {
        assert.equal( workingHours, '01:10' );
        done();
      })
    });
    it('Check totalTime for 09:32', function ( done ) {
      analyze.totalTime( '<div class="th td5">Total for the period: 09:32</div>', function( e, workingHours ) {
        assert.equal( workingHours, '09:32' );
        done();
      })
    });
    it('Check totalTime for 18:47', function ( done ) {
      analyze.totalTime( '<div class="th td5">Total for the period: 18:47</div>', function( e, workingHours ) {
        assert.equal( workingHours, '18:47' );
        done();
      })
    });
    it('Check totalTime for 253:47', function ( done ) {
      analyze.totalTime( '<div class="th td5">Total for the period: 253:47</div>', function( e, workingHours ) {
        assert.equal( workingHours, '253:47' );
        done();
      })
    });
    it('Check totalTime for 00:00', function ( done ) {
      analyze.totalTime( '<div class="th td5">Total for the period: 00:00</div>', function( e, workingHours ) {
        assert.equal( workingHours, '00:00' );
        done();
      })
    });
    it('Check totalTime for unknown', function ( done ) {
      analyze.totalTime( '<div class="th td5">Total for the period: unknown</div>', function( e, workingHours ) {
        assert.equal( workingHours, null );
        done();
      })
    });
  });

  describe('expiredAlert in usual case', function () {
    before (function() { analyze = require( '../lib/analyze' )( workingHoursLimit, params = {} ) });
    after  (function() { analyze = null });
    it('Check expiredAlert, then 2 hours spent', function ( done ) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 02:00</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 8:59 hours spent', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 08:59</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 9 hours spent', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 09:00</div>', function( e, expired ) {
        assert.equal( expired, 1 );
        done();
      })
    });
    it('Check expiredAlert, in next minute after expiredAlert was true', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 09:01</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 10 hours spent after expiredAlert was true', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 10:00</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
  });

  describe('expiredAlert in case of late runninig', function () {
    before (function() { analyze = require( '../lib/analyze' )( workingHoursLimit, params = {} ) });
    after  (function() { analyze = null });
    it('Check expiredAlert, then more than 9 hours spent', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 09:31</div>', function( e, expired ) {
        assert.equal( expired, 1 );
        done();
      })
    });
    it('Check expiredAlert, in next minute after expiredAlert was true', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 09:32</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 10 hours spent after expiredAlert was true', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 10:41</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
  });
      
  describe('expiredAlert in case of luck clock', function () {
    before (function() { analyze = require( '../lib/analyze' )( workingHoursLimit, params = {} ) });
    after  (function() { analyze = null });
    it('Check expiredAlert, then 2 hours spent', function ( done ) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 02:00</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then more than 9 hours spent', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 09:31</div>', function( e, expired ) {
        assert.equal( expired, 1 );
        done();
      })
    });
    it('Check expiredAlert, then 3 hours spent', function ( done ) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 03:00</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then more than 9 hours spent again', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 09:31</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 2 hours spent again...', function ( done ) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 02:00</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 10 hours spent', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 10:41</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
  });

  describe('expiredAlert in usual case of expiredAlert is true', function () {
    before (function() { analyze = require( '../lib/analyze' )( workingHoursLimit, params = { expiredAlertFlag: 1 } ) });
    after  (function() { analyze = null });
    it('Check expiredAlert, then 2 hours spent', function ( done ) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 02:00</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 8:59 hours spent', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 08:59</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 9 hours spent', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 09:00</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, in next minute', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 09:01</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
    it('Check expiredAlert, then 10 hours spent', function (done) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: 10:00</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
  });

  describe('expiredAlert in unknown case of expiredAlert', function () {
    before (function() { analyze = require( '../lib/analyze' )( workingHoursLimit, params = {} ) });
    after  (function() { analyze = null });
    it('Check expiredAlert, then no hours spent', function ( done ) {
      analyze.expiredAlert( '<div class="th td5">Total for the period: unknown</div>', function( e, expired ) {
        assert.equal( expired, undefined );
        done();
      })
    });
  });

  describe('analyze newMovements', function () {
    before (function() { str = ''; analyze = require( '../lib/analyze' )( workingHoursLimit, params = {} ) });
    after  (function() { analyze = null });
    it('Check empty movies', function ( done ) {
      analyze.newMovements( str, function( e, move ) {
        assert.deepEqual( move, [] );
        done();
      })
    });
    it('Check move in H-5 sector', function ( done ) {
      str +=  '<div class="tr cf">\n'+
              '<div class="td td1">H-5</div>\n'+
              '<div class="td td2">11:39 - 11:43</div>\n'+
              '<div class="td td3">00:03</div>\n'+
              '<div class="td td4"></div>\n'+
              '<div class="td td5 ">&nbsp;</div>\n'+
              '</div>\n';
      analyze.newMovements( str, function( e, move ) {
        assert.deepEqual( move, [ { sector: 'H-5', moveIn: '11:39', moveOut: '11:43' } ] );
        done();
      })
    });
    it('Check for no movies', function ( done ) {
      analyze.newMovements( str, function( e, move ) {
        assert.deepEqual( move, [] );
        done();
      })
    });
    it('Check move in R-1 and L-9 sector', function ( done ) {
      str +=  '<div class="tr cf">\n'+
              '<div class="td td1">R-1</div>\n'+
              '<div class="td td2">11:43 - 11:43</div>\n'+
              '<div class="td td3">00:00</div>\n'+
              '<div class="td td4"></div>\n'+
              '<div class="td td5 ">&nbsp;</div>\n'+
              '</div>\n'+
              '<div class="tr cf">\n'+
              '<div class="td td1">L-9</div>\n'+
              '<div class="td td2">11:43 - 16:07</div>\n'+
              '<div class="td td3">04:23</div>\n'+
              '<div class="td td4"></div>\n'+
              '<div class="td td5 ">&nbsp;</div>\n'+
              '</div>\n';
      analyze.newMovements( str, function( e, move ) {
        assert.deepEqual( move, [ { sector: 'R-1', moveIn: '11:43', moveOut: '11:43' }, { sector: 'L-9', moveIn: '11:43', moveOut: '16:07' } ] );
        done();
      })
    });
    it('Check for no movies', function ( done ) {
      analyze.newMovements( str, function( e, move ) {
        assert.deepEqual( move, [] );
        done();
      })
    });
  });
      
});
