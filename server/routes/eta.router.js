var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

//Cat is Sandboxing Google Maps Distance Matrix here//
var distanceMatrixKey = process.env.DISTANCE_MATRIX_KEY || require('../modules/key.config.js').distanceMatrixKey;
var directionsWebServiceKey = process.env.DIR_WEB_SERVICE_KEY || require('../modules/key.config.js').directionsWebServiceKey;

var googleMapsClient = require('@google/maps').createClient({
  key: distanceMatrixKey,
  Promise: Promise
});




//this is a distance matrix test case//

    googleMapsClient.distanceMatrix({
      origins: [
        'Perth, Australia', 'Sydney, Australia', 'Melbourne, Australia',
        'Adelaide, Australia', 'Brisbane, Australia', 'Darwin, Australia',
        'Hobart, Australia', 'Canberra, Australia'
      ],
      destinations: [
        'Uluru, Australia'
      ]
    })
    .asPromise()
    .then(function(response) {
      console.log('matrix test response from the router', response.json.rows);
    })


module.exports = router;
