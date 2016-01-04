'use strict';

var climate = require('city-weather');
var async   = require('async');

exports.weatherByCity = function( cityName, callback ){
  if( !cityName ) {
    callback( 'No city name!' );
  } else {
    async.parallel([
      function(callback){
        climate.getActualTemp(cityName, function(temperature){
          callback( null, temperature );
        })
      },
      function(callback){
        climate.getClimateDescription(cityName, function(description){
          callback( null, description );
        })
      },
      function(callback){
        climate.getWindSpeed(cityName, function(speed){
          callback( null, speed );
        })
      },
    ],
    function(err, results){
      callback( err, results );
    });
  }
}

