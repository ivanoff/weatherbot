'use strict';

var climate = require('city-weather');

module.exports = function ( cityName, callback ) {

  cityName = 'Kyiv'; // Just Kyiv right now
  
  var result;
 
  climate.getMaximumTemp(cityName, function(temp){
    console.log("Maximum temperature: " + temp);
  });
 
  climate.getMinimumTemp(cityName, function(temp){
    console.log("Minimum temperature: " + temp);
  });
 
  climate.getActualTemp(cityName, function(temp){
    console.log("Actual temperature: " + temp);
    result += "Actual temperature: " + temp + ". "

    climate.getClimateDescription(cityName, function(description){
      console.log("Climate description: " + description);
      result += "Climate description: " + description + ". "

      climate.getWindSpeed(cityName, function(speed){
        console.log("Wind speed: " + speed);
        result += "Wind speed: " + speed + ". "
        callback( null, result );
      });
  
  });
 
  });
 
  
}