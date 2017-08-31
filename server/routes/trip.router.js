var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');

router.get('/match', function(req, res, next) {
  console.log('matching ride', req.user);
  // 'how to get riders lng/lat from this route...'
  var rider = {};
  rider.lng = -74.23;
  rider.lat = 45;
  var queryText = ['SELECT *, id FROM drivers  WHERE live = true'];
  if(req.user.elec_wheelchair) queryText.push(' AND elec_wheelchair = true');
  if(req.user.col_wheelchair) queryText.push(' AND col_wheelchair = true');
  if(req.user.service_animal) queryText.push(' AND service_animal = true');
  if(req.user.oxygen) queryText.push(' AND oxygen = true');
  queryText.push('ORDER BY location <-> st_setsrid(st_makepoint($1,$2),4326) LIMIT 10');
  queryText = queryText.join(' ');
  console.log('query text', queryText);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query(queryText, [rider.lng, rider.lat], function (err, result) {
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
