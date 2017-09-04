var express = require('express');
var router = express.Router();
var passport = require('passport'); // probably unnecessary but moving this over from eta.router.js
var path = require('path');
var pool = require('../modules/pool.js');
var matchCountdown;


 router.matched = function() {
   console.log("driver and rider matched, terminate the loop");
   clearInterval(matchCountdown);
 };

 function offerDriverRide() {
   console.log("Offering ride to driver");
 }

// match rider to driver based on (1) driver being live, (2) specific needs, (3) 5 drivers closest to rider
router.get('/match', function(req, res, next) {
  console.log('matching ride', req.user);
  // console.log('req.socket', req.socket);
  var queryText = ['WITH rider_lng AS (SELECT ST_X(start_location::geometry) AS rlng FROM trips WHERE complete = FALSE AND rider_id = $1), rider_lat AS (SELECT ST_Y(start_location::geometry) AS rlat FROM trips WHERE complete = FALSE AND rider_id = $1) SELECT *, id FROM drivers WHERE live = true'];
  if(req.user.elec_wheelchair) queryText.push(' AND elec_wheelchair = true');
  if(req.user.col_wheelchair) queryText.push(' AND col_wheelchair = true');
  if(req.user.service_animal) queryText.push(' AND service_animal = true');
  if(req.user.oxygen) queryText.push(' AND oxygen = true');
  queryText.push('ORDER BY location <-> st_setsrid(st_makepoint((SELECT rlng FROM rider_lng), (SELECT rlat FROM rider_lat)),4326) LIMIT 5');
  queryText = queryText.join(' ');
  console.log('query text', queryText);
  req.user.socket_id = req.socket.id;
  req.user.coord = req.coord;
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query(queryText, [req.user.id], function(err, result) {
        done();

        if(err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          req.io.to(result.rows[0].driver_socket).emit('find-driver', req.user);
          res.send({drivers: result.rows});
          matchCountdown = setInterval(offerDriverRide,1000);



          // send info to [0].driver via socket, if they don't accept ride in 60 seconds, then loop through array
          // until a driver does accept
          // so we need to send the info to the first driver
          // if they accept call function inside socket.on('driver-accept') that closes this matching logic
          // else if timer gets to 60 seconds, repeat process with next driver in array
          // for(var i = 0, i < result.rows.length, i++) {
            //  function(i) {
          //     req.io.to(result.rows[i].driver_socket).emit('find-driver', req.user);
          //        setInterval(function(){ alert("Hello"); }, 3000);
          //        if(response=accepted) {return: driver-rider matched}
          //         else {}
          // }
          //}
          // if we reach end of array with no accepted drivers then encourage rider to try their ride request again


          }
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
