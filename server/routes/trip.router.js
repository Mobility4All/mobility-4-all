var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');


// Finds all drivers that are live and meet the requirements of the rider
router.get('/match', function(req, res, next) {
  console.log('matching ride', req.user);
  // var queryText = 'SELECT * FROM drivers WHERE ST_Distance_Sphere(location, ST_MakePoint($1,$2)) <= radius_mi * 1609.34'
  var queryText = ['SELECT * FROM drivers WHERE live = true'];
  if(req.user.elec_wheelchair) queryText.push('elec_wheelchair = true');
  if(req.user.col_wheelchair) queryText.push('col_wheelchair = true');
  if(req.user.service_animal) queryText.push('service_animal = true');
  if(req.user.oxygen) queryText.push('oxygen = true');
  queryText = queryText.join(' AND ')
  console.log('query text', queryText);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query(queryText, [], function (err, result) {
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
