var express = require('express');
var router = express.Router();
var passport = require('passport'); // probably unnecessary but moving this over from eta.router.js
var path = require('path');
var pool = require('../modules/pool.js');

// match rider to driver based on (1) driver being live, (2) specific needs, (3) 5 drivers closest to rider
router.get('/match', function(req, res, next) {
  console.log('matching ride', req.user);
  var queryText = ['WITH rider_lng AS (SELECT ST_X(start_location::geometry) AS rlng FROM trips WHERE complete = FALSE AND rider_id = $1), rider_lat AS (SELECT ST_Y(start_location::geometry) AS rlat FROM trips WHERE complete = FALSE AND rider_id = $1) SELECT *, id FROM drivers WHERE live = true'];
  if(req.user.elec_wheelchair) queryText.push(' AND elec_wheelchair = true');
  if(req.user.col_wheelchair) queryText.push(' AND col_wheelchair = true');
  if(req.user.service_animal) queryText.push(' AND service_animal = true');
  if(req.user.oxygen) queryText.push(' AND oxygen = true');
  // HOW TO PASS rider_lng and rider_lat into st_makepoint???
  queryText.push('ORDER BY location <-> st_setsrid(st_makepoint((SELECT rlng FROM rider_lng), (SELECT rlat FROM rider_lat)),4326) LIMIT 5');
  queryText = queryText.join(' ');
  console.log('query text', queryText);
  // console.log('rider_lng', rider_lng);
  // console.log('rider_lat', rider_lat);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query(queryText, [req.user.id], function (err, result) {
        done();

        if(err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.send({drivers: result.rows.driver_socket});
          io.to(data.driver_id).emit('find-driver', data);        }
      });
    });
  }
}

); // end of match route


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
      // console.log('matrix test response from the router', response.json.rows);
    })



module.exports = router;
