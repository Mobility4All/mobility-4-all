var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');

router.get('/match', function(req, res, next) {
  console.log('matching ride', req.user);
  // 'how to get riders lng/lat from this route...'
  // SELECT start_location FROM trips WHERE rider_id = $1 AND complete = FALSE;
  // [req.user.id]
  // JOIN this
  // var rider = {};
  // rider.lng = -74.23;
  // rider.lat = 45;
  // WITH rider_lng AS (ST_X(start_location::geometry) FROM trips),rider_lat AS (ST_Y(start_location::geometry) FROM trips;)
  var queryText = ['WITH rider_lng AS (SELECT ST_X(start_location::geometry) FROM trips WHERE rider_id = $1), rider_lat AS (SELECT ST_Y(start_location::geometry) FROM trips WHERE rider_id = $1) SELECT *, id FROM drivers WHERE live = true'];
  if(req.user.elec_wheelchair) queryText.push(' AND elec_wheelchair = true');
  if(req.user.col_wheelchair) queryText.push(' AND col_wheelchair = true');
  if(req.user.service_animal) queryText.push(' AND service_animal = true');
  if(req.user.oxygen) queryText.push(' AND oxygen = true');
  // HOW TO PASS rider_lng and rider_lat into st_makepoint???
  queryText.push('ORDER BY location <-> st_setsrid(st_makepoint(-90,45),4326) LIMIT 10');
  queryText = queryText.join(' ');
  console.log('query text', queryText);
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
          res.send({drivers: result.rows})
        }
      });
    });
  }
}

);

module.exports = router;
